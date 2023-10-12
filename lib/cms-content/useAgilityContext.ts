
const useAgilityContext = () => {

	const isDevelopmentMode = process.env.NODE_ENV === "development"

	//TODO: get the preview data
	const isPreview = false || isDevelopmentMode

	return {
		locale: "en-us",
		channelName: "website",
		isPreview,
		isDevelopmentMode
	}
}

export default useAgilityContext