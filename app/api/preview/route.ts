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
export async function GET(request: NextRequest) {

	const searchParams = request.nextUrl.searchParams

	const agilityPreviewKey = searchParams.get("agilitypreviewkey") || ""

	//locale is also passed in the querystring on preview requests
	const locale = searchParams.get("lang")
	const slug = searchParams.get("slug") || "/"

	const ContentID = searchParams.get('ContentID')

	//validate our preview key, also validate the requested page to preview exists
	const validationResp = await validatePreview({
		agilityPreviewKey,
		slug
	});

	console.log("validationResp", validationResp)

	if (validationResp.error) {
		return NextResponse.json({ message: validationResp.message }, { status: 401 });
	}

	let previewUrl = slug;

	//if we have a content id, get the dynamic page url for it
	if (ContentID) {
		const dynamicPath = await getDynamicPageURL({ contentID: Number(ContentID), preview: true, slug: slug || undefined });
		if (dynamicPath) {
			previewUrl = dynamicPath;
		}

	}

	//enable draft/preview mode
	(await draftMode()).enable()

	// Redirect to the slug
	// Construct an absolute URL for the redirect
	const baseUrl = `${request.nextUrl.protocol}//${request.nextUrl.host}`;
	let url = `${baseUrl}${previewUrl}`;
	if (url.includes("?")) {
		url = `${url}&preview=1`;
	} else {
		url = `${url}?preview=1`;
	}

	return NextResponse.redirect(url, 307);
}