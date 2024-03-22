export const cacheConfig = {
	/**
	 * The default cache duration in seconds for the Agility CMS content via the fetch API
	 */
	cacheDuration: process.env.AGILITY_FETCH_CACHE_DURATION ? parseInt(process.env.AGILITY_FETCH_CACHE_DURATION) : 60,

	/**
	 * The duration in seconds before a path will be revalidated
	 */
	pathRevalidateDuration: process.env.AGILITY_PATH_REVALIDATE_DURATION ? parseInt(process.env.AGILITY_PATH_REVALIDATE_DURATION) : 60,
};