import Link from "next/link"
import {DateTime} from "luxon"
import {stripHtml} from "string-strip-html"
import {AgilityPic, Module, ContentItem, AgilityImage} from "@agility/nextjs"
import {IPost} from "../../lib/types/IPost"

interface IFeaturedPostModule {
	featuredPost?: ContentItem<IPost>
}

const FeaturedPost: Module<IFeaturedPostModule> = ({module}) => {
	// get module fields
	const {fields} = module

	// get featured post
	const {featuredPost} = fields

	let dateStr = ""
	let contentStr = ""
	if (featuredPost) {
		// convert date to str in a way that will work on the server and client with the same value
		dateStr = DateTime.fromJSDate(new Date(featuredPost.fields.date)).toFormat("LLL. dd, yyyy")
		//strip out html tags to build an excerpt
		contentStr = stripHtml(featuredPost?.fields.content || "").result
		if (contentStr.length > 200) contentStr = `${contentStr.substring(0, 200)}...`
	}

	if (!featuredPost) return null

	return (
		<div className="relative px-8 mb-8">
			<div className="flex flex-col sm:flex-row max-w-screen-xl mx-auto pt-8 group">
				<div className="sm:w-1/2 lg:w-2/3 sm:rounded-t-none sm:rounded-l-lg relative">
					<Link href={`/blog/${featuredPost.fields.slug}`} className="cursor-pointer">
						<div className="h-64 sm:h-96 relative w-full ">
							{/* Agility Pic - outputs a <picture> tag */}
							<AgilityPic
								image={featuredPost.fields.image}
								className="object-cover object-center w-full h-full rounded-t-lg sm:rounded-l-lg sm:rounded-tr-none"
								priority
								fallbackWidth={800}
								sources={[
									//screen at least than 640, it's 1/2 of the screen, so the same size as the prev breakpoint
									{media: "(min-width: 1280px)", width: 800},
									{media: "(min-width: 640px)", width: 640},
									//screen less than 640, full width of screen
									{media: "(max-width: 639px)", width: 640},
								]}
							/>

							{/*
								OR you can use AgilityImage - A wrapper for next/image - MUST be used from the component with "use client"
								to test out the following code,
									- uncomment the component below
									- add "use client" to the top of this file
									- add AgilityImage to the "@agility/nextjs" import at the top of the file
							*/}

							{/* <AgilityImage
								src={featuredPost.fields.image.url}
								alt={featuredPost.fields.image.label}
								className="object-cover object-center rounded-t-lg sm:rounded-l-lg sm:rounded-t-none"
								priority
								fill
								sizes="(max-width: 640px) 100vw,
												50vw"
							/> */}
						</div>
					</Link>
				</div>
				<div className="sm:w-1/2 lg:w-1/3 bg-gray-100 p-8 border-2 border-t-0 rounded-b-lg sm:rounded-bl-none sm:rounded-r-lg sm:border-t-2 sm:border-l-0 relative">
					<Link href={`/blog/${featuredPost.fields.slug}`} className="cursor-pointer">
						<div className="font-display uppercase text-primary-500 text-xs font-bold tracking-widest leading-loose after:content">
							{featuredPost.fields.category.fields.title}
						</div>
						<div className="border-b-2 border-primary-500 w-8"></div>
						<div className="mt-4 uppercase text-gray-600 italic font-semibold text-xs">{dateStr}</div>
						<h2 className="font-display text-secondary-500 mt-1 font-black text-2xl group-hover:text-primary-500 transition duration-300">
							{featuredPost.fields.title}
						</h2>
						<p className="text-sm mt-3 leading-loose text-gray-600 font-medium line-clamp-4">{contentStr}</p>
					</Link>
				</div>
			</div>
		</div>
	)
}

export default FeaturedPost
