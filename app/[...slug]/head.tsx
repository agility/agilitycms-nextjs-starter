import SEO from "/components/common/SEO"
import {getAgilityPage, GetPageProps} from "/lib/cms-content/getAgilityPage"

//export const revalidate = 10 // revalidate this page every 10 seconds

export default async function Head(props: GetPageProps) {
	const agilityPage = await getAgilityPage(props)

	return (
		<>
			<SEO
				title={agilityPage.sitemapNode?.title}
				description={agilityPage.page.seo?.metaDescription}
				keywords={agilityPage.page.seo?.metaKeywords}
				metaHTML={agilityPage.page.seo?.metaHTML}
			/>
		</>
	)
}
