import {getPageTemplate} from "../agility-pageTemplates"
import {AgilityPageProps, handlePreview} from "@agility/nextjs"
import {useRouter} from "next/router"
import Error from "next/error"
import PreviewBar from "./PreviewBar"
import SEO from "./SEO"
import SiteHeader from "./SiteHeader"
import SiteFooter from "./SiteFooter"
import LoadingWidget from "./LoadingWidget"
import {useEffect, useState} from "react"

interface Props {
	page: any
	sitemapNode: any
	dynamicPageItem?: any
	notFound: boolean
	pageTemplateName: string
	isPreview: boolean
	isDevelopmentMode: boolean
}

function Layout(props: AgilityPageProps) {
	const {page, sitemapNode, dynamicPageItem, notFound, pageTemplateName, isDevelopmentMode, isPreview} = props

	const [isPreviewRequested, setisPreviewRequested] = useState(false)
	useEffect(() => {
		if (handlePreview(null)) {
			setisPreviewRequested(true)
		}
	}, [])

	// If the page is not yet generated, this will be displayed
	// initially until getStaticProps() finishes running
	const router = useRouter()
	if (router.isFallback) {
		return <LoadingWidget message="Loading Page" />
	}

	// if page not found, throw 404
	if (notFound === true) {
		return <Error statusCode={404} />
	}

	const AgilityPageTemplate = getPageTemplate(pageTemplateName || "")

	if (dynamicPageItem?.seo?.metaDescription) {
		page.seo.metaDescription = dynamicPageItem.seo.metaDescription
	}

	return (
		<>
			<SEO
				title={sitemapNode?.title}
				description={page.seo.metaDescription}
				keywords={page.seo.metaKeywords}
				metaHTML={page.seo.metaHTML}
			/>
			<div id="site-wrapper">
				{isPreviewRequested && <LoadingWidget message="Loading Preview Mode" />}
				{!isPreviewRequested && (
					<div id="site">
						<PreviewBar {...{isDevelopmentMode, isPreview}} />
						<div className="flex flex-col min-h-screen">
							<SiteHeader {...props} />
							<main className="flex-grow">
								{AgilityPageTemplate && <AgilityPageTemplate {...props} />}
								{!AgilityPageTemplate && <div>The template {pageTemplateName} could not be found.</div>}
							</main>
							<SiteFooter />
						</div>
					</div>
				)}
			</div>
		</>
	)
}

export default Layout
