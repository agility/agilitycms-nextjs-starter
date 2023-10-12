import "server-only";
import agility from '@agility/content-fetch'


let sdk: any = null

const getAgilitySDK = () => {

	if (!sdk) {

		//TODO: get the preview data
		const isPreview = false

		const apiKey = isPreview ? process.env.AGILITY_API_PREVIEW_KEY : process.env.AGILITY_API_FETCH_KEY

		sdk = agility.getApi({
			guid: process.env.AGILITY_GUID,
			apiKey,
			isPreview
		});
	}

	return sdk

}

export default getAgilitySDK