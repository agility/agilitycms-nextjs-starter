import { revalidatePath, revalidateTag } from "next/cache";
import { NextRequest, NextResponse } from "next/server";

interface IRevalidateRequest {
	state: string,
	instanceGuid: string
	languageCode: string
	referenceName?: string
	contentID?: number
	contentVersionID?: number
	pageID?: number
	pageVersionID?: number
	changeDateUTC: string
}

export async function POST(req: NextRequest, res: NextResponse) {

	//parse the body
	const data = await req.json() as IRevalidateRequest


	//only process publish events
	if (data.state === "Published") {

		//revalidate the correct tags based on what changed
		if (data.referenceName) {
			//content item change
			const itemTag = `agility-content-${data.referenceName}-${data.languageCode}`
			const listTag = `agility-content-${data.contentID}-${data.languageCode}`
			revalidateTag(itemTag)
			revalidateTag(listTag)
			console.log("Revalidating content tags:", itemTag, listTag)
		} else if (data.pageID !== undefined && data.pageID > 0) {
			//page change
			const pageTag = `agility-page-${data.pageID}-${data.languageCode}`
			revalidateTag(pageTag)


			//also revalidate the sitemaps
			const sitemapTagFlat = `agility-sitemap-flat-${data.languageCode}`
			const sitemapTagNested = `agility-sitemap-nested-${data.languageCode}`
			revalidateTag(sitemapTagFlat)
			revalidateTag(sitemapTagNested)

			console.log("Revalidating page and sitemap tags:", pageTag, sitemapTagFlat, sitemapTagNested)
		}
	}

	return new Response(`OK`, {
		status: 200
	})


}