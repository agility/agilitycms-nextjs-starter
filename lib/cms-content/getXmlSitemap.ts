import { MetadataRoute } from "next"
import getAgilitySDK from "./getAgilitySDK"


interface Props {
	baseUrl: string
	locale: string
	sitemap: string
}

/**
 * Get the sitemap xml for the site
 *
 * @param {Props} { locale, sitemap }
 * @return {*}
 */
export const getXmlSitemap = async ({ baseUrl, locale, sitemap }: Props): Promise<MetadataRoute.Sitemap> => {


	const api = getAgilitySDK()

	try {
		// get the flat sitemap
		let nodes = await api.getSitemapFlat({
			channelName: sitemap,
			languageCode: locale,
		})


		return Object.keys(nodes).map((key, index) => {
			//special case for homepage...
			let url = `${baseUrl}${key}`
			if (index === 0) url = baseUrl

			return {
				url,
				lastModified: new Date(),
				changeFrequency: "daily",
				priority: 1,
			}

		})


	} catch (error) {
		console.error("Error getting sitemap xml", error)
		throw new Error(`Could not load sitemap xml.`)

	}


}



