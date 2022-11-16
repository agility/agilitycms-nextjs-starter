/** @type {import('next').NextConfig} */
const nextConfig = {
	reactStrictMode: true,
	swcMinify: true,
	images: {
		remotePatterns: [
			{
				protocol: 'https',
				hostname: 'cdn.aglty.io',
				port: '',
			},
		],
	},
}

module.exports = nextConfig
