import {getPageTemplate} from "components/agility-pages"
import {PageProps, getAgilityPage} from "lib/cms/getAgilityPage"
import {getAgilityContext} from "lib/cms/useAgilityContext"
import agilitySDK from "@agility/content-fetch"

import {Metadata, ResolvingMetadata} from "next"

import {resolveAgilityMetaData} from "lib/cms-content/resolveAgilityMetaData"
import NotFound from "./not-found"
import InlineError from "components/common/InlineError"
import {SitemapNode} from "lib/types/SitemapNode"
import {notFound} from "next/navigation"

export const revalidate = 60
export const runtime = "nodejs"
export const dynamic = "force-static"

/**
 * Generate the list of pages that we want to generate a build time.
 */
export async function generateStaticParams() {
	const isDevelopmentMode = process.env.NODE_ENV === "development";
	const isPreview = isDevelopmentMode;
	const apiKey = isPreview ? process.env.AGILITY_API_PREVIEW_KEY : process.env.AGILITY_API_FETCH_KEY;
	const agilityClient = agilitySDK.getApi({
	  guid: process.env.AGILITY_GUID,
	  apiKey,
	  isPreview,
	});
	const languageCode = process.env.AGILITY_LOCALES || "en-us";
  
	agilityClient.config.fetchConfig = {
	  next: {
		tags: [`agility-sitemap-flat-${languageCode}`],
		revalidate: 60,
	  },
	};
  
	// Get the flat sitemap and generate the paths
	const sitemap: { [path: string]: SitemapNode } = await agilityClient.getSitemapFlat({
	  channelName: process.env.AGILITY_SITEMAP || "website",
	  languageCode,
	});
  
	const paths = Object.values(sitemap)
	  .filter((node, index) => {
		if (node.redirect !== null || node.isFolder === true || index === 0) return false;
		return true;
	  })
	  .map((node) => {
		return {
		  slug: node.path.split("/").slice(1),
		};
	  });
  
	console.log("Pre-rendering", paths.length, "static paths.");
	return paths;
  }

/**
 * Generate metadata for this page
 */
export async function generateMetadata(
	props: PageProps,
	parent: ResolvingMetadata
  ): Promise<Metadata> {
	const { params } = props;  // Remove the 'await' here

	const { locale, sitemap, isDevelopmentMode, isPreview } = await getAgilityContext();
	const agilityData = await getAgilityPage({ params });
	if (!agilityData.page) return {};
	return await resolveAgilityMetaData({
	  agilityData,
	  locale,
	  sitemap,
	  isDevelopmentMode,
	  isPreview,
	  parent,
	});
  }
  export default async function Page({ params }: PageProps) {

	const agilityData = await getAgilityPage({ params });
	if (!agilityData.page) notFound();
  
	const AgilityPageTemplate = getPageTemplate(agilityData.pageTemplateName || "");
  
	return (
	  <div data-agility-page={agilityData.page?.pageID} data-agility-dynamic-content={agilityData.sitemapNode.contentID}>
		{AgilityPageTemplate ? (
		  <AgilityPageTemplate {...agilityData} />
		) : (
		  <InlineError message={`No template found for page template name: ${agilityData.pageTemplateName}`} />
		)}
	  </div>
	);
  }
