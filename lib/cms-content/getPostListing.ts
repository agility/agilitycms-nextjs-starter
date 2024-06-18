import { DateTime } from "luxon"
import getAgilitySDK from "../cms/getAgilitySDK"
import { ContentList } from "@agility/content-fetch"
import { ImageField } from "@agility/nextjs"
import { getContentList } from "lib/cms/getContentList"
import { getSitemapFlat } from "lib/cms/getSitemapFlat"

export interface IPostMin {

	contentID: number
	title: string
	date: string
	url: string
	category: string
	image: ImageField
}

interface LoadPostsProp {
	sitemap: string
	locale: string
	skip: number
	take: number
}

/**
 * Get a list of posts and resolve the URLs for each post from the sitemap.
 * @param param0
 * @returns
 */
export const getPostListing = async ({ sitemap, locale, skip, take }: LoadPostsProp) => {


	try {
		// get sitemap...
		let sitemapNodes = await getSitemapFlat({
			channelName: sitemap,
			languageCode: locale,
		})

		// get posts...
		let rawPosts: ContentList = await getContentList({
			referenceName: "posts",
			languageCode: locale,
			contentLinkDepth: 2,
			take,
			skip
		})

		// resolve dynamic urls
		const dynamicUrls = resolvePostUrls(sitemapNodes, rawPosts.items)

		const posts: IPostMin[] = rawPosts.items.map((post: any) => {
			//category
			const category = post.fields.category?.fields.title || "Uncategorized"

			// date
			const date = DateTime.fromJSDate(new Date(post.fields.date)).toFormat("LLL. dd, yyyy")

			// url
			const url = dynamicUrls[post.contentID] || "#"

			// post image src
			let imageSrc = post.fields.image.url

			// post image alt
			let imageAlt = post.fields.image?.label || null

			return {
				contentID: post.contentID,
				title: post.fields.title,
				date,
				url,
				category,
				image: post.fields.image
			}
		})

		return {
			posts,
		}
	} catch (error) {
		throw new Error(`Error loading data for PostListing: ${error}`)
	}
}

const resolvePostUrls = function (sitemap: any, posts: any) {
	let dynamicUrls: any = {};
	posts.forEach((post: any) => {
		Object.keys(sitemap).forEach((path) => {
			if (sitemap[path].contentID === post.contentID) {
				dynamicUrls[post.contentID] = path;
			}
		});
	});
	return dynamicUrls;
};