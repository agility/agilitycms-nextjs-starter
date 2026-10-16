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

/**
 * Agility publish webhook -> cache tag revalidation.
 *
 * SECURITY NOTE: this handler does NOT verify webhook signatures, so anyone who
 * knows this URL can POST to it and trigger revalidation.
 *
 * Agility can sign webhooks using the Standard Webhooks spec: tick "Enable secure
 * delivery" in the webhook's settings (Settings > Webhooks) and Agility generates
 * a `whsec_...` signing secret and sends `webhook-id`, `webhook-timestamp` and
 * `webhook-signature` headers with every delivery. To verify them, read the raw
 * body with `req.text()` before parsing it, then check it with a Standard
 * Webhooks library (e.g. `standardwebhooks` on npm). See:
 * https://agilitycms.com/docs/developers/verifying-signed-webhooks
 */
export async function POST(req: NextRequest) {

	//parse the body
	const data = await req.json() as IRevalidateRequest


	//only process publish events
	if (data.state === "Published") {

		//revalidate the correct tags based on what changed
		if (data.referenceName) {
			//content item change
			const itemTag = `agility-content-${data.referenceName}-${data.languageCode}`
			const listTag = `agility-content-${data.contentID}-${data.languageCode}`
			revalidateTag(itemTag, "max")
			revalidateTag(listTag, "max")
			console.log("Revalidating content tags:", itemTag, listTag)
		} else if (data.pageID !== undefined && data.pageID > 0) {
			//page change
			const pageTag = `agility-page-${data.pageID}-${data.languageCode}`
			revalidateTag(pageTag, "max")


			//also revalidate the sitemaps
			const sitemapTagFlat = `agility-sitemap-flat-${data.languageCode}`
			const sitemapTagNested = `agility-sitemap-nested-${data.languageCode}`
			revalidateTag(sitemapTagFlat, "max")
			revalidateTag(sitemapTagNested, "max")

			console.log("Revalidating page and sitemap tags:", pageTag, sitemapTagFlat, sitemapTagNested)
		}
	}

	return NextResponse.json({ message: "OK" }, { status: 200 });


}