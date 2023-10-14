import { ContentItem, ImageField } from "@agility/nextjs"
import getAgilitySDK from "./getAgilitySDK"
import { cache } from "react"

interface ILink {
	title: string
	path: string
}

export interface IHeaderData {
	siteName: string
	logo: ImageField
	links: ILink[]
}

interface IHeader {
	siteName: string
	logo: ImageField
}

interface Props {
	locale: string
	sitemap: string
}


const getHeaderContent_notCached = async ({ locale, sitemap }: Props) => {

	console.log("get header content", locale, sitemap)

	const api = getAgilitySDK()

	// set up content item
	let contentItem: ContentItem<IHeader> | null = null

	// set up links
	let links = []

	try {
		// try to fetch our site header
		let header = await api.getContentList({
			referenceName: "siteheader",
			languageCode: locale,
			take: 1,
		})

		// if we have a header, set as content item
		if (header && header.items && header.items.length > 0) {
			contentItem = header.items[0]
		}

		if (!contentItem) {
			return null
		}
	} catch (error) {
		if (console) console.error("Could not load site header item.", error)
		return null
	}

	try {
		// get the nested sitemap
		let nodes = await api.getSitemapNested({
			channelName: sitemap,
			languageCode: locale,
		})

		// grab the top level links that are visible on menu
		links = nodes
			.filter((node: any) => node.visible.menu)
			.map((node: any) => {
				return {
					title: node.menuText || node.title,
					path: node.path,
				}
			})
	} catch (error) {
		if (console) console.error("Could not load nested sitemap.", error)
	}

	// return clean object...

	const d = new Date()


	return {
		siteName: `${contentItem.fields.siteName}-${d.getFullYear()}.${d.getMonth()}.${d.getDate()}.${d.getHours()}.${d.getMinutes()}.${d.getSeconds()}`,
		logo: contentItem.fields.logo,
		links,
	} as IHeaderData
}

export const revalidate = 10 // revalidate the data at most every 30 seconds
export const getHeaderContent = cache(getHeaderContent_notCached)
