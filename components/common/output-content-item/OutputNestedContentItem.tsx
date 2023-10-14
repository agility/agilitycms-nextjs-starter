"use client"
import {ContentItem} from "@agility/content-fetch"
import OutputField from "./OutputField"
import RawContentItem from "./RawContentItem"

interface Props {
	contentItem: ContentItem
}

export default function OutputNestedContentItem({contentItem}: Props) {
	return (
		<div className="mt-2">
			<div className="p-4 rounded border border-gray-200 bg-gray-50 mx-auto">
				<div>
					<span className="rounded-full px-2 py-1 bg-gray-200 text-gray-800 text-xs font-medium uppercase">
						Linked Content Item
					</span>
				</div>
				<h2 className="my-2 flex items-baseline gap-2">
					<span className="text-xl font-medium text-gray-700">{contentItem.properties.definitionName}</span>
					<span>({contentItem.properties.referenceName})</span>
				</h2>

				<h3 className="text-lg font-medium text-gray-600">Fields</h3>
				<div className="flex flex-col gap-4 ml-3">
					{Object.keys(contentItem.fields).map((fieldName) => (
						<OutputField key={fieldName} fieldName={fieldName} fieldValue={contentItem.fields[fieldName]} />
					))}
				</div>

				<RawContentItem contentItem={contentItem} />
			</div>
		</div>
	)
}
