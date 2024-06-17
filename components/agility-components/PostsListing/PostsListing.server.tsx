import React from "react"
import Link from "next/link"

import {getPostListing} from "lib/cms-content/getPostListing"
import {useAgilityContext} from "lib/cms/useAgilityContext"
import PostListingClient from "./PostsListing.client"
import {getContentItem} from "lib/cms/getContentItem"
import {UnloadedModuleProps} from "@agility/nextjs"

interface IPostListing {
	title: string
	subtitle: string
	preHeader: string
}

export interface GetNextPostsProps {
	skip: number
	take: number
}

const PostListing = async ({module, languageCode}: UnloadedModuleProps) => {
	const {sitemap, locale} = useAgilityContext()

	// get posts for the initial page load
	const {posts} = await getPostListing({sitemap, locale, take: 10, skip: 0})

	// get next posts for infinite scroll
	const getNextPosts = async ({skip, take}: GetNextPostsProps) => {
		"use server"

		//HACK: we are just outputting a lot of posts here for now, so we are IGNORING the skip and take vals...
		//normally you would use skip and take to do paging on a large list.
		const postsRes = await getPostListing({sitemap: sitemap, locale, skip: 0, take: 50})

		//HACK adjust the ids so our keys don't overlap
		postsRes.posts = postsRes.posts.map((post, index) => {
			post.contentID = index + Number(skip)
			return post
		})

		return postsRes.posts
	}

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

	return <PostListingClient {...{posts, sitemap, locale, getNextPosts}} />
}

export default PostListing
