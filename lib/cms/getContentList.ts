import getAgilitySDK from "lib/cms/getAgilitySDK"
import { cacheConfig } from "lib/cms/cacheConfig"
import { ContentListRequestParams } from "@agility/content-fetch/dist/methods/getContentList"

export const getContentList = async (params: ContentListRequestParams) => {

	// get module fields
	const agilitySDK = getAgilitySDK()

	agilitySDK.config.fetchConfig = {
		next: {
			tags: [`agility-content-${params.referenceName}-${params.languageCode || params.locale}`],
			revalidate: cacheConfig.cacheDuration,
		},
	}

	return await agilitySDK.getContentList(params)

}