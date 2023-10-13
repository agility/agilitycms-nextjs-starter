import {getPageTemplate} from "components/agility-layouts"
import {PageProps, getAgilityPage} from "lib/cms-content/getAgilityPage"
import {getHeaderContent} from "lib/cms-content/getHeaderContent"
import {getAgilityContext} from "lib/cms-content/useAgilityContext"

import {Metadata, ResolvingMetadata} from "next"
import Head from "next/head"
import ReactHtmlParser from "html-react-parser"

export const revalidate = 10 // revalidate this page every 10 seconds

/**
 * Generate metadata for this page
 */
export async function generateMetadata(
	{params, searchParams}: PageProps,
	parent: ResolvingMetadata
): Promise<Metadata> {
	// read route params
	const {locale, sitemap, isDevelopmentMode, isPreview} = getAgilityContext()
	const agilityData = await getAgilityPage({params})

	const header = await getHeaderContent({locale, sitemap})

	const previousOGImages = (await parent).openGraph?.images || []

	return {
		title: `${agilityData.sitemapNode?.title} | ${header?.siteName || ""}}`,
		description: agilityData.page?.seo?.metaDescription,
		keywords: agilityData.page?.seo?.metaKeywords,
		openGraph: {
			images: previousOGImages,
		},
	}
}

export default async function Page({params, searchParams}: PageProps) {
	const agilityData = await getAgilityPage({params})

	if (!agilityData.page) return null

	const AgilityPageTemplate = getPageTemplate(agilityData.pageTemplateName || "")

	let metaHTML = agilityData.page?.seo?.metaHTML
	let additionalHeaderMarkup = null

	if (metaHTML) {
		additionalHeaderMarkup = ReactHtmlParser(metaHTML)
	}

	return (
		<>
			{additionalHeaderMarkup && (
				//since we can't output dynamic html in the generateMetadata method, we need to do it here...
				<head>{additionalHeaderMarkup}</head>
			)}
			{AgilityPageTemplate && <AgilityPageTemplate {...agilityData} />}
			{!AgilityPageTemplate && <div>The template {agilityData.pageTemplateName} could not be found.</div>}
		</>
	)
}
