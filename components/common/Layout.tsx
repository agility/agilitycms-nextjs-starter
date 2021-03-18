
import { getPageTemplate } from "components/agility-pageTemplates"
import PreviewBar from './PreviewBar'
import GlobalHeader from './GlobalHeader'
import GlobalFooter from './GlobalFooter'
import { useRouter } from 'next/router'
import Head from 'next/head'

import Error from 'next/error'


function Layout(props) {

	const { page, sitemapNode, dynamicPageItem, notFound, pageTemplateName } = props

	// If the page is not yet generated, this will be displayed
	// initially until getStaticProps() finishes running
	const router = useRouter()
	if (router.isFallback) {
		return (
			<div className="relative flex justify-center items-center h-screen">
				<div className="inline-block motion-safe:animate-spin ease duration-300 w-5 h-5 mx-2">
				<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
					<path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
				</svg>
				</div>
				<div className="inline-block h-5 mx-2">Loading... </div>
			</div>
		)

	}

	if (notFound === true) {
		return <Error statusCode={404} />
	}

	const AgilityPageTemplate = getPageTemplate(pageTemplateName);

	if (dynamicPageItem?.seo?.metaDescription) {
		page.seo.metaDescription = dynamicPageItem.seo.metaDescription
	}

	return (
		<>
			<Head>
				<title>{sitemapNode?.title} - Agility CMS Sample Blog</title>
				<meta name="viewport" content="initial-scale=1.0, width=device-width" />
				<meta name="description" content={page.seo.metaDescription} />
				<meta name="generator" content="Agility CMS" />
				<meta name="agility_timestamp" content={new Date().toLocaleString()} />
				{dynamicPageItem?.seo?.ogImage &&
					<meta property="og:image" content={dynamicPageItem.seo.ogImage} />
				}

			</Head>
			<PreviewBar {...props} />

			<main>
				<GlobalHeader {...props} />
				<AgilityPageTemplate {...props} />
				<GlobalFooter {...props} />
			</main>

		</>
	)
}

export default Layout
