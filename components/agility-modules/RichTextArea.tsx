import React, {FC} from 'react';
import { renderHTML, Module } from '@agility/nextjs'


interface RichText {
	textblob:string,
}

const RichTextArea:Module<RichText> =  ({ module: {fields: {textblob}} }) => {

	return (
		<section className="my-6 prose prose-sm sm:prose lg:prose-lg xl:prose-xl max-w-full" dangerouslySetInnerHTML={renderHTML(textblob)}>
		</section>
	);

}

export default RichTextArea