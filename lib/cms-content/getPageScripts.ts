import { Page } from "@agility/content-fetch"
import { attributesToProps, htmlToDOM } from "html-react-parser"

/**
 * The "Scripts" fields on a page (Page Settings > Scripts in Agility CMS).
 * These are returned by the Fetch API but are not yet part of the
 * @agility/content-fetch `Page` type, so they are declared here.
 */
export interface PageScriptsFields {
	top?: string | null
	bottom?: string | null
	/**
	 * Whether this page opts out of the instance's global scripts. It only applies to global
	 * scripts, which this starter doesn't render, so it isn't used here.
	 */
	excludedFromGlobal?: boolean
}

export type PageWithScripts = Page & { scripts?: PageScriptsFields | null }

/** An executable <script> tag (inline or external) found in the page's markup. */
export interface PageScript {
	/** React key; not rendered as an attribute. */
	key: string
	/**
	 * Every attribute of the original tag (src, type, async, defer, crossorigin, integrity,
	 * nonce, id, data-*, …) converted to React props. Inline event handlers (on*) are removed.
	 */
	props: Record<string, unknown>
	/** Inline body, when the tag has no `src`. */
	code?: string
}

export interface PageScripts {
	/** JSON-LD blocks, already validated, re-serialized and safe to inline in a <script> tag. */
	jsonLd: string[]
	/** Scripts from Additional Header Markup, then the "Top" Scripts field, in document order. */
	headScripts: PageScript[]
	/** Scripts from the "Bottom" Scripts field, in document order. */
	bodyScripts: PageScript[]
}

interface ScriptTag {
	attributes: Record<string, string>
	content: string
	/** The element the <script> was nested in, if it wasn't at the top level. */
	parentName?: string
}

const ADDITIONAL_HEADER_MARKUP = "Additional Header Markup"

// Elements whose contents must never be treated as live scripts.
const INERT_ELEMENTS = new Set(["noscript", "template"])

// Characters that rich-text editors paste into JSON and that JSON.parse rejects outside strings.
const NBSP_AND_LINE_SEPARATORS = /[\u00A0\u2028\u2029]/g

const getText = (node: any): string => {
	if (!node) return ""
	if (node.type === "text") return node.data || ""
	if (Array.isArray(node.children)) return node.children.map(getText).join("")
	return ""
}

/**
 * Pull every <script> tag out of a fragment of HTML, in document order, including scripts
 * nested inside other elements (e.g. a <div> wrapper). Other tags are not output: meta tags in
 * Additional Header Markup are handled by resolveAgilityMetaData, and anything else is warned about.
 */
const extractScriptTags = (html: string | null | undefined, source: string): ScriptTag[] => {
	if (!html || !html.trim()) return []

	const tags: ScriptTag[] = []
	const walk = (nodes: any[], parentName?: string) => {
		for (const node of nodes) {
			if (node?.type === "script" && node.name === "script") {
				tags.push({ attributes: { ...(node.attribs || {}) }, content: getText(node), parentName })
			} else if ((node?.type === "tag" || node?.type === "style") && !INERT_ELEMENTS.has(node.name)) {
				if (source !== ADDITIONAL_HEADER_MARKUP) {
					console.warn(`Could not output <${node.name}> tag from the page's ${source} field; only <script> tags are supported there.`)
				}
				if (Array.isArray(node.children)) walk(node.children, node.name)
			}
		}
	}

	try {
		walk(htmlToDOM(html) as any[])
	} catch (error) {
		console.warn(`Could not parse the page's ${source} field.`, error)
	}
	return tags
}

const isJsonLd = (tag: ScriptTag) => (tag.attributes.type || "").trim().toLowerCase() === "application/ld+json"

/**
 * Validate a JSON-LD block and re-serialize it so it is safe to inline.
 * Returns null (and warns) if the JSON is invalid, so a bad paste never breaks the page.
 */
export const serializeJsonLd = (raw: string, source: string): string | null => {
	let parsed: unknown
	try {
		parsed = JSON.parse(raw)
	} catch {
		try {
			parsed = JSON.parse(raw.replace(NBSP_AND_LINE_SEPARATORS, " "))
		} catch (error) {
			console.warn(`Skipping invalid JSON-LD in the page's ${source} field: ${(error as Error).message}`)
			return null
		}
	}

	// escape "<" so the content can never close the surrounding <script> tag
	return JSON.stringify(parsed).replace(/</g, "\\u003c")
}

const toPageScript = (tag: ScriptTag, key: string): PageScript => {
	// Inline event handlers (onload, onerror, …) can't be passed to React as strings; drop them.
	const attributes = Object.fromEntries(
		Object.entries(tag.attributes).filter(([name]) => !name.toLowerCase().startsWith("on"))
	)
	const props = attributesToProps(attributes) as Record<string, unknown>
	const hasSrc = typeof props.src === "string" && props.src.trim() !== ""
	return { key, props, code: hasSrc ? undefined : tag.content }
}

/**
 * Get the JSON-LD and scripts that a page defines in Agility CMS:
 * - <script> tags in SEO > Additional Header Markup (`seo.metaHTML`)
 * - the Scripts > Top and Bottom fields (`scripts.top` / `scripts.bottom`)
 *
 * Next.js `generateMetadata` cannot output <script> tags, so these are rendered by the page itself.
 */
export const getPageScripts = (page: Page | undefined | null): PageScripts => {
	const result: PageScripts = { jsonLd: [], headScripts: [], bodyScripts: [] }
	if (!page) return result

	const scriptsFields = (page as PageWithScripts).scripts
	const sources: { source: string; key: string; html: string | null | undefined; target: PageScript[] }[] = [
		{ source: ADDITIONAL_HEADER_MARKUP, key: "meta", html: page.seo?.metaHTML, target: result.headScripts },
		{ source: "Scripts (Top)", key: "top", html: scriptsFields?.top, target: result.headScripts },
		{ source: "Scripts (Bottom)", key: "bottom", html: scriptsFields?.bottom, target: result.bodyScripts },
	]

	for (const { source, key, html, target } of sources) {
		extractScriptTags(html, source).forEach((tag, index) => {
			if (tag.parentName) {
				console.warn(`A <script> inside <${tag.parentName}> in the page's ${source} field was output on its own; the <${tag.parentName}> itself is not output.`)
			}
			if (isJsonLd(tag)) {
				const json = serializeJsonLd(tag.content, source)
				if (json) result.jsonLd.push(json)
			} else if (tag.attributes.src?.trim() || tag.content.trim()) {
				target.push(toPageScript(tag, `agility-page-${page.pageID}-${key}-${index}`))
			}
		})
	}

	return result
}
