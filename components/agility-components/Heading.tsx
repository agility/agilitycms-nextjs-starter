import React from "react"

import {Module, UnloadedModuleProps} from "@agility/nextjs"
import {getContentItem} from "lib/cms/getContentItem"

interface IHeading {
	title: string
}

const Heading = async ({module, languageCode}: UnloadedModuleProps) => {
	const {fields, contentID} = await getContentItem<IHeading>({
		contentID: module.contentid,
		languageCode,
	})

	return (
		<div className="relative px-8">
			<div className="max-w-screen-xl mx-auto my-12 md:mt-18 lg:mt-20">
				<h1 className="font-display text-secondary-500 text-4xl font-black tracking-wide">{fields.title}</h1>
			</div>
		</div>
	)
}

export default Heading
