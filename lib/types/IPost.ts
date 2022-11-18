import { ImageField, ContentItem } from "@agility/nextjs"
import { IAuthor } from "./IAuthor"
import { ICategory } from "./ICategory"
import { ITag } from "./ITag"

export interface IPost {
	title: string
	slug: string
	date: string
	content: string
	image: ImageField
	category: ContentItem<ICategory>
	author: ContentItem<IAuthor>
	tags: [ContentItem<ITag>]
}