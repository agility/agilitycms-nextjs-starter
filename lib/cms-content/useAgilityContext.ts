



export const getAgilityContext = () => {

	const isDevelopmentMode = process.env.NODE_ENV === "development"

	//TODO: get the preview data
	const isPreview = false || isDevelopmentMode

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
