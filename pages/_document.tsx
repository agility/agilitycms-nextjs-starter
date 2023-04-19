import {Html, Head, Main, NextScript} from "next/document"

export default function Document () {
	return (
		<Html>
			<Head>
				<link rel="preconnect" href="https://fonts.cdnfonts.com" />
				<link href="https://fonts.cdnfonts.com/css/avenir-next-cyr" rel="stylesheet" />
			</Head>
			<body>
				<Main />
				<NextScript />
			</body>
		</Html>
	)
}