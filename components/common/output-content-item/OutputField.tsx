import {AgilityPic, renderHTML} from "@agility/nextjs"
import OutputNestedContentItem from "./OutputNestedContentItem"
import {useEffect, useMemo, useState} from "react"
import {FaCaretDown} from "react-icons/fa6"
import {default as cn} from "classnames"

interface Props {
	fieldName: string
	fieldValue: any
}

export default function OutputField({fieldName, fieldValue}: Props) {
	const [isExpanded, setIsExpanded] = useState(false)
	const [isJSON, setIsJSON] = useState(false)
	const [jsonValue, setJsonValue] = useState<string | null>(null)

	const fieldValueStr = `${fieldValue}`
	const isNestedContentItem = fieldValue?.contentID > 0 && fieldValue?.fields
	const isString = typeof fieldValue === "string"
	const isHtml = fieldValueStr.startsWith("<") && fieldValueStr.endsWith(">")
	const isImage = !!(fieldValue?.url && fieldValue?.label)

	useEffect(() => {
		let obj = null
		let isit = false

		if (isNestedContentItem) {
			//if we KNOW it's a content item...
			return
		} else {
			//test it by parsing
			try {
				if (typeof fieldValue === "object") {
					obj = fieldValue
					isit = true
				} else {
					obj = JSON.parse(fieldValue)

					isit = fieldValueStr.startsWith("{") || fieldValueStr.startsWith("[")
				}
			} catch (error) {}
		}

		if (isit) {
			setJsonValue(JSON.stringify(obj, null, 2))
		}

		setIsJSON(isit)
	}, [fieldValue, fieldValueStr, isNestedContentItem])

	const isExpandable = useMemo(() => {
		return isJSON || isHtml || isImage || (isString && fieldValueStr.length > 150)
	}, [isJSON, isHtml, isImage, isString, fieldValueStr.length])

	return (
		<div key={fieldName}>
			<h3 className="text-lg font-semibold text-gray-600">
				{isExpandable ? (
					<button
						onClick={() => setIsExpanded(!isExpanded)}
						className="hover:text-purple-600 transition-all flex gap-1 items-center"
					>
						<span>{fieldName}:</span>
						<FaCaretDown className={cn("transition-transform", isExpanded ? "rotate-0" : "-rotate-90")} />
					</button>
				) : (
					<span>{fieldName}:</span>
				)}
			</h3>
			<div className="text-gray-500">
				{fieldValue?.contentID > 0 && fieldValue?.fields ? (
					<OutputNestedContentItem contentItem={fieldValue} />
				) : isImage ? (
					<div className="border border-gray-200 rounded bg-white">
						<div className={cn("transition-all overflow-auto", isExpanded ? "max-h-full" : "max-h-32 ")}>
							<AgilityPic image={fieldValue} fallbackWidth={500} className="rounded-t w-full" />
						</div>
						<div className="text-sm p-1 pt-2 text-center">{fieldValue.label}</div>
					</div>
				) : isHtml ? (
					//assume html field...

					<div className="border border-gray-200 rounded bg-white overflow-auto">
						<div className={cn("p-2 transition-all overflow-auto", isExpanded ? "max-h-full" : "max-h-32")}>
							<div className="prose prose-sm" dangerouslySetInnerHTML={renderHTML(fieldValueStr)} />
						</div>
					</div>
				) : fieldValue?.href && fieldValue?.text ? (
					<div className="flex gap-1 items-center">
						<div className="font-medium">Href:</div>
						<div className="text-sm bg-gray-200 rounded-full px-2 py-1 text-gray-800">{fieldValue.href}</div>
						<div className="font-medium">Text:</div>
						<div className="text-sm bg-gray-200 rounded-full px-2 py-1 text-gray-800">{fieldValue.text}</div>
						<div className="font-medium">Target:</div>
						<div className="text-sm bg-gray-200 rounded-full px-2 py-1 text-gray-800">{fieldValue.target || ""}</div>
					</div>
				) : isString ? (
					<div className={cn(isExpanded ? "" : "max-h-20 overflow-auto")}>{fieldValue}</div>
				) : isJSON ? (
					<div className=" rounded bg-gray-200 overflow-auto">
						<div className={cn(" transition-all overflow-auto", isExpanded ? "max-h-full" : "max-h-32")}>
							<pre className="text-xs">{jsonValue}</pre>
						</div>
					</div>
				) : (
					<div className="max-h-20 overflow-auto">{JSON.stringify(fieldValue)}</div>
				)}
			</div>
		</div>
	)
}
