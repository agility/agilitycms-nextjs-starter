import { getDynamicPageURL } from '@agility/nextjs/node';
import { draftMode } from 'next/headers'
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest, res: NextResponse) {

	const searchParams = request.nextUrl.searchParams

	const slug = searchParams.get('slug')
	const ContentID = searchParams.get('ContentID')

	//disable draft/preview mode
	draftMode().disable()

	let url = `${slug}`

	if (ContentID) {
		const dynamicPath = await getDynamicPageURL({ contentID: Number(ContentID), preview: false, slug: slug || undefined });
		if (dynamicPath) {
			url = dynamicPath;
		}

	}

	// Redirect to the url
	if (url.includes("?")) {
		url = `${url}&preview=0`
	} else {
		url = `${url}?preview=0`
	}

	return new Response(`Exiting preview mode`, {
		status: 307,
		headers: {
			"Location": url,
		}

	});

	NextResponse.redirect(url)

}