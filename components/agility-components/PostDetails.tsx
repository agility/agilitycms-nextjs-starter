import React from "react"
import {AgilityPic, ContentItem, ImageField, ModuleWithDynamic, renderHTML} from "@agility/nextjs"
import {IPost} from "../../lib/types/IPost"
import Image from "next/image"

import {DateTime} from "luxon"
import {PageProps, getAgilityPage} from "lib/cms-content/getAgilityPage"
import {getHeaderContent} from "lib/cms-content/getHeaderContent"
import {getAgilityContext} from "lib/cms-content/useAgilityContext"
import {ResolvingMetadata, Metadata} from "next"
import Head from "next/head"

const PostDetails: ModuleWithDynamic<any, IPost> = ({dynamicPageItem, languageCode}) => {
	if (!dynamicPageItem) {
		return <div>Post not found</div>
	}

	// post fields
	const post = dynamicPageItem.fields

	// category
	const category = post.category?.fields.title || "Uncategorized"

	// format dates - note that all Agility date/times are in EST (Eastern Time Zone) by default...
	const publishDate = DateTime.fromJSDate(new Date(post.date)).setZone("est")
	const modDate = DateTime.fromJSDate(new Date(dynamicPageItem.properties.modified)).setZone("est")
	const dateStr = publishDate.toFormat("LLL. dd, yyyy")

	/*
	 * Structured Data
	 * for this post, we will use the NewsArticle schema described here:
	 * https://developers.google.com/search/docs/appearance/structured-data/article
	 */

	const jsonLd = {
		"@context": "https://schema.org",
		"@type": "NewsArticle",
		headline: post.title,
		image: post.image ? [post.image.url] : undefined,
		datePublished: publishDate.toISO(),
		dateModified: modDate.toISO(),
		author: post.author
			? [
					{
						"@type": "Person",
						name: post.author.fields.name,
					},
			  ]
			: undefined,
	}

	return (
		<>
			{/* Add JSON-LD to as a script */}
			<script type="application/ld+json" dangerouslySetInnerHTML={{__html: JSON.stringify(jsonLd)}} />
			{/* ... */}

			<div className="relative px-8">
				<div className="max-w-screen-xl mx-auto">
					<div className="h-64 md:h-96  lg:h-[480px] relative overflow-hidden rounded-lg">
						<AgilityPic
							image={post.image}
							alt={post.image.label}
							className="w-full"
							fallbackWidth={800}
							sources={[
								{media: "(min-width: 1280px)", width: 1200},
								{media: "(min-width: 640px)", width: 800},
								{media: "(max-width: 639px)", width: 640},
							]}
						/>
					</div>
					<div className="max-w-2xl mx-auto mt-4">
						<div className="uppercase text-primary-500 text-xs font-bold tracking-widest leading-loose">{category}</div>
						<div className="border-b-2 border-primary-500 w-8"></div>
						<div className="mt-4 uppercase text-gray-600 italic font-semibold text-xs">{dateStr}</div>
						<h1 className="font-display text-4xl font-bold my-6 text-secondary-500">{post.title}</h1>
						<div className="prose max-w-full mb-20" dangerouslySetInnerHTML={renderHTML(post.content)} />
					</div>
				</div>
			</div>
		</>
	)
}

export default PostDetails
