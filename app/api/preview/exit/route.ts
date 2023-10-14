import { draftMode } from 'next/headers'
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest, res: NextResponse) {

	const searchParams = request.nextUrl.searchParams

	const slug = searchParams.get('slug')

	//disable draft/preview mode
	draftMode().disable()

	// Redirect to the slug
	let url = `${slug}`
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