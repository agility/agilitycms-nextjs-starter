"use client"
import {ContentItem} from "@agility/content-fetch"

import OutputField from "./OutputField"
import RawContentItem from "./RawContentItem"

interface Props {
	contentItem: ContentItem
}

export default function OutputContentItem({contentItem}: Props) {
	return (
		<div className="p-6">
			<div className="p-6 bg-white rounded-md shadow-md shadow-red-500 mx-auto border border-red-200">
				<div>
					<span className="rounded-full px-2 py-1 bg-red-200 text-red-800 text-sm font-medium uppercase">
						Component not found
					</span>
				</div>
				<h2 className="my-2 flex items-baseline gap-2">
					<span className="text-2xl font-bold text-gray-700">{contentItem.properties.definitionName}</span>
				</h2>

				<h3 className="text-xl font-bold text-gray-600 border-b border-b-gray-300">Fields</h3>
				<div className="flex flex-col gap-4 mt-2">
					{Object.keys(contentItem.fields).map((fieldName) => (
						<OutputField key={fieldName} fieldName={fieldName} fieldValue={contentItem.fields[fieldName]} />
					))}
				</div>

				<RawContentItem contentItem={contentItem} />
			</div>
		</div>
	)
}
