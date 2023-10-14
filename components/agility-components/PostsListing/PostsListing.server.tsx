import React from "react"
import Link from "next/link"

import {getPostListing} from "lib/cms-content/getPostListing"
import {useAgilityContext} from "lib/cms-content/useAgilityContext"
import PostListingClient from "./PostsListing.client"

interface IPostListing {
	title: string
	subtitle: string
	preHeader: string
}

interface Props {
	module: IPostListing
}

const PostListing = async ({module}: Props) => {
	const {sitemap, locale} = useAgilityContext()

	// get posts
	const {posts} = await getPostListing({sitemap, locale, take: 10, skip: 0})

	// if there are no posts, display message on frontend
	if (!posts || posts.length <= 0) {
		return (
			<div className="mt-44 px-6 flex flex-col items-center justify-center">
				<h1 className="text-3xl text-center font-bold">No posts available.</h1>
				<div className="my-10">
					<Link
						href={"/"}
						className="px-4 py-3 my-3 border border-transparent text-base leading-6 font-medium rounded-md text-white bg-primary-600 hover:bg-primary-500 focus:outline-none focus:border-primary-700 focus:shadow-outline-primary transition duration-300"
					>
						Return Home
					</Link>
				</div>
			</div>
		)
	}

	return <PostListingClient {...{posts, sitemap, locale}} />
}

export default PostListing
