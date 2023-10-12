import { DateTime } from "luxon"
import getAgilitySDK from "./getAgilitySDK"

export interface IPostMin {

	contentID: number
	title: string
	date: string
	url: string
	category: string
	imageSrc: string
	imageAlt: string


}

interface LoadPostsProp {
	channelName: string
	locale: string
}

export const getPostListing = async ({ channelName, locale }: LoadPostsProp) => {
	const api = getAgilitySDK()

	try {
		// get sitemap...
		let sitemap = await api.getSitemapFlat({
			channelName: channelName,
			languageCode: locale,
		})

		// get posts...
		let rawPosts = await api.getContentList({
			referenceName: "posts",
			languageCode: locale,
			contentLinkDepth: 2,
			depth: 2,
			take: 50,
		})

		// resolve dynamic urls
		const dynamicUrls = resolvePostUrls(sitemap, rawPosts.items)

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
				imageSrc,
				imageAlt,
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