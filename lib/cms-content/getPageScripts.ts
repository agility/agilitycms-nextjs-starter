import { Page } from "@agility/content-fetch"
import { htmlToDOM } from "html-react-parser"

/**
 * The "Scripts" fields on a page (Page Settings > Scripts in Agility CMS).
 * These are returned by the Fetch API but are not yet part of the
 * @agility/content-fetch `Page` type, so they are declared here.
 */
export interface PageScriptsFields {
	top?: string | null
	bottom?: string | null
	excludedFromGlobal?: boolean
}

export type PageWithScripts = Page & { scripts?: PageScriptsFields | null }

/** An executable <script> tag (inline or external) found in the page's markup. */
export interface PageScript {
	id: string
	src?: string
	type?: string
	code?: string
	attributes: Record<string, string>
}

export interface PageScripts {
	/** JSON-LD blocks, already validated, re-serialized and safe to inline in a <script> tag. */
	jsonLd: string[]
	/** Scripts from Additional Header Markup and the "Top" Scripts field. */
	headScripts: PageScript[]
	/** Scripts from the "Bottom" Scripts field. */
	bodyScripts: PageScript[]
}

interface ScriptTag {
	attributes: Record<string, string>
	content: string
}

// Characters that rich-text editors paste into JSON and that JSON.parse rejects outside strings.
const NBSP_AND_LINE_SEPARATORS = /[\u00A0\u2028\u2029]/g

const getText = (node: any): string => {
	if (!node) return ""
	if (node.type === "text") return node.data || ""
	if (Array.isArray(node.children)) return node.children.map(getText).join("")
	return ""
}

/**
 * Pull every <script> tag out of a fragment of HTML.
 * Other tags are ignored here (meta tags are handled by resolveAgilityMetaData).
 */
const extractScriptTags = (html: string | null | undefined, source: string): ScriptTag[] => {
	if (!html || !html.trim()) return []

	const tags: ScriptTag[] = []
	try {
		const nodes = htmlToDOM(html) as any[]
		for (const node of nodes) {
			if (node?.type === "script" && node.name === "script") {
				tags.push({
					attributes: { ...(node.attribs || {}) },
					content: getText(node),
				})
			} else if (node?.type === "tag" && source !== "Additional Header Markup") {
				console.warn(`Could not output <${node.name}> tag from the page's ${source} field; only <script> tags are supported there.`)
			}
		}
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

const toPageScript = (tag: ScriptTag, id: string): PageScript => {
	const { src, type, id: tagId, async: _async, defer: _defer, ...attributes } = tag.attributes
	return {
		id: tagId || id,
		src: src || undefined,
		type: type || undefined,
		code: src ? undefined : tag.content,
		attributes,
	}
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
		{ source: "Additional Header Markup", key: "meta", html: page.seo?.metaHTML, target: result.headScripts },
		{ source: "Scripts (Top)", key: "top", html: scriptsFields?.top, target: result.headScripts },
		{ source: "Scripts (Bottom)", key: "bottom", html: scriptsFields?.bottom, target: result.bodyScripts },
	]

	for (const { source, key, html, target } of sources) {
		extractScriptTags(html, source).forEach((tag, index) => {
			if (isJsonLd(tag)) {
				const json = serializeJsonLd(tag.content, source)
				if (json) result.jsonLd.push(json)
			} else if (tag.attributes.src || tag.content.trim()) {
				target.push(toPageScript(tag, `agility-page-${page.pageID}-${key}-${index}`))
			}
		})
	}

	return result
}
