# How This Starter Works

A comprehensive guide to understanding the architecture, data flow, and key concepts of the Agility CMS + Next.js starter.

## Table of Contents

- [Core Concepts](#core-concepts)
- [The Page Lifecycle](#the-page-lifecycle)
- [Dynamic Routing System](#dynamic-routing-system)
- [Component Architecture](#component-architecture)
- [Page Templates](#page-templates)
- [Data Fetching Strategy](#data-fetching-strategy)
- [Caching & Performance](#caching--performance)
- [Preview Mode](#preview-mode)
- [Image Optimization](#image-optimization)
- [API Routes](#api-routes)

## Core Concepts

### Content-Driven Architecture

This starter is built on the principle that **content drives everything**:

```
Agility CMS (Content & Structure)
         ↓
   Sitemap + Pages
         ↓
  React Components
         ↓
    Static HTML
```

**What this means:**

- Editors control page structure in Agility CMS
- Developers define component behavior in React
- Next.js generates optimized static pages
- Users get blazing-fast page loads

### Server-First Rendering

By default, everything is a React Server Component:

```typescript
// ✅ Default: Server Component (async)
export default async function MyComponent({module}) {
	const data = await fetchData() // Can fetch directly
	return <div>{data.title}</div>
}

// ⚠️ Only when needed: Client Component
;("use client")
export default function InteractiveComponent() {
	const [count, setCount] = useState(0)
	return <button onClick={() => setCount(count + 1)}>{count}</button>
}
```

**Benefits:**

- Zero JavaScript for static content
- Direct database/API access in components
- Better SEO and performance
- Smaller client-side bundles

### Separation of Concerns

The codebase is organized into clear layers:

| Layer             | Location           | Responsibility        | Example              |
| ----------------- | ------------------ | --------------------- | -------------------- |
| **Presentation**  | `components/`      | UI rendering          | `Heading.tsx`        |
| **Domain Logic**  | `lib/cms-content/` | Business logic        | `getPostListing()`   |
| **CMS Utilities** | `lib/cms/`         | Generic CMS ops       | `getContentItem()`   |
| **Types**         | `lib/types/`       | TypeScript interfaces | `IPost`              |
| **Routing**       | `app/`             | Next.js routing       | `[...slug]/page.tsx` |

## The Page Lifecycle

### 1. Build Time

When you run `npm run build`:

```typescript
// app/[...slug]/page.tsx

// Step 1: Generate all static paths
export async function generateStaticParams() {
	const sitemap = await getSitemapFlat({
		languageCode: "en-us",
	})

	// Returns: [
	//   { slug: [] },              // homepage
	//   { slug: ['about'] },       // /about
	//   { slug: ['blog'] },        // /blog
	//   { slug: ['blog', 'post-1'] }, // /blog/post-1
	// ]
	return sitemap.map((node) => ({
		slug: node.pagePath.split("/").filter(Boolean),
	}))
}
```

**What happens:**

1. Next.js calls `generateStaticParams()`
2. Fetches sitemap from Agility CMS
3. Creates a static path for each page
4. Generates HTML file for each path

**Output:**

```
.next/server/app/
├── index.html              # homepage
├── about.html              # /about
├── blog.html               # /blog
└── blog/
    └── post-1.html         # /blog/post-1
```

### 2. SEO Metadata Generation

For each page, generate metadata:

```typescript
// Step 2: Generate metadata
export async function generateMetadata({params}) {
	const slug = params.slug?.join("/") || ""

	const page = await getAgilityPage({
		slug,
		locale: "en-us",
		sitemap: "website",
	})

	return {
		title: page.title,
		description: page.seo.metaDescription,
		keywords: page.seo.metaKeywords,
		openGraph: {
			title: page.title,
			description: page.seo.metaDescription,
			images: [page.seo.ogImage],
		},
		twitter: {
			card: "summary_large_image",
			title: page.title,
			description: page.seo.metaDescription,
		},
	}
}
```

**Result:**

- Search engines see proper metadata
- Social media previews work correctly
- Better SEO rankings

### 3. Page Rendering

Finally, render the page content:

```typescript
// Step 3: Render the page
export default async function Page({params}) {
	const slug = params.slug?.join("/") || ""

	const page = await getAgilityPage({
		slug,
		locale: "en-us",
		sitemap: "website",
	})

	// Get the appropriate page template
	const AgilityPageTemplate = getPageTemplate(page.templateName)

	// Render it
	return <AgilityPageTemplate page={page} />
}
```

### 4. Request Time (Production)

When a user visits your site:

```
User requests /blog/my-post
         ↓
CDN serves cached HTML (instant!)
         ↓
[After revalidate duration]
         ↓
Background: Regenerate HTML
         ↓
Next request gets fresh HTML
```

This is **Incremental Static Regeneration (ISR)**.

## Dynamic Routing System

### Catch-All Route Pattern

Instead of creating a file for each page, we use a single catch-all route:

```
app/
├── layout.tsx           # Root layout
├── page.tsx             # Homepage (/)
└── [...slug]/           # All other pages
    └── page.tsx         # Handles: /about, /blog, /blog/post-1, etc.
```

**Why this works:**

1. **Agility CMS manages the sitemap**

   - Editors create pages
   - Define URLs
   - Control page structure

2. **Next.js catches all paths**

   - `[...slug]` matches any path
   - `['about']` → `/about`
   - `['blog', 'post-1']` → `/blog/post-1`

3. **getAgilityPage resolves content**
   ```typescript
   const page = await getAgilityPage({slug: "blog/post-1"})
   // Returns: page content, template name, zones, modules
   ```

### URL Structure

| URL             | Params                      | CMS Page     |
| --------------- | --------------------------- | ------------ |
| `/`             | `slug: undefined`           | Homepage     |
| `/about`        | `slug: ['about']`           | About page   |
| `/blog`         | `slug: ['blog']`            | Blog listing |
| `/blog/my-post` | `slug: ['blog', 'my-post']` | Blog post    |

### Error Handling

The route includes error boundaries:

```typescript
// app/[...slug]/error.tsx
export default function Error({error}) {
	return (
		<div>
			<h1>Something went wrong</h1>
			<p>{error.message}</p>
		</div>
	)
}

// app/[...slug]/not-found.tsx
export default function NotFound() {
	return (
		<div>
			<h1>404 - Page Not Found</h1>
			<Link href="/">Go home</Link>
		</div>
	)
}
```

## Component Architecture

### Module Registry Pattern

CMS modules are mapped to React components:

```typescript
// components/agility-components/index.ts
import {Module} from "@agility/nextjs"
import Heading from "./Heading"
import RichTextArea from "./RichTextArea"
import FeaturedPost from "./FeaturedPost"

const allModules: Module[] = [
	{name: "Heading", module: Heading},
	{name: "RichTextArea", module: RichTextArea},
	{name: "FeaturedPost", module: FeaturedPost},
]

export const getModule = (moduleName: string) => {
	const found = allModules.find((m) => m.name.toLowerCase() === moduleName.toLowerCase())

	return found?.module || null
}
```

**How it works:**

1. **In Agility CMS:**

   - Create component model named "Heading"
   - Add to page via content zone

2. **At render time:**

   ```typescript
   const moduleName = "Heading" // from CMS
   const Component = getModule(moduleName)
   // Returns: Heading component
   ```

3. **Component renders:**
   ```typescript
   <Component module={moduleData} page={pageData} languageCode="en-us" />
   ```

### Component Props

Every component receives standard props:

```typescript
import {UnloadedModuleProps} from "@agility/nextjs"

interface IMyModule {
	heading: string
	content: string
}

export default async function MyComponent({module, page, languageCode}: UnloadedModuleProps) {
	const {fields} = module as {fields: IMyModule}

	return (
		<section>
			<h2>{fields.heading}</h2>
			<div>{fields.content}</div>
		</section>
	)
}
```

**Props explained:**

| Prop           | Type     | Contains                            |
| -------------- | -------- | ----------------------------------- |
| `module`       | `object` | `contentID`, `fields`, `properties` |
| `page`         | `object` | Complete page data                  |
| `languageCode` | `string` | Current locale                      |

### Server Components by Default

Components are server components unless marked with `"use client"`:

```typescript
// ✅ Server Component (default)
export default async function PostsList({module}) {
	// Can fetch data directly
	const posts = await getPostListing({take: 10})

	return (
		<div>
			{posts.map((post) => (
				<article key={post.contentID}>
					<h3>{post.title}</h3>
				</article>
			))}
		</div>
	)
}
```

**When to use client components:**

```typescript
// ⚠️ Client Component (interactive)
"use client"

import {useState} from "react"

export default function FilterablePosts({initialPosts}) {
	const [filter, setFilter] = useState("")

	return (
		<div>
			<input value={filter} onChange={(e) => setFilter(e.target.value)} />
			{/* Filter posts */}
		</div>
	)
}
```

### Hybrid Pattern

Combine both: Server Component fetches, Client Component handles interactivity:

```typescript
// PostsListing.server.tsx (Server Component)
import PostsListingClient from "./PostsListing.client"
import {getPostListing} from "@/lib/cms-content/getPostListing"

export default async function PostsListing({module}) {
	// Server: Fetch data
	const {posts} = await getPostListing({take: 10})

	// Pass to client component
	return <PostsListingClient initialPosts={posts} />
}

// PostsListing.client.tsx (Client Component)
;("use client")

export default function PostsListingClient({initialPosts}) {
	const [posts, setPosts] = useState(initialPosts)

	// Client: Handle infinite scroll, filtering, etc.
	return <div>{/* Interactive UI */}</div>
}
```

## Page Templates

### Template System

Page templates define the layout structure:

```typescript
// components/agility-pages/MainTemplate.tsx
import {ContentZone} from "@agility/nextjs"
import {getModule} from "../agility-components"

export default function MainTemplate({page}) {
	return (
		<div className="max-w-7xl mx-auto">
			<ContentZone name="MainContent" page={page} getModule={getModule} />
		</div>
	)
}
```

### ContentZone Component

`<ContentZone>` is the magic that renders modules:

```typescript
<ContentZone
	name="MainContent" // Zone reference name from CMS
	page={page} // Page data with all zones
	getModule={getModule} // Function to resolve component
/>
```

**What it does:**

1. Looks up `page.zones.MainContent`
2. Loops through each module in that zone
3. Calls `getModule(moduleName)` to get React component
4. Renders each component with props

**Equivalent to:**

```typescript
{
	page.zones.MainContent.map((module) => {
		const Component = getModule(module.moduleName)
		return <Component key={module.contentID} module={module} page={page} />
	})
}
```

### Multiple Zones

Templates can have multiple zones:

```typescript
export default function TwoColumnTemplate({page}) {
	return (
		<div className="grid grid-cols-3 gap-8">
			<div className="col-span-2">
				<ContentZone name="MainContent" page={page} getModule={getModule} />
			</div>

			<aside className="col-span-1">
				<ContentZone name="Sidebar" page={page} getModule={getModule} />
			</aside>
		</div>
	)
}
```

**In Agility CMS:**

- Define "TwoColumnTemplate" page model
- Add two zones: "MainContent" and "Sidebar"
- Editors can add different components to each zone

### Template Registry

Register templates like components:

```typescript
// components/agility-pages/index.ts
import MainTemplate from "./MainTemplate"
import TwoColumnTemplate from "./TwoColumnTemplate"

export const allPageTemplates = {
	MainTemplate,
	TwoColumnTemplate,
}

export const getPageTemplate = (templateName: string) => {
	return allPageTemplates[templateName] || MainTemplate
}
```

## Data Fetching Strategy

### Three-Tier Architecture

```
┌─────────────────────────────────────────┐
│  Component Layer                        │
│  "What content do I need to display?"   │
└─────────────────┬───────────────────────┘
                  │
                  │ const posts = await getPostListing()
                  │
┌─────────────────▼───────────────────────┐
│  Domain Layer (lib/cms-content/)        │
│  "How do I get blog posts with URLs?"   │
└─────────────────┬───────────────────────┘
                  │
                  │ const items = await getContentList()
                  │
┌─────────────────▼───────────────────────┐
│  CMS Layer (lib/cms/)                   │
│  "How do I fetch from Agility CMS?"     │
└─────────────────┬───────────────────────┘
                  │
                  │ await api.getContentList()
                  │
┌─────────────────▼───────────────────────┐
│  Agility SDK (@agility/content-fetch)   │
│  "Make HTTP request to Agility API"     │
└─────────────────────────────────────────┘
```

### Why Three Tiers?

**1. CMS Layer (Generic)**

Reusable utilities that work for any Agility project:

```typescript
// lib/cms/getContentItem.ts
export async function getContentItem<T>({contentID, languageCode}: GetContentItemProps): Promise<T> {
	const {isPreview} = await getAgilityContext()
	const api = getAgilitySDK({isPreview})

	const item = await api.getContentItem({
		contentID,
		languageCode,
		revalidateInSeconds: 120,
		cacheTags: [`content-${contentID}`],
	})

	return item.fields as T
}
```

**2. Domain Layer (Specific)**

Business logic for your application:

```typescript
// lib/cms-content/getPostListing.ts
export async function getPostListing({take = 10, skip = 0, category}: GetPostListingProps) {
	// Fetch posts
	const posts = await getContentList<IPost>({
		referenceName: "posts",
		languageCode: "en-us",
		take,
		skip,
		sort: "fields.date",
		direction: "desc",
		filter: category ? `fields.category[eq]${category}` : undefined,
	})

	// Get sitemap for URLs
	const sitemap = await getSitemapFlat({languageCode: "en-us"})
	const blogNode = sitemap.find((n) => n.name === "Blog")

	// Add computed fields
	const postsWithUrls = posts.map((post) => ({
		...post,
		url: `${blogNode.path}/${post.slug}`,
		excerpt: post.excerpt || stripHTML(post.content).slice(0, 160),
	}))

	return {
		posts: postsWithUrls,
		hasMore: posts.length === take,
	}
}
```

**3. Component Layer (Presentation)**

Just renders the data:

```typescript
// components/agility-components/PostsListing.tsx
export default async function PostsListing({module}) {
	const {posts} = await getPostListing({take: 10})

	return (
		<div className="grid md:grid-cols-2 gap-8">
			{posts.map((post) => (
				<article key={post.contentID}>
					<h3>{post.title}</h3>
					<p>{post.excerpt}</p>
					<Link href={post.url}>Read more</Link>
				</article>
			))}
		</div>
	)
}
```

### Benefits

| Benefit                    | Explanation                            |
| -------------------------- | -------------------------------------- |
| **Testability**            | Each layer can be tested independently |
| **Reusability**            | CMS layer works across projects        |
| **Maintainability**        | Changes isolated to appropriate layer  |
| **Type Safety**            | Strong TypeScript types at each layer  |
| **Separation of Concerns** | Business logic separate from rendering |

## Caching & Performance

### Multi-Layer Cache

Your content is cached at multiple levels:

```
┌────────────────────────────────────┐
│  Browser Cache (HTTP headers)     │ ← Instant
└────────────────────────────────────┘
              ↓ cache miss
┌────────────────────────────────────┐
│  CDN Edge Cache (Vercel)          │ ← ~50ms
└────────────────────────────────────┘
              ↓ cache miss
┌────────────────────────────────────┐
│  Next.js Route Cache (ISR)        │ ← ~100ms
└────────────────────────────────────┘
              ↓ cache miss
┌────────────────────────────────────┐
│  Agility SDK Cache (in-memory)    │ ← ~200ms
└────────────────────────────────────┘
              ↓ cache miss
┌────────────────────────────────────┐
│  Agility CMS API                  │ ← ~300-500ms
└────────────────────────────────────┘
```

### ISR Configuration

Set revalidation periods:

```typescript
// app/[...slug]/page.tsx
export const revalidate = Number(process.env.AGILITY_PATH_REVALIDATE_DURATION || 60)
```

**How ISR works:**

1. **First request** (after build):

   - Serves static HTML (instant)
   - HTML is 0-60 seconds old

2. **After revalidate period**:

   - Next request still gets old HTML (fast!)
   - Triggers background regeneration
   - New HTML is generated
   - Subsequent requests get updated HTML

3. **Benefits:**
   - Users always get fast response
   - Content stays reasonably fresh
   - No need to rebuild entire site

### SDK-Level Caching

Content items are cached by the SDK:

```typescript
const item = await api.getContentItem({
	contentID: 123,
	languageCode: "en-us",
	revalidateInSeconds: 120, // Cache for 2 minutes
})
```

**Configure via environment:**

```env
# SDK caches for this many seconds
AGILITY_FETCH_CACHE_DURATION=120
```

### Cache Tags

Tag content for granular invalidation:

```typescript
const post = await api.getContentItem({
	contentID: 123,
	languageCode: "en-us",
	cacheTags: [
		"content-123-en-us", // Specific item
		"content-posts-en-us", // All posts
		"sitemap-en-us", // Sitemap
	],
})
```

**Invalidate on demand:**

```typescript
// In webhook handler
revalidateTag("content-123-en-us") // Just this post
revalidateTag("content-posts-en-us") // All posts
```

### Webhook-Driven Updates

When content is published in Agility CMS:

```
Content published in CMS
         ↓
Webhook fired → /api/revalidate
         ↓
Validate security key
         ↓
Determine affected tags
         ↓
Call revalidateTag() for each
         ↓
Next.js regenerates affected pages
         ↓
Users get fresh content on next request
```

**Setup:**

1. In Agility: **Settings > Webhooks**
2. URL: `https://your-site.com/api/revalidate`
3. Events: Content Published, Page Modified
4. Header: `x-agility-webhook-secret: YOUR_KEY`

## Preview Mode

### How Preview Works

Preview mode lets editors see draft content:

```typescript
// middleware.ts
export function middleware(request: NextRequest) {
	const {searchParams} = request.nextUrl

	if (searchParams.has("agilitypreviewkey")) {
		// Rewrite to preview API
		return NextResponse.rewrite(new URL("/api/preview", request.url))
	}
}

// app/api/preview/route.ts
export async function GET(request: NextRequest) {
	const searchParams = request.nextUrl.searchParams
	const secret = searchParams.get("agilitypreviewkey")

	// Validate security key
	if (secret !== process.env.AGILITY_SECURITY_KEY) {
		return new Response("Invalid key", {status: 401})
	}

	// Enable draft mode
	draftMode().enable()

	// Resolve ContentID → URL
	const contentID = searchParams.get("ContentID")
	const url = await resolveContentURL(contentID)

	// Redirect to actual page
	redirect(url)
}
```

### Draft vs. Live Content

The SDK automatically handles mode:

```typescript
export function getAgilitySDK({isPreview}: {isPreview: boolean}) {
	const apiKey = isPreview
		? process.env.AGILITY_API_PREVIEW_KEY // Draft content
		: process.env.AGILITY_API_FETCH_KEY // Published only

	return agilitySDK({
		guid: process.env.AGILITY_GUID,
		apiKey,
		isPreview,
	})
}
```

### Preview Bar

When in preview mode, a bar appears:

```typescript
// components/common/PreviewBar.tsx
"use client"

import {useRouter} from "next/navigation"

export default function PreviewBar({isDraftMode}) {
	const router = useRouter()

	if (!isDraftMode) return null

	return (
		<div className="bg-yellow-500 text-black p-2 text-center">
			<strong>Preview Mode</strong>
			<button
				onClick={async () => {
					await fetch("/api/preview/exit")
					router.refresh()
				}}
			>
				Exit Preview
			</button>
		</div>
	)
}
```

## Image Optimization

### AgilityPic Component

Use `<AgilityPic>` for Agility images:

```typescript
import {AgilityPic} from "@agility/nextjs"

;<AgilityPic
	image={fields.image} // { url, label }
	fallbackWidth={800} // Default width
	className="rounded-lg"
	alt={fields.image.label}
/>
```

**What it does:**

1. Uses Next.js `<Image>` component
2. Adds Agility CDN image parameters
3. Optimizes format (WebP, AVIF)
4. Lazy loads images
5. Provides responsive sizes

### Manual Optimization

For non-Agility images:

```typescript
import Image from "next/image"

;<Image
	src="/local-image.jpg"
	alt="Description"
	width={800}
	height={600}
	priority={false} // Lazy load
	quality={85} // 0-100
	sizes="(max-width: 768px) 100vw, 800px"
/>
```

## API Routes

### Revalidate Endpoint

Handles webhooks from Agility CMS:

```typescript
// app/api/revalidate/route.ts
export async function POST(request: Request) {
	const secret = request.headers.get("x-agility-webhook-secret")

	if (secret !== process.env.AGILITY_SECURITY_KEY) {
		return Response.json({error: "Invalid"}, {status: 401})
	}

	const body = await request.json()

	// Revalidate specific content
	if (body.contentID) {
		revalidateTag(`content-${body.contentID}-${body.languageCode}`)
	}

	// Revalidate content lists
	if (body.referenceName) {
		revalidateTag(`content-${body.referenceName}-${body.languageCode}`)
	}

	// Revalidate sitemap if page changed
	if (body.type === "page") {
		revalidateTag(`sitemap-${body.languageCode}`)
	}

	return Response.json({revalidated: true})
}
```

### Dynamic Redirect

Maps ContentID to URL:

```typescript
// app/api/dynamic-redirect/route.ts
export async function GET(request: Request) {
	const {searchParams} = new URL(request.url)
	const contentID = searchParams.get("contentid")

	// Look up in sitemap
	const sitemap = await getSitemapFlat({languageCode: "en-us"})
	const node = sitemap.find((n) => n.contentID === Number(contentID))

	if (!node) {
		return Response.json({error: "Not found"}, {status: 404})
	}

	return Response.redirect(node.path)
}
```

**Usage:**

```
/api/dynamic-redirect?contentid=123 → /blog/my-post
```

---

## Summary

This starter uses modern Next.js patterns to create a fast, scalable, content-managed website:

- **Server-first rendering** for better performance
- **Dynamic routing** driven by CMS sitemap
- **Component registry** for flexible page building
- **Multi-layer caching** for optimal speed
- **Preview mode** for content editing
- **Type safety** throughout

**Next:** Learn how to create your own components in [COMPONENTS.md](./COMPONENTS.md).
