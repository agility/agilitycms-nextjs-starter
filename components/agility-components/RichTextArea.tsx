import {renderHTML, Module} from "@agility/nextjs"

interface RichText {
	textblob: string
}

const RichTextArea: Module<RichText> = ({
	module: {
		contentID,
		fields: {textblob},
	},
}) => {
	return (
		<section id={`${contentID}`} className="relative px-8">
			<div className="max-w-2xl mx-auto my-12 md:mt-18 lg:mt-20">
				<div
					className="my-6 prose prose-sm sm:prose lg:prose-lg xl:prose-xl max-w-full"
					dangerouslySetInnerHTML={renderHTML(textblob)}
				></div>
			</div>
		</section>
	)
}

export default RichTextArea
