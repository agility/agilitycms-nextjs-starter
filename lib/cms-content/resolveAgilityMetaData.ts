import { AgilityPageProps, ImageField } from "@agility/nextjs"
import { generateAgilityMetadata } from "@agility/nextjs/geo"
import { ContentItem } from "@agility/content-fetch"
import { Metadata, ResolvingMetadata } from "next"
import { getHeaderContent } from "./getHeaderContent"
import { htmlToDOM } from "html-react-parser"
import { getContentItem } from "lib/cms/getContentItem"
import { getPageUrl, getSiteUrl } from "./getSiteUrl"

interface Props {
	agilityData: AgilityPageProps
	/** The path the page is served at (`/` for the home page). */
	path: string
	locale: string
	sitemap: string
	isPreview: boolean
	isDevelopmentMode: boolean
	parent: ResolvingMetadata
}

export const resolveAgilityMetaData = async ({ agilityData, path, locale, sitemap, isDevelopmentMode, isPreview, parent }: Props): Promise<Metadata> => {


	const header = await getHeaderContent({ locale, sitemap })
	const ogImages = (await parent).openGraph?.images || []
	const url = getPageUrl(path)
	const page = agilityData.page
	const dynamicPageItem = agilityData.dynamicPageItem as ContentItem | null | undefined

	//#region *** the page's SEO and GEO fields: title, description, canonical, robots, share image ***
	// On a dynamic page, generateAgilityMetadata uses the item's own description and URL; only the
	// dynamic page's robots carry over to its items.
	const seoMetadata = generateAgilityMetadata({
		page,
		item: dynamicPageItem,
		url,
		locale,
		title: agilityData.sitemapNode?.title,
		titleTemplate: header?.siteName ? `%s | ${header.siteName}` : undefined,
	})
	const seoImages = (seoMetadata.openGraph?.images || []) as typeof ogImages
	//#endregion

	//#region *** resolve open graph stuff from dynamic pages ***
	if (agilityData.sitemapNode.contentID !== undefined
		&& agilityData.sitemapNode.contentID > 0) {

		//get the content item for this dynamic page
		try {
			const contentItem: ContentItem = await getContentItem({
				contentID: agilityData.sitemapNode.contentID,
				languageCode: locale,
				locale
			})

			if (contentItem.properties.definitionName === "Post") {
				/* *** Posts MetaData *** */
				const image = contentItem.fields["image"] as ImageField | undefined

				if (image) {
					ogImages.push({
						url: `${image.url}?format=auto&w=1200`,
						alt: image.label
					})
				}
			} else {
				//TODO: handle other dynamic pages types here!
			}

		} catch (error) {
			console.warn("Could not resolve open graph meta data from dynamic page contentID:", agilityData.sitemapNode.contentID, error)
		}
	}
	//#endregion

	//#region *** resolve the meta tags in Additional Header Markup (seo.metaHTML) ***
	// A dynamic page's markup applies to every item it renders; the item's own markup follows it and wins.
	const pageTags = resolveAdditionalMetaTags(page?.seo?.metaHTML, ogImages)
	const itemTags = resolveAdditionalMetaTags(dynamicPageItem?.seo?.metaHTML, ogImages)
	const openGraph = { ...pageTags.openGraph, ...itemTags.openGraph }
	const other = { ...pageTags.other, ...itemTags.other }
	// the SEO fields win; a description/keywords meta tag in the markup only fills in an empty field
	const description = seoMetadata.description || itemTags.description || pageTags.description
	const keywords = seoMetadata.keywords || itemTags.keywords || pageTags.keywords
	// a robots setting on the page replaces a robots meta tag pasted into the markup
	if (seoMetadata.robots) {
		for (const key of Object.keys(other)) if (key.toLowerCase() === "robots") delete other[key]
	}
	//#endregion

	const metaData: Metadata = {
		metadataBase: new URL(getSiteUrl()),
		title: seoMetadata.title,
		description,
		keywords,
		alternates: seoMetadata.alternates,
		robots: seoMetadata.robots,
		openGraph: {
			url: seoMetadata.alternates?.canonical ?? url,
			...openGraph,
			// the page's share image (SEO > share image) comes first
			images: [...seoImages, ...ogImages],
		} as Metadata["openGraph"],

		generator: `Agility CMS`,
		other

	}

	return metaData



}

// og:type values Next.js can render (any other value makes its metadata renderer throw)
const OG_TYPES = new Set(["website", "article", "book", "profile", "music.song", "music.album", "music.playlist", "music.radio_station", "video.movie", "video.episode", "video.tv_show", "video.other"])

// og:image:* sub-properties, mapped to Next's image descriptor fields
const OG_IMAGE_FIELDS: Record<string, "url" | "secureUrl" | "type" | "width" | "height" | "alt"> = {
	"og:image:url": "url",
	"og:image:secure_url": "secureUrl",
	"og:image:type": "type",
	"og:image:width": "width",
	"og:image:height": "height",
	"og:image:alt": "alt",
}

// article:* properties, mapped to Next's openGraph fields (rendered only when og:type is "article")
const ARTICLE_FIELDS: Record<string, { field: string; multiple?: boolean }> = {
	"article:published_time": { field: "publishedTime" },
	"article:modified_time": { field: "modifiedTime" },
	"article:expiration_time": { field: "expirationTime" },
	"article:section": { field: "section" },
	"article:author": { field: "authors", multiple: true },
	"article:tag": { field: "tags", multiple: true },
}

// Owned by the app (Next.js emits these); a second copy would conflict.
const APP_OWNED_META = new Set(["charset", "viewport", "generator"])

interface MarkupImage {
	url: string
	secureUrl?: string
	type?: string
	width?: string
	height?: string
	alt?: string
}

interface AdditionalMetaTags {
	openGraph: Record<string, unknown>
	other: Record<string, string | string[]>
	description?: string
	keywords?: string
}

/** Every `<meta property|name="…" content="…">` in the markup, in document order (including nested ones). */
const parseMetaTags = (html: string): { key: string; content: string }[] => {
	const tags: { key: string; content: string }[] = []
	const walk = (nodes: any[]) => {
		for (const node of nodes) {
			if (node?.type !== "tag" || node.name === "noscript" || node.name === "template") continue
			if (node.name === "meta") {
				const attribs = node.attribs || {}
				const key = (attribs.property || attribs.name || "").trim()
				if (key && attribs.content !== undefined) {
					tags.push({ key, content: attribs.content })
				} else if (!attribs.charset) {
					console.warn("Could not output <meta> tag in Additional Header Markup (it needs a property or name, and content)", attribs)
				}
				continue
			}
			// <script> tags (including JSON-LD) are rendered by the page itself - see getPageScripts
			console.warn(`Could not output <${node.name}> tag in Additional Header Markup`)
			if (Array.isArray(node.children)) walk(node.children)
		}
	}
	try {
		walk(htmlToDOM(html) as any[])
	} catch (error) {
		console.warn("Could not parse additional meta tags from Agility CMS", error)
	}
	return tags
}

/**
 * Map the meta tags in Additional Header Markup onto Next.js metadata.
 * Open Graph tags (og:*, article:*) go through `openGraph` so Next renders them as `<meta property>`;
 * anything else (robots, twitter:*, google-site-verification, …) goes through `other`,
 * which Next renders as `<meta name>`.
 */
export const resolveAdditionalMetaTags = (html: string | null | undefined, ogImages: { push(image: MarkupImage): number }): AdditionalMetaTags => {
	const result: AdditionalMetaTags = { openGraph: {}, other: {} }
	if (!html || !html.trim()) return result

	const openGraph = result.openGraph
	const article: Record<string, string | string[]> = {}
	let lastImage: MarkupImage | undefined

	const addOther = (key: string, content: string) => {
		const existing = result.other[key]
		result.other[key] = existing === undefined ? content : [...(Array.isArray(existing) ? existing : [existing]), content]
	}

	for (const { key, content } of parseMetaTags(html)) {
		const lowerKey = key.toLowerCase()

		if (lowerKey === "og:image" || lowerKey === "og:image:url") {
			lastImage = { url: content }
			ogImages.push(lastImage)
			continue
		}
		if (OG_IMAGE_FIELDS[lowerKey]) {
			// og:image:* describes the og:image before it
			if (lastImage) lastImage[OG_IMAGE_FIELDS[lowerKey]] = content
			else console.warn(`Ignoring <meta property="${key}"> in Additional Header Markup: it must follow an og:image tag`)
			continue
		}
		if (ARTICLE_FIELDS[lowerKey]) {
			const { field, multiple } = ARTICLE_FIELDS[lowerKey]
			const existing = article[field]
			article[field] = multiple ? [...(Array.isArray(existing) ? existing : []), content] : content
			continue
		}

		switch (lowerKey) {
			case "og:title":
				openGraph.title = content
				break
			case "og:description":
				openGraph.description = content
				break
			case "og:url":
				openGraph.url = content
				break
			case "og:site_name":
				openGraph.siteName = content
				break
			case "og:locale":
				openGraph.locale = content
				break
			case "og:locale:alternate":
				openGraph.alternateLocale = [...((openGraph.alternateLocale as string[]) || []), content]
				break
			case "og:type":
				if (OG_TYPES.has(content)) openGraph.type = content
				else addOther(key, content)
				break
			case "description":
				result.description ??= content
				break
			case "keywords":
				result.keywords ??= content
				break
			default:
				if (!APP_OWNED_META.has(lowerKey)) addOther(key, content)
		}
	}

	// Next.js only renders article:* when og:type is "article"; otherwise keep them as plain meta tags
	if (openGraph.type === "article") {
		Object.assign(openGraph, article)
	} else {
		const reverse = Object.fromEntries(Object.entries(ARTICLE_FIELDS).map(([property, { field }]) => [field, property]))
		for (const [field, value] of Object.entries(article)) {
			for (const content of Array.isArray(value) ? value : [value]) addOther(reverse[field], content)
		}
	}

	return result
}
