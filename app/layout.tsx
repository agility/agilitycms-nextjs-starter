import LoadingWidget from "components/common/LoadingWidget"
import PreviewBar from "components/common/PreviewBar"
import SiteFooter from "components/common/SiteFooter"
import SiteHeader from "components/common/SiteHeader"
import getAgilitySDK from "lib/cms-content/getAgilitySDK"
import useAgilityContext from "lib/cms-content/useAgilityContext"

import {ContentItem, ImageField} from "@agility/nextjs"
import {Inter} from "next/font/google"

import "/styles/globals.css"
import "/styles/nprogress.min.css"
import {cache} from "react"

interface ILink {
	title: string
	path: string
}

export interface ICustomData {
	siteName: string
	logo: ImageField
	links: ILink[]
}

interface IHeader {
	siteName: string
	logo: ImageField
}

const inter = Inter({
	subsets: ["latin"],
	variable: "--font-inter",
})

export default async function RootLayout({children}: {children: React.ReactNode}) {
	const {locale, channelName, isDevelopmentMode, isPreview} = useAgilityContext()

	const api = getAgilitySDK()

	const loadHeaderData = cache(async () => {
		// set up content item
		let contentItem: ContentItem<IHeader> | null = null

		// set up links
		let links = []

		try {
			// try to fetch our site header
			let header = await api.getContentList({
				referenceName: "siteheader",
				languageCode: locale,
				take: 1,
			})

			// if we have a header, set as content item
			if (header && header.items && header.items.length > 0) {
				contentItem = header.items[0]
			}

			if (!contentItem) {
				return null
			}
		} catch (error) {
			if (console) console.error("Could not load site header item.", error)
			return null
		}

		try {
			// get the nested sitemap
			let sitemap = await api.getSitemapNested({
				channelName: channelName,
				languageCode: locale,
			})

			// grab the top level links that are visible on menu
			links = sitemap
				.filter((node: any) => node.visible.menu)
				.map((node: any) => {
					return {
						title: node.menuText || node.title,
						path: node.path,
					}
				})
		} catch (error) {
			if (console) console.error("Could not load nested sitemap.", error)
		}

		// return clean object...
		return {
			siteName: contentItem.fields.siteName,
			logo: contentItem.fields.logo,
			links,
		} as ICustomData
	})

	const header: ICustomData | null = await loadHeaderData()

	const isPreviewRequested = false

	return (
		<html lang="en" className={inter.className}>
			<head />
			<body>
				<div id="site-wrapper">
					{isPreviewRequested && <LoadingWidget message="Loading Preview Mode" />}
					{!isPreviewRequested && (
						<div id="site">
							<PreviewBar {...{isDevelopmentMode, isPreview}} />
							<div className="flex flex-col min-h-screen">
								<SiteHeader {...{header}} />
								<main className={`flex-grow`}>{children}</main>
								<SiteFooter />
							</div>
						</div>
					)}
				</div>
			</body>
		</html>
	)
}
