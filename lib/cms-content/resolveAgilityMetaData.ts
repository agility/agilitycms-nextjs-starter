import { AgilityPageProps, ImageField } from "@agility/nextjs"
import { ContentItem } from "@agility/content-fetch"
import { Metadata, ResolvingMetadata } from "next"
import { getHeaderContent } from "./getHeaderContent"
import getAgilitySDK from "./getAgilitySDK"
import ReactHtmlParser from "html-react-parser"

interface Props {
	agilityData: AgilityPageProps
	locale: string
	sitemap: string
	isPreview: boolean
	isDevelopmentMode: boolean
	parent: ResolvingMetadata
}

export const resolveAgilityMetaData = async ({ agilityData, locale, sitemap, isDevelopmentMode, isPreview, parent }: Props): Promise<Metadata> => {

	const agilitySDK = getAgilitySDK()
	const header = await getHeaderContent({ locale, sitemap })
	const ogImages = (await parent).openGraph?.images || []

	//#region *** resolve open graph stuff from dynamic pages/layouts ***
	if (agilityData.sitemapNode.contentID !== undefined
		&& agilityData.sitemapNode.contentID > 0) {

		//get the content item for this dynamic layout/page
		try {
			const contentItem: ContentItem = await agilitySDK.getContentItem({
				contentID: agilityData.sitemapNode.contentID,
				languageCode: locale
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
				//TODO: handle other dynamic pages/layouts types here!
			}

		} catch (error) {
			console.warn("Could not resolve open graph meta data from dynamic page/layout contentID:", agilityData.sitemapNode.contentID, error)
		}
	}
	//#endregion

	//#region *** resolve the "additional" meta tags ***
	let metaHTML = agilityData.page?.seo?.metaHTML

	let otherMetaData: { [name: string]: string } = {}

	if (metaHTML) {
		const additionalHeaderMarkup = ReactHtmlParser(metaHTML)

		const handleMetaTag = (item: JSX.Element) => {
			if (!item.type) return
			//check if this is a meta tag and add it to the otherMetaData if so
			if (item.type === "meta") {
				const metaTag = item.props as React.MetaHTMLAttributes<HTMLMetaElement>
				if (metaTag && metaTag.property && metaTag.content) {

					//special case for og:image
					if (metaTag.property === "og:image") {
						ogImages.push({
							url: metaTag.content
						})
					} else {
						otherMetaData[metaTag.property] = metaTag.content
					}

					return
				}
			}
			console.warn("Could not output tag in Additional Header Markup", item)
		}

		if (typeof additionalHeaderMarkup === "string") {
			console.warn("Could not parse additional meta tags from Agility CMS")
		} else if (Array.isArray(additionalHeaderMarkup)) {
			//array of meta tags
			additionalHeaderMarkup.forEach((item) => handleMetaTag(item));
		} else {
			//single meta tag
			handleMetaTag(additionalHeaderMarkup)
		}
	}
	//#endregion

	const metaData: Metadata = {
		title: `${agilityData.sitemapNode?.title} | ${header?.siteName || ""}`,
		description: agilityData.page?.seo?.metaDescription,
		keywords: agilityData.page?.seo?.metaKeywords,
		openGraph: {
			images: ogImages,
		},
		generator: `Agility CMS`,
		other: otherMetaData

	}

	return metaData



}