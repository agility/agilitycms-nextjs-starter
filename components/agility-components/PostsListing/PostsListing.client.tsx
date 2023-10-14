"use client"

import React, {use, useState} from "react"
import Link from "next/link"
import Image from "next/image"
import {IPostMin} from "lib/cms-content/getPostListing"
import InfiniteScroll from "react-infinite-scroll-component"
import {AgilityPic} from "@agility/nextjs"

interface Props {
	posts: IPostMin[]
	locale: string
	sitemap: string
}

const PostListingClient = ({posts, locale, sitemap}: Props) => {
	const [hasMore, setHasMore] = useState(true)
	const [items, setItems] = useState(posts)

	const fetchPosts = async () => {
		const morePosts = await fetch(
			`/api/get-post-listing?locale=${locale}&sitemap=${sitemap}&skip=${items.length}&take=10`
		)
		if (morePosts.ok) {
			const morePostsJson = await morePosts.json()

			setItems((prev) => {
				return [...prev, ...morePostsJson]
			})
			setHasMore(morePostsJson.length > 0)
		} else {
			console.error("error fetching more posts", morePosts.status, morePosts.statusText)
			setHasMore(false)
		}
	}

	return (
		<div className="relative px-8 mb-12">
			<div className="max-w-screen-xl mx-auto">
				<div className="">
					<InfiniteScroll
						dataLength={items.length}
						next={fetchPosts}
						hasMore={hasMore} // Replace with a condition based on your data source
						loader={<p>Loading...</p>}
						endMessage={<p>No more posts!</p>}
						className="grid sm:gap-8 sm:grid-cols-2 lg:grid-cols-3"
					>
						{items.map((post) => (
							<Link href={post.url} key={post.contentID}>
								<div className="flex-col group mb-8 md:mb-0">
									<div className="relative h-64 w-full overflow-clip">
										<AgilityPic
											image={post.image}
											className="object-cover object-center rounded-t-lg w-full"
											fallbackWidth={800}
											sources={[
												//screen at least than 1280, it's 1/3 of the screen
												{
													media: "(min-width: 1280px)",
													width: 480,
												},

												//screen at least than 640, it's 1/2 of the screen
												{media: "(min-width: 640px)", width: 640},
												//screen less than 640, full width of screen
												{media: "(max-width: 639px)", width: 640},
											]}
										/>
									</div>
									<div className="bg-gray-100 p-8 border-2 border-t-0 rounded-b-lg">
										<div className="uppercase text-primary-500 text-xs font-bold tracking-widest leading-loose">
											{post.category}
										</div>
										<div className="border-b-2 border-primary-500 w-8"></div>
										<div className="mt-4 uppercase text-gray-600 italic font-semibold text-xs">{post.date}</div>
										<h2 className="text-secondary-500 mt-1 font-black text-2xl group-hover:text-primary-500 transition duration-300">
											{post.title}
										</h2>
									</div>
								</div>
							</Link>
						))}
					</InfiniteScroll>
				</div>
			</div>
		</div>
	)
}

export default PostListingClient
