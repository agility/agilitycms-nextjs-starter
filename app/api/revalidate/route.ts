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
			revalidateTag(`agility-content-${data.referenceName}-${data.languageCode}`)
			revalidateTag(`agility-content-${data.contentID}-${data.languageCode}`)
		} else if (data.pageID !== undefined && data.pageID > 0) {
			//page change
			revalidateTag(`agility-page-${data.pageID}-${data.languageCode}`)
		}
	}

	return new Response(`OK`, {
		status: 200
	})


}