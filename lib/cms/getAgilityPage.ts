import "server-only";
import { getAgilityPageProps } from "@agility/nextjs/node";
import { getAgilityContext } from "./useAgilityContext";

export interface PageProps {
	params: { slug: string[] }
	searchParams?: { [key: string]: string | string[] | undefined }
}


/**
 * Get a page with caching information added.
 * @param param0
 * @returns
 */
export const getAgilityPage = async ({ params }: PageProps) => {

	const { isPreview: preview, locale } = getAgilityContext()

	if (!params.slug) params.slug = [""]

	const page = await getAgilityPageProps({
		params, preview, locale, apiOptions: {
			contentLinkDepth: 0
		}
	})

	return page

}

