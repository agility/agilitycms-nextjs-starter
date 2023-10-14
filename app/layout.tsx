import LoadingWidget from "components/common/LoadingWidget"
import PreviewBar from "components/common/PreviewBar"
import SiteFooter from "components/common/SiteFooter"
import SiteHeader from "components/common/SiteHeader"
import {useAgilityContext} from "lib/cms-content/useAgilityContext"

import {Inter} from "next/font/google"

import "/styles/globals.css"
import "/styles/nprogress.min.css"
import {getHeaderContent} from "lib/cms-content/getHeaderContent"

const inter = Inter({
	subsets: ["latin"],
	variable: "--font-inter",
})

export default async function RootLayout({children}: {children: React.ReactNode}) {
	const {locale, sitemap, isDevelopmentMode, isPreview} = useAgilityContext()

	const header = await getHeaderContent({sitemap, locale})

	const isPreviewRequested = false

	return (
		<html lang="en" className={inter.className}>
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
