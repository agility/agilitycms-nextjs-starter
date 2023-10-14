import { validatePreview, getDynamicPageURL, generatePreviewKey } from "@agility/nextjs/node";
import { draftMode } from 'next/headers'
import { NextRequest, NextResponse } from "next/server";

export async function GET() {

	//HACK: this should ONLY be used for demo purposes - this is not meant for a production site

	//generate a preview key
	const previewKey = generatePreviewKey();

	return new Response(previewKey, {
		status: 200
	})
}