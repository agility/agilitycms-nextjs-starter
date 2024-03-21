import { draftMode } from 'next/headers'
import { agilityConfig } from "@agility/nextjs"

/**
 * Gets the Agility context for the current request.
 */
export const getAgilityContext = () => {

	//determine if we're in preview mode based on "draft" mode from next.js
	const { isEnabled } = draftMode()

	const isDevelopmentMode = process.env.NODE_ENV === "development"

	//determine whether it's preview or dev mode
	const isPreview = isEnabled || isDevelopmentMode

	return {
		locales: agilityConfig.locales,
		locale: "en-us",
		sitemap: agilityConfig.channelName,
		isPreview,
		isDevelopmentMode
	}
}

export const useAgilityContext = () => {
	return getAgilityContext()
}
