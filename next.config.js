module.exports = {
	// Here we configure and set up the Agility CDN domain config so we can take advantage of the next/image component
	// Read more about next/image here: https://nextjs.org/docs/api-reference/next/image
	images: {

		domains: [
			`cdn.aglty.io`,
			`cdn-dev.aglty.io`,
			`${process.env.AGILITY_GUID}-cdn.agilitycms.cloud`,
		],
	},
	future: {
		webpack5: true
	},
};
