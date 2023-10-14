import {ContentItem} from "@agility/content-fetch"
import OutputContentItem from "./output-content-item/OutputContentItem"

interface Props {
	/**
	 * The error message to display
	 */
	message: string
}

/**
 * A component to display an error message and optionally expanda a ContentItem object
 * @param {Props} props
 * @returns
 */
export default function InlineError({message}: Props) {
	return (
		<section className="relative my-6">
			<div className="max-w-2xl mx-auto px-8 py-6 bg-gray-100 rounded-md border border-gray-300">
				<div className="text-base font-medium">{message}</div>
			</div>
		</section>
	)
}
