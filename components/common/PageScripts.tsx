import Script from "next/script"
import { PageScript } from "lib/cms-content/getPageScripts"

/**
 * Renders JSON-LD as plain <script type="application/ld+json"> tags so it is part of the
 * server-rendered HTML that crawlers read.
 */
export const JsonLdScripts = ({ jsonLd }: { jsonLd: string[] }) => (
	<>
		{jsonLd.map((json, index) => (
			<script key={`jsonld-${index}`} type="application/ld+json" dangerouslySetInnerHTML={{ __html: json }} />
		))}
	</>
)

/**
 * Renders executable scripts from the CMS with next/script, so they also run after
 * client-side navigation (scripts inserted by React itself are never executed).
 */
export const PageScripts = ({ scripts }: { scripts: PageScript[] }) => (
	<>
		{scripts.map(({ id, src, type, code, attributes }) =>
			src ? (
				<Script key={id} id={id} src={src} type={type} strategy="afterInteractive" {...attributes} />
			) : (
				<Script key={id} id={id} type={type} strategy="afterInteractive" {...attributes} dangerouslySetInnerHTML={{ __html: code || "" }} />
			)
		)}
	</>
)
