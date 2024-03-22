import React from "react"
import {AgilityPic, UnloadedModuleProps, renderHTML} from "@agility/nextjs"

import {DateTime} from "luxon"

const PostDetails = async ({dynamicPageItem}: UnloadedModuleProps) => {
	if (!dynamicPageItem) {
		return <div>Post not found</div>
	}

	// post fields
	const post = dynamicPageItem.fields

	// category
	const category = post.category?.fields.title || "Uncategorized"

	// format date
	const dateStr = DateTime.fromJSDate(new Date(post.date)).toFormat("LLL. dd, yyyy")

	return (
		<>
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
