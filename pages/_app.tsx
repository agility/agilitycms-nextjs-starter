import Router from "next/router"
import { Inter } from "@next/font/google"
import nprogress from "nprogress"
import "../styles/nprogress.min.css"
import "../styles/globals.css"


const inter = Inter({
	subsets: ["latin"],
	variable: "--font-inter",
})

import type {AppProps} from "next/app"
import { useEffect, useState } from "react"

export default function App({ Component, pageProps }: AppProps) {
	const [loading, setLoading] = useState(false)
	useEffect(() => {
		let active = true
		const setStartLoading = (url: string) => {
			if (!active) return
			nprogress.start()
		}

		const setDoneLoading = (url: string) => {
			if (!active) return
			nprogress.done(false)
		}

		nprogress.configure({showSpinner: false})
		Router.events.on("routeChangeStart", setStartLoading)
		Router.events.on("routeChangeComplete", setDoneLoading)
		Router.events.on("routeChangeError", setDoneLoading)

		return () => {
			active = false
			Router.events.off("routeChangeStart", setStartLoading)
			Router.events.off("routeChangeComplete", setDoneLoading)
			Router.events.off("routeChangeError", setDoneLoading)
		}
	}, [])

	return (
		<main className={`${inter.variable} font-sans`}>
			<Component {...pageProps} />
		</main>
	)
}
