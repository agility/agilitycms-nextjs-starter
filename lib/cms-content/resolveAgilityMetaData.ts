import { AgilityPageProps, ImageField } from "@agility/nextjs"
import { ContentItem } from "@agility/content-fetch"
import { Metadata, ResolvingMetadata } from "next"
import { getHeaderContent } from "./getHeaderContent"
import getAgilitySDK from "./getAgilitySDK"

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
	const previousOGImages = (await parent).openGraph?.images || []

	let ogImage: string | null = null

	//resolve open graph stuff from dynamic pages/layouts
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
					previousOGImages.push({
						url: `${image.url}?format=auto&w=1200`,
						alt: image.label
					})
				}
			}

		} catch (error) {
			console.warn("Could not resolve open graph meta data from dynamic page/layout contentID:", agilityData.sitemapNode.contentID, error)
		}
	}

	return {
		title: `${agilityData.sitemapNode?.title} | ${header?.siteName || ""}}`,
		description: agilityData.page?.seo?.metaDescription,
		keywords: agilityData.page?.seo?.metaKeywords,
		openGraph: {
			images: previousOGImages,
		},
	}



}