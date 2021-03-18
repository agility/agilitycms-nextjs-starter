import React, { FC } from 'react';
import { ContentItem, ImageField, ModuleWithDynamic, renderHTML } from '@agility/nextjs'


interface Tag {
	title: String
}

interface Category {
	title: String
}

interface Author {
	name: String
}

interface Post {
	title: string
	date: string,
	content: string
	image: ImageField
	category: ContentItem<Category>
	author: ContentItem<Author>
	tags:[ContentItem<Tag>]
}


const PostDetails: ModuleWithDynamic<any, Post> = ({ dynamicPageItem, languageCode }) => {

	const post = dynamicPageItem.fields
	const category = post.category?.fields.title
	const author = post.author?.fields.name
	const tagNames = post.tags?.map(tag => tag.fields.title).join(", ")

	let dateStr = null;
	try {
		//try to format the date with the current lang
		dateStr = new Date(post.date).toLocaleDateString(languageCode)
	} catch (e) {
		dateStr = new Date(post.date).toLocaleDateString()
	}



	return (
		<section className="my-6">
			<div className="flex">
				<div className="text-4xl sm:text-5xl font-black tracking-wide text-center text-gray-900 mb-10">
					{post.title}
				</div>
			</div>
			<div className="text-center">
				<div className="font-medium text-primary-700">{category}</div>
				<div className="font-bold text-lg sm:text-xl lg:text-2xl text-secondary-500 tracking-wide">{author}</div>
				<div className="">{dateStr}</div>
				<div className="text-gray-700">{tagNames}</div>
				{ post.image &&
				<div className="my-2 flex items-center justify-center">
					<picture className="rounded">
						<source srcSet={`${post.image.url}?w=1024`}
							media="(min-width: 1400px)" />
						<source srcSet={`${post.image.url}?w=700`}
							media="(min-width: 1000px)" />
						<img className="rounded" src={`${post.image.url}?w=400`} alt={post.image.label} loading="lazy" />
					</picture>
				</div>
				}
			</div>
			<div className="p-10 prose prose-sm sm:prose lg:prose-lg xl:prose-xl max-w-full" style={{ maxWidth: "100%" }}
				dangerouslySetInnerHTML={renderHTML(post.content)}>
			</div>
		</section>
	)
}


export default PostDetails


