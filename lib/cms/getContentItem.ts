import { ContentItemRequestParams } from "@agility/content-fetch/dist/methods/getContentItem"
import getAgilitySDK from "lib/cms/getAgilitySDK"
import { cacheConfig } from "lib/cms/cacheConfig"
import { ContentItem } from "@agility/content-fetch"

/**
 * Get a content item with caching information added.
 * @param params
 * @returns
 */
export const getContentItem = async <T>(params: ContentItemRequestParams) => {

	const agilitySDK = getAgilitySDK()

	agilitySDK.config.fetchConfig = {
		next: {
			tags: [`agility-content-${params.contentID}-${params.languageCode || params.locale}`],
			revalidate: cacheConfig.cacheDuration,
		},
	}

	return await agilitySDK.getContentItem(params) as ContentItem<T>

}