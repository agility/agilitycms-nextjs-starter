import { ContentList } from "@agility/content-fetch"
import getAgilitySDK from "lib/cms-content/getAgilitySDK"
import { getPostListing } from "lib/cms-content/getPostListing"
import { NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
	const searchParams = request.nextUrl.searchParams

	const locale = searchParams.get('locale')
	const sitemap = searchParams.get('sitemap')

	const skip = Number(searchParams.get('skip'))
	const take = Number(searchParams.get('take'))

	if (!locale || !sitemap
		|| isNaN(skip) || skip < 1
		|| isNaN(take) || take < 1) {
		return new Response('Invalid request: skip, take, locale and sitemap are all required', {
			status: 400
		});
	}

	//HACK: we are just outputting a lot of posts here for now, so we are IGNORING the skip and take vals...
	//normally you would use skip and take to do paging on a large list.
	const postsRes = await getPostListing({ sitemap: sitemap, locale, skip: 0, take: 50 })


	//HACK adjust the ids so our keys don't overlap
	postsRes.posts = postsRes.posts.map((post, index) => {
		post.contentID = index + Number(skip)
		return post
	})

	return new Response(JSON.stringify(postsRes.posts))
}