import getAgilitySDK from "lib/cms/getAgilitySDK"
import { cacheConfig } from "lib/cms/cacheConfig"

import { SitemapFlatRequestParams } from "@agility/content-fetch/dist/methods/getSitemapFlat"

/**
 * Get the flat sitemap for the given language code, with caching information added.
 * @param params
 * @returns
 */
export const getSitemapFlat = async (params: SitemapFlatRequestParams) => {


	const agilitySDK = getAgilitySDK()

	agilitySDK.config.fetchConfig = {
		next: {
			tags: [`agility-sitemap-flat-${params.languageCode || params.locale}`],
			revalidate: cacheConfig.cacheDuration,
		},
	}

	return await agilitySDK.getSitemapFlat(params)

}