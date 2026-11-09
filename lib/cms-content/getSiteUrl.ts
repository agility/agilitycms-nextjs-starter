/**
 * The site's public origin (e.g. `https://www.example.com`), used for canonical URLs, Open Graph
 * URLs and the JSON-LD `@id`s.
 *
 * Set `SITE_URL` in production. Without it, the Vercel production domain is used when the site
 * runs on Vercel, then `http://localhost:3000`.
 */
export const getSiteUrl = (): string => {
	const configured = process.env.SITE_URL?.trim()
	if (configured) return configured.replace(/\/+$/, "")

	const vercel = process.env.VERCEL_PROJECT_PRODUCTION_URL?.trim()
	if (vercel) return `https://${vercel.replace(/\/+$/, "")}`

	return "http://localhost:3000"
}

/** The absolute public URL of a sitemap path. */
export const getPageUrl = (path: string | null | undefined): string => {
	const siteUrl = getSiteUrl()
	if (!path || path === "/") return `${siteUrl}/`
	return `${siteUrl}${path.startsWith("/") ? path : `/${path}`}`
}
