import {useState} from "react"
import {FaCaretDown} from "react-icons/fa6"
import {default as cn} from "classnames"

interface Props {
	contentItem: any
}

export default function RawContentItem({contentItem}: Props) {
	const [jsonExpanded, setJsonExpanded] = useState(false)

	return (
		<>
			<h3 className="text-lg font-medium text-gray-600 pt-6">
				<button
					onClick={() => setJsonExpanded(!jsonExpanded)}
					className="hover:text-purple-600 transition-all flex gap-1 items-center"
				>
					<span>View Raw Content Item</span>
					<FaCaretDown className={cn("transition-transform", jsonExpanded ? "rotate-0" : "-rotate-90")} />
				</button>
			</h3>
			<div className={cn("overflow-hidden transition-all", !jsonExpanded ? "h-0" : "h-auto")}>
				<pre
					className={cn(
						"text-sm  bg-gray-100 rounded p-4 border border-gray-300  transition-transform",
						jsonExpanded ? "translate-y-0" : "-translate-y-full"
					)}
				>
					{JSON.stringify(contentItem, null, 2)}
				</pre>
			</div>
		</>
	)
}
