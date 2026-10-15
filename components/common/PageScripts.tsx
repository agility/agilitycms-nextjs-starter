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
 * Renders the scripts editors added to the page in Agility CMS as plain <script> elements in the
 * server-rendered HTML, with all of their original attributes (async, defer, crossorigin, nonce,
 * data-*, …) and in document order, so they behave as they would in a hand-written page:
 * a library loaded by `src` runs before the inline code after it that uses it.
 *
 * They run on a full page load only. Next.js client-side (soft) navigation does NOT run them:
 * React doesn't execute inline or blocking <script> elements it inserts into the DOM, so
 * moving to a page with <Link> doesn't run that page's scripts, and going back to a page
 * doesn't re-run them. The exception is `<script async src>`, which React 19 treats as a
 * resource: it hoists it to <head>, loads it at most once per document and de-duplicates it by
 * `src`. Scripts that must react to every route change (analytics page views, for example)
 * should listen for navigation themselves, or be added as a client component instead.
 */
export const PageScripts = ({ scripts }: { scripts: PageScript[] }) => (
	<>
		{scripts.map(({ key, props, code }) =>
			code === undefined ? (
				<script key={key} {...props} />
			) : (
				<script key={key} {...props} dangerouslySetInnerHTML={{ __html: code }} />
			)
		)}
	</>
)
