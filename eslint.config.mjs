import { defineConfig, globalIgnores } from "eslint/config"
import nextVitals from "eslint-config-next/core-web-vitals"

const eslintConfig = defineConfig([
	...nextVitals,
	{
		rules: {
			"@next/next/no-html-link-for-pages": "off",
			// New React Compiler rules in eslint-plugin-react-hooks 7 (via eslint-config-next 16).
			// Existing code trips them; kept as warnings until those components are refactored.
			"react-hooks/static-components": "warn",
			"react-hooks/set-state-in-effect": "warn",
		},
	},
	// Override default ignores of eslint-config-next.
	globalIgnores([
		// Default ignores of eslint-config-next:
		".next/**",
		"out/**",
		"build/**",
		"next-env.d.ts",
	]),
])

export default eslintConfig
