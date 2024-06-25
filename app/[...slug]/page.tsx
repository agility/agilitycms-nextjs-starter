import {getPageTemplate} from "components/agility-pages"
import {PageProps, getAgilityPage} from "lib/cms/getAgilityPage"
import {getAgilityContext} from "lib/cms/useAgilityContext"

import {Metadata, ResolvingMetadata} from "next"

import {resolveAgilityMetaData} from "lib/cms-content/resolveAgilityMetaData"
import NotFound from "./not-found"
import InlineError from "components/common/InlineError"
import {cacheConfig} from "lib/cms/cacheConfig"

export const revalidate = cacheConfig.pathRevalidateDuration
export const runtime = "nodejs"
export const dynamic = "force-static"

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
	//const {isPreview} = getAgilityContext()
	const agilityData = await getAgilityPage({params})

	//if the page is not found...
	if (!agilityData.page) return NotFound()

	const AgilityPageTemplate = getPageTemplate(agilityData.pageTemplateName || "")

	return (
		<div data-agility-page={agilityData.page?.pageID} data-agility-dynamic-content={agilityData.sitemapNode.contentID}>
			{AgilityPageTemplate && <AgilityPageTemplate {...agilityData} />}
			{!AgilityPageTemplate && (
				// if we don't have a template for this page, show an error
				<InlineError message={`No template found for page template name: ${agilityData.pageTemplateName}`} />
			)}
		</div>
	)
}
