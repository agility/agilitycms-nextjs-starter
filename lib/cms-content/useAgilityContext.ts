

import { draftMode } from 'next/headers'

export const getAgilityContext = () => {

	const { isEnabled } = draftMode()

	const isDevelopmentMode = process.env.NODE_ENV === "development"

	//determine whether it's preview or dev mode
	const isPreview = isEnabled || isDevelopmentMode

	console.log("mode", { isPreview, isDevelopmentMode })

	return {
		locale: "en-us",
		sitemap: "website",
		isPreview,
		isDevelopmentMode
	}
}

export const useAgilityContext = () => {
	return getAgilityContext()
}
