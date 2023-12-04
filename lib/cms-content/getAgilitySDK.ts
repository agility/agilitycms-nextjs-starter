import "server-only";
import agility, { ApiClientInstance } from '@agility/content-fetch'
import { draftMode } from 'next/headers'



const getAgilitySDK = () => {

	const isPreview = draftMode().isEnabled

	const apiKey = isPreview ? process.env.AGILITY_API_PREVIEW_KEY : process.env.AGILITY_API_FETCH_KEY

	return agility.getApi({
		guid: process.env.AGILITY_GUID,
		apiKey,
		isPreview
	});



}

export default getAgilitySDK