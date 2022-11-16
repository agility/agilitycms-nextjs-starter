import {Inter} from "@next/font/google"
import "../styles/globals.css"

const inter = Inter({
	subsets: ["latin"],
	variable: "--font-inter",
})

import type {AppProps} from "next/app"

export default function App({Component, pageProps}: AppProps) {
	return (
		<main className={`${inter.variable} font-sans`}>
			<Component {...pageProps} />
		</main>
	)
}
