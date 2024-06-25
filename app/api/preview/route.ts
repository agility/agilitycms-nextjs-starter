import { validatePreview, getDynamicPageURL } from "@agility/nextjs/node";
import { draftMode } from 'next/headers'
import { NextRequest, NextResponse } from "next/server";


/**
 * This endpoint is used as a rewrite for preview requests from middleware.
 * Therefore, the URL will be the original preview request url...
 * @param request
 * @param res
 * @returns
 */
export async function GET(request: NextRequest, res: NextResponse) {

	const searchParams = request.nextUrl.searchParams

	const agilityPreviewKey = searchParams.get("agilitypreviewkey") || ""

	//locale is also passed in the querystring on preview requests
	const locale = searchParams.get("lang")
	const slug = request.nextUrl.pathname

	const ContentID = searchParams.get('ContentID')

	console.log("Preview Request", { agilityPreviewKey, slug, ContentID, url: request.nextUrl.toString() })


	//validate our preview key, also validate the requested page to preview exists
	const validationResp = await validatePreview({
		agilityPreviewKey,
		slug
	});

	if (validationResp.error) {
		return new Response(`${validationResp.message}`, {
			status: 401
		});
	}

	let previewUrl = slug;

	//TODO: these kinds of dynamic links should work by default (even outside of preview)
	if (ContentID) {
		const dynamicPath = await getDynamicPageURL({ contentID: Number(ContentID), preview: true, slug: slug || undefined });
		if (dynamicPath) {
			previewUrl = dynamicPath;
		}
	}

	//enable draft/preview mode
	draftMode().enable()

	// Redirect to the slug
	//Add an extra querystring to the location header - since Netlify will keep the QS for the incoming request by default
	let url = `${previewUrl}`
	if (url.includes("?")) {
		url = `${url}&preview=1`
	} else {
		url = `${url}?preview=1`
	}

	return new Response(`Initializing preview mode`, {
		status: 307,
		headers: {
			"Location": url,
		}

	});

	NextResponse.redirect(url)

}