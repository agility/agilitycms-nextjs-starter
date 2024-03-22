import {renderHTML, Module, UnloadedModuleProps} from "@agility/nextjs"
import {getContentItem} from "lib/cms/getContentItem"

interface RichText {
	textblob: string
}

const RichTextArea = async ({module, languageCode}: UnloadedModuleProps) => {
	const {
		fields: {textblob},
		contentID,
	} = await getContentItem<RichText>({
		contentID: module.contentid,
		languageCode,
	})

	return (
		<section id={`${contentID}`} className="relative px-8" data-agility-component={contentID}>
			<div className="max-w-2xl mx-auto my-12 md:mt-18 lg:mt-20">
				<div
					data-agility-field="textblob"
					data-agility-html
					className="my-6 prose prose-sm sm:prose lg:prose-lg xl:prose-xl max-w-full"
					dangerouslySetInnerHTML={renderHTML(textblob)}
				></div>
			</div>
		</section>
	)
}

export default RichTextArea
