const { fontFamily } = require('tailwindcss/defaultTheme')

module.exports = {

	content: [
		"./pages/**/*.{js,ts,jsx,tsx}",
		"./components/**/*.{js,ts,jsx,tsx}"
	],

	theme: {
		container: {
			screens: {
			},
		},
		fontFamily: {
			sans: ['Avenir Next Cyr', ...fontFamily.sans],
		},
		extend: {

			colors: {
				transparent: "transparent",
				agility: "#222",
				darkgray:"#0d333f",
				gray: {
					lightest: "#fff",
					100: "#f7fafc",
					200: "#edf2f7",
					300: "#e2e8f0",
					400: "#cbd5e0",
					500: "#a0aec0",
					600: "#718096",
					700: "#4a5568",
					800: "#2d3748",
					900: "#1a202c",
				},
				primary: {
					100: "#dcfce7",
					200: "#bbf7d0",
					300: "#86efac",
					400: "#4ade80",
					500: "#0a8543",
					600: "#16a34a",
					700: "#086d37",
					800: "#166534",
					900: "#14532d",
				},
				secondary: {
					100: "#7c8ba1",
					200: "#667892",
					300: "#506582",
					400: "#3a5173",
					500: "#243E63",
					600: "#203859",
					700: "#1d324f",
					800: "#192b45",
					900: "#16253b",
				},
			},
		},
	},
	variants: {
		extend: {},
	},
	plugins: [
		require("@tailwindcss/typography"),
		require('@tailwindcss/line-clamp')
	],
};
