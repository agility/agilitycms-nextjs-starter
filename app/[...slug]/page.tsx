import {getPageTemplate} from "components/agility-layouts"
import {PageProps, getAgilityPage} from "lib/cms-content/getAgilityPage"
import {getHeaderContent} from "lib/cms-content/getHeaderContent"
import {getAgilityContext} from "lib/cms-content/useAgilityContext"

import {Metadata, ResolvingMetadata} from "next"

import {resolveAgilityMetaData} from "lib/cms-content/resolveAgilityMetaData"
import Head from "next/head"
import NotFound from "./not-found"
import InlineError from "components/common/InlineError"

/**
 * revalidate this page every 10 seconds
 */
export const revalidate = 10

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
	if (!agilityData.page) return {}
	return await resolveAgilityMetaData({agilityData, locale, sitemap, isDevelopmentMode, isPreview, parent})
}

export default async function Page({params, searchParams}: PageProps) {
	const agilityData = await getAgilityPage({params})

	//if the page is not found...
	if (!agilityData.page) return NotFound()

	const AgilityPageTemplate = getPageTemplate(agilityData.pageTemplateName || "")

	return (
		<>
			{AgilityPageTemplate && <AgilityPageTemplate {...agilityData} />}
			{!AgilityPageTemplate && (
				// if we don't have a template for this page, show an error
				<InlineError message={`No template found for page template name: ${agilityData.pageTemplateName}`} />
			)}
		</>
	)
}
