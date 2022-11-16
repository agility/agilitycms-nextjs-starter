import Link from "next/link"
import {DateTime} from "luxon"

import {Module, AgilityImage, ContentItem, renderHTML} from "@agility/nextjs"
import {IPost} from "../../lib/types/IPost"

interface IFeaturedPostModule {
	featuredPost: ContentItem<IPost>
}

const FeaturedPost: Module<IFeaturedPostModule> = ({module}) => {
	// get module fields
	const {fields} = module

	// get featured post
	const {featuredPost} = fields

	// return null if no featured post is selected
	if (!featuredPost) {
		return null
	}

	// convert date
	const dateStr = DateTime.fromJSDate(new Date(featuredPost.fields.date)).toFormat("LLL. dd, yyyy")

	return (
		<div className="relative px-8 mb-8">
			<div className="flex flex-col sm:flex-row max-w-screen-xl mx-auto pt-8 group">
				<div className="sm:w-1/2 lg:w-2/3 sm:rounded-t-none sm:rounded-l-lg relative">
					<Link href={`/blog/${featuredPost.fields.slug}`} className="cursor-pointer">
						<div className="h-64 sm:h-96 relative">
							<AgilityImage
								src={featuredPost.fields.image.url}
								alt={featuredPost.fields.image.label}
								className="object-cover object-center rounded-t-lg sm:rounded-l-lg sm:rounded-t-none"
								fill
							/>
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
						<p
							className="text-sm mt-3 leading-loose text-gray-600 font-medium line-clamp-4"
							dangerouslySetInnerHTML={renderHTML(featuredPost.fields.content)}
						></p>
					</Link>
				</div>
			</div>
		</div>
	)
}

export default FeaturedPost
