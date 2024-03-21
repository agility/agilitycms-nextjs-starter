/** @type {import('next').NextConfig} */
const nextConfig = {
	//output: "standalone", //this is only for next.js on Azure Static Web Apps...
	reactStrictMode: true,
	swcMinify: true,
	images: {
		remotePatterns: [
			{
				protocol: 'https',
				hostname: '*.aglty.io',
			},
		],
	},
}

module.exports = nextConfig
