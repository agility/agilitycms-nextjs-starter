# Agility CMS Library Usage Rules

## Overview
This project uses the Agility CMS with Next.js 15 and implements a comprehensive caching strategy. The library is located in `@/lib` and provides server-side data fetching with built-in caching and preview mode support.

## Core Principles

### 1. Server-Only Functions
- **ALWAYS** use `import "server-only"` at the top of CMS data fetching functions
- **NEVER** use CMS functions in client components directly
- Use server components or server actions for CMS data fetching

### 2. Caching Strategy
- **ALL** CMS functions implement Next.js 15 caching with:
  - `revalidate: 60` (60 seconds cache duration)
  - Appropriate cache tags for invalidation
- **ALWAYS** use cache tags format: `agility-content-${identifier}-${locale}`
- **NEVER** bypass the caching layer unless explicitly needed

### 3. Preview Mode
- Preview mode is handled through Next.js `draftMode()`
- Development mode (`NODE_ENV === "development"`) automatically enables preview
- **ALWAYS** await `draftMode()` calls in Next.js 15+

## Library Structure & Architecture Principles

### DRY (Don't Repeat Yourself) Patterns
- **Single Responsibility**: Each file has one focused purpose
- **Code Reuse**: All functions share common utilities (e.g., `getAgilitySDK()`)
- **Avoid Bridge Functions**: Don't create unnecessary abstraction layers
- **Granular Breakdown**: One function per file, mirroring SDK structure

### `/lib/cms/` - Core SDK Functions (20-30 lines each)
- `getAgilitySDK()` - **Centralized SDK initialization** (reused by all functions)
- `getAgilityPage()` - Page data with caching
- `getContentItem()` - Individual content items + caching wrapper
- `getContentList()` - Content lists + caching wrapper
- `getSitemapFlat()` - Flat sitemap + caching wrapper
- `getSitemapNested()` - Nested sitemap + caching wrapper
- `getAgilityContext()` - Context for locale, preview state

**Pattern**: Each function wraps the corresponding SDK method with Next.js caching

### `/lib/cms-content/` - Business Logic Functions
- `getHeaderContent()` - Site header and navigation
- `getPostListing()` - Blog posts with URL resolution
- `getPageMetaData()` - Basic page metadata
- `resolveAgilityMetaData()` - Complete metadata with OpenGraph

### `/lib/types/` - TypeScript Definitions (Granular)
- Content type interfaces (`IPost`, `IAuthor`, `ICategory`, `ITag`) - **One per file**
- System types (`Page`, `SitemapNode`) - **One per file**

**Pattern**: Each interface gets its own file, importing dependencies as needed

## Code Reuse & DRY Principles

### Reuse Existing Functions
- **ALWAYS** use existing `/lib/cms/` functions instead of creating new ones
- **NEVER** duplicate SDK initialization logic - reuse `getAgilitySDK()`
- **NEVER** create bridge functions - extend existing functions if needed
- **ALWAYS** check existing components before creating new ones

### Granular File Structure
```typescript
// ✅ GOOD: Small, focused files
/lib/cms/getContentItem.ts     // 23 lines - single purpose
/lib/cms/getContentList.ts     // 23 lines - single purpose  
/lib/types/IPost.ts            // 15 lines - single interface
/lib/types/IAuthor.ts          // 3 lines - single interface

// ❌ BAD: Large monolithic files
/lib/cms/agilityUtils.ts       // 200+ lines - multiple purposes
/lib/types/allTypes.ts         // 100+ lines - multiple interfaces
```

### SDK Wrapper Pattern
```typescript
// ✅ GOOD: Clean SDK wrapper with caching
export const getContentItem = async <T>(params: ContentItemRequestParams) => {
  const agilitySDK = await getAgilitySDK() // Reuse existing
  agilitySDK.config.fetchConfig = { /* caching */ }
  return await agilitySDK.getContentItem(params) as ContentItem<T>
}

// ❌ BAD: Duplicate SDK initialization
export const getContentItem = async <T>(params: ContentItemRequestParams) => {
  const apiKey = process.env.AGILITY_API_FETCH_KEY // Duplicating getAgilitySDK logic
  const agilitySDK = agility.getApi({ guid: process.env.AGILITY_GUID, apiKey })
  // ... rest of function
}
```

### Component Reuse
- **ALWAYS** check `components/agility-components/` for existing patterns
- **REUSE** existing data fetching patterns
- **EXTEND** existing components rather than creating new ones
- **REFERENCE** existing error handling and caching patterns

### Anti-Patterns to Avoid
- Creating large utility files with multiple functions
- Duplicating SDK initialization or configuration logic
- Creating bridge functions when direct SDK usage with caching is sufficient
- Mixing multiple responsibilities in a single file
- Creating new patterns when existing ones work

## Usage Patterns

### 1. Static Generation & Page Exports
```typescript
// Required exports for static generation
export const revalidate = 60
export const runtime = "nodejs"
export const dynamic = "force-static"

// Generate static params for build time
export async function generateStaticParams() {
  const isDevelopmentMode = process.env.NODE_ENV === "development"
  const isPreview = isDevelopmentMode
  const apiKey = isPreview ? process.env.AGILITY_API_PREVIEW_KEY : process.env.AGILITY_API_FETCH_KEY
  const agilityClient = agilitySDK.getApi({
    guid: process.env.AGILITY_GUID,
    apiKey,
    isPreview,
  })
  const languageCode = process.env.AGILITY_LOCALES || "en-us"

  agilityClient.config.fetchConfig = {
    next: {
      tags: [`agility-sitemap-flat-${languageCode}`],
      revalidate: 60,
    },
  }

  const sitemap = await agilityClient.getSitemapFlat({
    channelName: process.env.AGILITY_SITEMAP || "website",
    languageCode,
  })

  return Object.values(sitemap)
    .filter((node, index) => {
      if (node.redirect !== null || node.isFolder === true || index === 0) return false
      return true
    })
    .map((node) => ({
      slug: node.path.split("/").slice(1),
    }))
}
```

### 2. Fetching Content Items
```typescript
import { getContentItem } from "@/lib/cms/getContentItem"
import { IPost } from "@/lib/types/IPost"

const post = await getContentItem<IPost>({
  contentID: 123,
  languageCode: "en-us",
  locale: "en-us"
})
```

### 3. Fetching Content Lists
```typescript
import { getContentList } from "@/lib/cms/getContentList"

const posts = await getContentList({
  referenceName: "posts",
  languageCode: "en-us",
  locale: "en-us",
  take: 10,
  skip: 0,
  contentLinkDepth: 2
})
```

### 4. Using Agility Context
```typescript
import { getAgilityContext } from "@/lib/cms/useAgilityContext"

const { locale, isPreview, sitemap } = await getAgilityContext()
```

### 5. Page Data Fetching & Rendering
```typescript
import { getAgilityPage } from "@/lib/cms/getAgilityPage"
import { getPageTemplate } from "components/agility-pages"
import { notFound } from "next/navigation"

export default async function Page({ params }: PageProps) {
  const agilityData = await getAgilityPage({ params })
  if (!agilityData.page) notFound()
  
  const AgilityPageTemplate = getPageTemplate(agilityData.pageTemplateName || "")
  
  return (
    <div data-agility-page={agilityData.page?.pageID} data-agility-dynamic-content={agilityData.sitemapNode.contentID}>
      {AgilityPageTemplate ? (
        <AgilityPageTemplate {...agilityData} />
      ) : (
        <InlineError message={`No template found for page template name: ${agilityData.pageTemplateName}`} />
      )}
    </div>
  )
}
```

### 6. Server Actions
```typescript
// Example server action for preview mode
async function startPreviewMode(pathname: string) {
  "use server"
  
  // Enable draft/preview mode
  (await draftMode()).enable()
  
  // Redirect to the same page with preview parameter
  let url = `${pathname}`
  if (url.includes("?")) {
    url = `${url}&preview=1`
  } else {
    url = `${url}?preview=1`
  }
  
  redirect(url)
}
```

### 7. Root Page Export Pattern
```typescript
// app/page.tsx - Re-export from [...slug]/page.tsx
export { generateMetadata } from "./[...slug]/page"
export { default } from "./[...slug]/page"

export const revalidate = 60
export const runtime = "nodejs"  
export const dynamic = "force-static"
```

## Component Development Rules

### 1. Agility Components Structure
```typescript
// For server components that fetch data
import { UnloadedModuleProps } from "@agility/nextjs"
import { getContentItem } from "@/lib/cms/getContentItem"

interface IMyContent {
  title: string
  description: string
}

const MyComponent = async ({ module, languageCode, contentID }: UnloadedModuleProps) => {
  const content = await getContentItem<IMyContent>({
    contentID,
    languageCode,
    locale: languageCode
  })
  
  return (
    <div data-agility-component="MyComponent">
      <h1>{content.fields.title}</h1>
      <p>{content.fields.description}</p>
    </div>
  )
}
```

### 2. Component Registration
- Add new components to `components/agility-components/index.ts`
- Use PascalCase for component names
- Export as default from individual files

### 3. Data Attributes
- **ALWAYS** add `data-agility-component={contentID}` to component root elements
- Add `data-agility-field="fieldName"` for individual fields to enable visual editing
- Use `data-agility-page={pageID}` for page containers
- Use `data-agility-dynamic-content={contentID}` for dynamic content
- Use `data-agility-guid={process.env.AGILITY_GUID}` on body element
- Required for Agility Web Studio SDK integration

## Environment Variables

### Required Environment Variables
```bash
# CMS Configuration
AGILITY_GUID=your-guid-here
AGILITY_API_FETCH_KEY=your-fetch-key-here
AGILITY_API_PREVIEW_KEY=your-preview-key-here
AGILITY_SECURITY_KEY=your-security-key-here

# Optional Configuration
AGILITY_LOCALES=en-us
AGILITY_SITEMAP=website
```

### Usage in Code
```typescript
// In getAgilitySDK.ts pattern
const apiKey = isPreview 
  ? process.env.AGILITY_API_PREVIEW_KEY 
  : process.env.AGILITY_API_FETCH_KEY
```

## Caching Implementation

### 1. Content Item Caching
```typescript
agilitySDK.config.fetchConfig = {
  next: {
    tags: [`agility-content-${contentID}-${languageCode || locale}`],
    revalidate: 60,
  },
}
```

### 2. Content List Caching
```typescript
agilitySDK.config.fetchConfig = {
  next: {
    tags: [`agility-content-${referenceName}-${languageCode || locale}`],
    revalidate: 60,
  },
}
```

### 3. Sitemap Caching
```typescript
agilitySDK.config.fetchConfig = {
  next: {
    tags: [`agility-sitemap-flat-${languageCode || locale}`], // or agility-sitemap-nested-
    revalidate: 60,
  },
}
```

### 4. Cache Invalidation Tags
```typescript
// Content item changes
const itemTag = `agility-content-${referenceName}-${languageCode}`
const listTag = `agility-content-${contentID}-${languageCode}`

// Page changes
const pageTag = `agility-page-${pageID}-${languageCode}`

// Sitemap changes
const sitemapTagFlat = `agility-sitemap-flat-${languageCode}`
const sitemapTagNested = `agility-sitemap-nested-${languageCode}`
```

## Error Handling

### 1. Graceful Degradation
```typescript
try {
  const content = await getContentItem({ contentID, languageCode, locale })
  return content
} catch (error) {
  console.error("Could not load content item:", error)
  return null
}
```

### 2. Fallback Content
- **ALWAYS** provide fallback content for missing items
- Use `NoComponentFound` component for missing Agility components
- Return `null` or default values rather than throwing errors

## TypeScript Best Practices

### 1. Content Type Definitions
```typescript
export interface IMyContentType {
  title: string
  description: string
  image: ImageField
  category: ContentItem<ICategory>
  tags: ContentItem<ITag>[]
}
```

### 2. Generic Usage
```typescript
const content = await getContentItem<IMyContentType>({
  contentID,
  languageCode,
  locale
})
```

### 3. Import Agility Types
```typescript
import { ContentItem, ImageField } from "@agility/nextjs"
import { ContentListRequestParams } from "@agility/content-fetch/dist/methods/getContentList"
```

## URL Resolution

### 1. Dynamic Page URLs
```typescript
const resolvePostUrls = (sitemap: any, posts: any) => {
  let dynamicUrls: any = {}
  posts.forEach((post: any) => {
    Object.keys(sitemap).forEach((path) => {
      if (sitemap[path].contentID === post.contentID) {
        dynamicUrls[post.contentID] = path
      }
    })
  })
  return dynamicUrls
}
```

### 2. Navigation Links
```typescript
const links = sitemapNodes
  .filter((node: any) => node.visible.menu)
  .map((node: any) => ({
    title: node.menuText || node.title,
    path: node.path === "/home" ? "/" : node.path,
  }))
```

## Metadata Handling

### 1. Page Metadata
```typescript
import { Metadata, ResolvingMetadata } from "next"
import { resolveAgilityMetaData } from "@/lib/cms-content/resolveAgilityMetaData"

export async function generateMetadata(
  props: PageProps,
  parent: ResolvingMetadata
): Promise<Metadata> {
  const { params } = props; // Do NOT await params here
  const { locale, sitemap, isDevelopmentMode, isPreview } = await getAgilityContext()
  const agilityData = await getAgilityPage({ params })
  
  if (!agilityData.page) return {}
  
  return resolveAgilityMetaData({
    agilityData,
    locale,
    sitemap,
    isDevelopmentMode,
    isPreview,
    parent,
  })
}
```

### 2. OpenGraph Images
```typescript
// Handled automatically in resolveAgilityMetaData
// Will extract images from content items and add to OpenGraph
```

## API Routes

### 1. Revalidation Endpoint
```typescript
import { revalidateTag } from "next/cache"

export async function POST(request: Request) {
  const { tags } = await request.json()
  
  tags.forEach((tag: string) => {
    revalidateTag(tag)
  })
  
  return NextResponse.json({ revalidated: true })
}
```

### 2. Preview Mode
```typescript
import { draftMode } from "next/headers"
import { NextResponse } from "next/server"
import { validatePreview, getDynamicPageURL } from "@agility/nextjs/node"

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const agilityPreviewKey = searchParams.get("agilitypreviewkey") || ""
  const slug = searchParams.get("slug") || "/"
  const ContentID = searchParams.get('ContentID')

  // Validate preview key
  const validationResp = await validatePreview({ agilityPreviewKey, slug })
  if (validationResp.error) {
    return NextResponse.json({ message: validationResp.message }, { status: 401 })
  }

  let previewUrl = slug
  
  // Handle dynamic pages
  if (ContentID) {
    const dynamicPath = await getDynamicPageURL({ 
      contentID: Number(ContentID), 
      preview: true, 
      slug: slug || undefined 
    })
    if (dynamicPath) {
      previewUrl = dynamicPath
    }
  }

  // Enable draft/preview mode
  (await draftMode()).enable()

  // Redirect with preview parameter
  const baseUrl = `${request.nextUrl.protocol}//${request.nextUrl.host}`
  let url = `${baseUrl}${previewUrl}`
  if (url.includes("?")) {
    url = `${url}&preview=1`
  } else {
    url = `${url}?preview=1`
  }

  return NextResponse.redirect(url, 307)
}
```

### 3. Dynamic Redirect API
```typescript
import { getDynamicPageURL } from "@agility/nextjs/node"
import { NextRequest, NextResponse } from "next/server"
import { draftMode } from "next/headers"

export async function GET(req: NextRequest) {
  const searchParams = req.nextUrl.searchParams
  const contentIDStr = searchParams.get("ContentID") as string
  const contentID = parseInt(contentIDStr)
  const { isEnabled: preview } = await draftMode()
  
  if (!isNaN(contentID) && contentID > 0) {
    const redirectUrl = await getDynamicPageURL({ contentID, preview, slug: "" })
    if (redirectUrl) {
      return NextResponse.redirect(redirectUrl, { status: 307, headers: { "Location": redirectUrl } })
    }
  }

  return NextResponse.json({ message: "Not Found" }, { status: 404 })
}
```

## Performance Optimization

### 1. Content Link Depth
- Use `contentLinkDepth: 0` for pages (default)
- Use `contentLinkDepth: 2` for content with nested relationships
- **AVOID** deep linking unless necessary

### 2. Selective Data Fetching
```typescript
// Only fetch what you need
const posts = await getContentList({
  referenceName: "posts",
  languageCode: "en-us",
  locale: "en-us",
  take: 10, // Limit results
  skip: 0   // For pagination
})
```

## Agility Web Studio SDK

### Script Integration
```typescript
// Add to app/layout.tsx
import Script from "next/script"

export default async function RootLayout({ children }) {
  return (
    <html lang="en">
      <body data-agility-guid={process.env.AGILITY_GUID}>
        {children}
      </body>
      <Script src="https://unpkg.com/@agility/web-studio-sdk@latest/dist/index.js" />
    </html>
  )
}
```

### Visual Editing Support
- The SDK enables visual editing in Agility CMS
- `data-agility-component` attributes identify components
- `data-agility-field` attributes enable field-level editing
- `data-agility-guid` on body enables SDK initialization

## Development Workflow

### 1. Adding New Content Types
1. **First**: Check existing types in `/lib/types/` for similar patterns
2. **Define interface** in `/lib/types/` with `I` prefix (one per file)
3. **Check existing functions** in `/lib/cms-content/` before creating new ones
4. **Create business logic function** in `/lib/cms-content/` if needed (reuse existing patterns)
5. **Check existing components** in `/components/agility-components/` for similar functionality
6. **Create component** in `/components/agility-components/` (reuse existing data fetching patterns)
7. **Add data attributes** (`data-agility-component`, `data-agility-field`)
8. **Register component** in `components/agility-components/index.ts`

### 2. Testing Components
- Use preview mode for testing (`?preview=1`)
- Verify caching behavior with cache tags
- Test error states and fallbacks
- Test visual editing with Agility Web Studio SDK

### 3. Debugging
- Use `data-agility-*` attributes for component identification
- Check Next.js cache tags in DevTools Network tab
- Monitor API calls in development mode
- Use browser dev tools to inspect Agility SDK integration

## Common Patterns

### 1. Conditional Rendering
```typescript
{content && content.fields.title && (
  <h1>{content.fields.title}</h1>
)}
```

### 2. Image Handling
```typescript
{content.fields.image && (
  <img 
    src={content.fields.image.url} 
    alt={content.fields.image.label || content.fields.title}
  />
)}
```

### 3. Rich Text Areas
```typescript
import { renderHTML } from "@agility/nextjs"

<div dangerouslySetInnerHTML={renderHTML(content.fields.textContent)} />
```

## Do's and Don'ts

### ✅ Do's
- Use server components for CMS data fetching
- Implement proper TypeScript interfaces
- Use the provided caching mechanisms
- Handle errors gracefully
- Use environment variables for configuration
- Add data attributes for debugging

### ❌ Don'ts
- Don't fetch CMS data in client components
- Don't bypass caching without good reason
- Don't hard-code API keys or GUIDs
- Don't ignore error states
- Don't use deep content linking unnecessarily
- Don't forget to handle missing content

## Troubleshooting

### Common Issues
1. **Missing content**: Check contentID and languageCode
2. **Caching issues**: Verify cache tags and revalidation
3. **Preview not working**: Check draftMode() implementation
4. **Type errors**: Ensure proper TypeScript interfaces

### Debug Steps
1. Check environment variables
2. Verify API key permissions
3. Test in development mode
4. Check Next.js cache behavior
5. Validate content structure in Agility CMS 