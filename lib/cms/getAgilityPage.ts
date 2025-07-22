import "server-only";
import { getAgilityPageProps } from "@agility/nextjs/node";
import { getAgilityContext } from "./getAgilityContext";

export interface PageProps {
	params: Promise<{ slug: string[] }>
	searchParams?: Promise<{ [key: string]: string | string[] | undefined }>
}


/**
 * Get a page with caching information added.
 * @param param0
 * @returns
 */
export const getAgilityPage = async ({ params }: PageProps) => {

	const awaitedParams = await params
	const { isPreview: preview, locale } = await getAgilityContext()

	if (!awaitedParams.slug) awaitedParams.slug = [""]

	const page = await getAgilityPageProps({
		params: awaitedParams, preview, locale, apiOptions: {
			contentLinkDepth: 0
		}
	})

	return page

}

