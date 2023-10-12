import SEO from "components/common/SEO"
import {getAgilityPage, GetPageProps} from "lib/cms-content/getAgilityPage"

export default async function Head(props: GetPageProps) {
	const agilityPage = await getAgilityPage(props)

	return (
		<>
			<SEO
				title={agilityPage.sitemapNode?.title}
				description={agilityPage.page?.seo?.metaDescription}
				keywords={agilityPage.page?.seo?.metaKeywords}
				metaHTML={agilityPage.page?.seo?.metaHTML}
			/>
		</>
	)
}
