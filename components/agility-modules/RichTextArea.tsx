import React, {FC} from 'react';
import { renderHTML } from 'agility/utils'

interface Fields {
	textblob:string,
}

interface Props {
	fields: Fields
}

const RichTextArea:FC<Props> =  ({fields}) => {
	return (
		<section className="my-6 prose prose-sm sm:prose lg:prose-lg xl:prose-xl max-w-full" dangerouslySetInnerHTML={renderHTML(fields.textblob)}>
		</section>
	);

}

export default RichTextArea