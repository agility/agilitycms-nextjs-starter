import { getXmlSitemap } from "lib/cms-content/getXmlSitemap"
import { MetadataRoute } from "next"

import { headers } from 'next/headers'
export default async function sitemap(props: any): Promise<MetadataRoute.Sitemap> {

	const headersList = headers()
	const host = headersList.get("host")
	const baseUrl = `https://${host}`

	return await getXmlSitemap({ baseUrl, locale: "en-us", sitemap: "website" })


}
