import React from "react"

import ReactHtmlParser from "html-react-parser"

interface Props {
	title: string
	description?: string | undefined
	keywords?: string | undefined
	ogImage?: string | undefined
	metaHTML?: string | undefined
}

const SEO = ({title, description, keywords, ogImage, metaHTML}: Props) => {
	// setup and parse additional header markup
	let additionalHeaderMarkup = null
	if (metaHTML) {
		additionalHeaderMarkup = ReactHtmlParser(metaHTML)
	}

	const strTitle = `${title} | My Travel Blog`

	return (
		<>
			<title>{strTitle}</title>
			<meta name="generator" content="Agility CMS" />
			<meta name="agility_timestamp" content={new Date().toLocaleString()} />
			<meta name="viewport" content="initial-scale=1.0, width=device-width" />
			<meta name="description" content={description} />
			<meta name="keywords" content={keywords} />

			{ogImage && <meta property="og:image" content={ogImage} />}
			{additionalHeaderMarkup}
		</>
	)
}

export default SEO
