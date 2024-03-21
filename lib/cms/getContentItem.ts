import { ContentItemRequestParams } from "@agility/content-fetch/dist/methods/getContentItem"
import getAgilitySDK from "lib/cms/getAgilitySDK"
import { cacheConfig } from "lib/cms/cacheConfig"
import { ContentItem } from "@agility/content-fetch"

export const getContentItem = async <T>(params: ContentItemRequestParams) => {

	// get module fields
	const agilitySDK = getAgilitySDK()

	agilitySDK.config.fetchConfig = {
		next: {
			tags: [`agility-content-${params.contentID}-${params.languageCode || params.locale}`],
			revalidate: cacheConfig.cacheDuration,
		},
	}

	return await agilitySDK.getContentItem(params) as ContentItem<T>

}