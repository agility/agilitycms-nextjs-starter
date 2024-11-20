"use server";
import { getDynamicPageURL } from '@agility/nextjs/node';
import { draftMode } from 'next/headers'
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {

	const searchParams = request.nextUrl.searchParams

	const slug = searchParams.get('slug');
	const ContentID = searchParams.get('ContentID');

	//disable draft/preview mode
	(await draftMode()).disable()

	let url = new URL(slug || '', request.nextUrl.origin).toString();

	if (ContentID) {
		const dynamicPath = await getDynamicPageURL({ contentID: Number(ContentID), preview: false, slug: slug || undefined });
		if (dynamicPath) {
			url = dynamicPath;
		}
	}

	// Remove the preview URL param if it exists
	const urlObj = new URL(url);
	urlObj.searchParams.delete('preview');
	url = urlObj.toString();


	// Redirect to the url
	return NextResponse.redirect(url, { status: 307, headers: { "Location": url } })

}