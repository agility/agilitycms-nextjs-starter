# Architecture Guide

This document provides a deep dive into the architecture and design patterns of the Agility CMS Next.js Starter.

## Table of Contents

- [Overview](#overview)
- [Routing Architecture](#routing-architecture)
- [Component System](#component-system)
- [Data Fetching Layer](#data-fetching-layer)
- [Caching Strategy](#caching-strategy)
- [Middleware & Preview Mode](#middleware--preview-mode)
- [TypeScript Integration](#typescript-integration)
- [Build & Deployment](#build--deployment)

## Overview

This starter is built on modern React and Next.js patterns, emphasizing:

- **Server-First Rendering** - Default to React Server Components
- **Type Safety** - TypeScript throughout with strict mode
- **Performance** - Multi-layer caching with on-demand invalidation
- **Developer Experience** - Clear separation of concerns and modular design

### Technology Stack

```
Next.js 15.2.3 (App Router)
├── React 18.3.1 (Server Components)
├── TypeScript 4.9.3
├── Tailwind CSS 4.1.10
├── @agility/content-fetch 2.0.0
└── @agility/nextjs 15.0.3
```

## Routing Architecture

### Catch-All Dynamic Route

The entire site uses a single catch-all route: `app/[...slug]/page.tsx`

**Why this approach?**
- Agility CMS manages the sitemap structure
- Pages are created dynamically in the CMS
- Single route handles all content pages
- Reduces code duplication
- Simplifies page template management

### How It Works

```typescript
// app/[...slug]/page.tsx

// 1. Generate static paths at build time
export async function generateStaticParams() {
  const sitemap = await getSitemapFlat({ languageCode: "en-us" });

  return sitemap.map((node) => ({
    slug: node.pagePath.split("/").filter(Boolean),
  }));
}

// 2. Generate metadata for SEO
export async function generateMetadata({ params }) {
  const page = await getAgilityPage({
    slug: params.slug.join("/")
  });

  return {
    title: page.title,
    description: page.seo.metaDescription,
    // ... Open Graph, Twitter Card, etc.
  };
}

// 3. Render the page
export default async function Page({ params }) {
  const page = await getAgilityPage({
    slug: params.slug.join("/")
  });

  const AgilityPageTemplate = allPageTemplates[page.templateName];

  return <AgilityPageTemplate page={page} />;
}
```

### Static Site Generation (SSG)

Pages are pre-rendered at build time for optimal performance:

```typescript
export const dynamic = "force-static";  // Force SSG
export const revalidate = 60;           // ISR: Revalidate every 60s
```

**Build Process:**
1. `generateStaticParams()` fetches sitemap from Agility CMS
2. Next.js generates an HTML file for each path
3. HTML is served directly from CDN (Vercel/Netlify)
4. Revalidation happens automatically per `revalidate` setting

### Incremental Static Regeneration (ISR)

ISR allows pages to update without full rebuilds:

```typescript
export const revalidate = Number(
  process.env.AGILITY_PATH_REVALIDATE_DURATION || 60
);
```

**How ISR Works:**
1. First request serves static HTML (fast)
2. After `revalidate` seconds, next request triggers rebuild
3. User still gets old HTML (fast response)
4. Background regeneration happens
5. Subsequent requests get updated HTML

**Combined with On-Demand Revalidation:**
- ISR provides baseline freshness
- Webhooks trigger immediate updates
- Best of both worlds: speed + freshness

## Component System

### Component Registry Pattern

CMS modules are mapped to React components via registration:

```typescript
// components/agility-components/index.ts
import { Module } from "@agility/nextjs";

const allModules: Module[] = [
  { name: "TextBlockWithImage", module: TextBlockWithImage },
  { name: "Heading", module: Heading },
  { name: "FeaturedPost", module: FeaturedPost },
  // ... etc
];

export const getModule = (moduleName: string) => {
  return allModules.find((m) => m.name === moduleName)?.module;
};
```

**Benefits:**
- Single source of truth for CMS/React mapping
- Type-safe module resolution
- Easy to add new components
- Automatic fallback to "NoComponentFound"

### Page Template System

Similar registry for page templates:

```typescript
// components/agility-pages/index.ts
const allPageTemplates: PageTemplate = {
  MainTemplate,
  // ... other templates
};

export const getPageTemplate = (templateName: string) => {
  return allPageTemplates[templateName] || MainTemplate;
};
```

**Usage in page rendering:**
```typescript
const AgilityPageTemplate = getPageTemplate(page.templateName);
return <AgilityPageTemplate page={page} />;
```

### Content Zones

Page templates render content zones dynamically:

```typescript
// components/agility-pages/MainTemplate.tsx
import { ContentZone } from "@agility/nextjs";

export default function MainTemplate({ page }) {
  return (
    <div>
      <ContentZone
        name="MainContent"
        page={page}
        getModule={getModule}
      />
    </div>
  );
}
```

**ContentZone Component:**
- Provided by `@agility/nextjs`
- Loops through modules in zone
- Dynamically renders each component
- Passes props: `module`, `page`, `index`

### Server vs. Client Components

**Server Components (Default):**
```typescript
// components/agility-components/PostDetails.tsx
export default async function PostDetails({ module, page }) {
  // Can fetch data directly
  const post = await getContentItem({ contentID: page.contentID });

  return <article>...</article>;
}
```

**Client Components (When Needed):**
```typescript
// components/agility-components/PostsListing/PostsListing.client.tsx
"use client";

import { useEffect, useState } from "react";

export default function PostsListingClient({ initialPosts }) {
  const [posts, setPosts] = useState(initialPosts);

  // Client-side interactivity
  return <div>...</div>;
}
```

**When to Use Client Components:**
- User interactivity (onClick, onChange, etc.)
- React hooks (useState, useEffect, etc.)
- Browser APIs (localStorage, window, etc.)
- Real-time updates

**Best Practice:**
- Keep client components small and focused
- Fetch data in Server Component, pass to Client Component
- Use "use server" for Server Actions when needed

## Data Fetching Layer

### Three-Tier Architecture

```
┌─────────────────────────────────────────┐
│     Domain Layer (lib/cms-content)      │  Business Logic
│  getPostListing(), getHeaderContent()   │  ← Application-specific
└────────────────┬────────────────────────┘
                 │
┌────────────────▼────────────────────────┐
│      CMS Layer (lib/cms)                │  Generic CMS Operations
│  getContentItem(), getContentList()     │  ← Reusable utilities
└────────────────┬────────────────────────┘
                 │
┌────────────────▼────────────────────────┐
│     Agility SDK (@agility/content-fetch)│  HTTP/REST API
│  api.getContentItem(), api.getList()    │  ← SDK handles API calls
└─────────────────────────────────────────┘
```

### CMS Layer (`lib/cms/`)

Generic, reusable utilities for Agility CMS:

#### `getAgilityContext.ts`
Determines preview vs. live mode:

```typescript
export async function getAgilityContext(): Promise<AgilityContext> {
  const { isEnabled: isPreview } = draftMode();
  const locale = process.env.AGILITY_LOCALES?.split(",")[0] || "en-us";
  const sitemap = process.env.AGILITY_SITEMAP || "website";

  return {
    isPreview,
    locale,
    sitemap,
    isDevelopment: process.env.NODE_ENV === "development",
  };
}
```

#### `getAgilitySDK.ts`
Initializes SDK with appropriate keys:

```typescript
export function getAgilitySDK({ isPreview }: { isPreview: boolean }) {
  const apiKey = isPreview
    ? process.env.AGILITY_API_PREVIEW_KEY
    : process.env.AGILITY_API_FETCH_KEY;

  return agilitySDK({
    guid: process.env.AGILITY_GUID,
    apiKey,
    isPreview,
  });
}
```

#### `getContentItem.ts`
Fetches single content item with caching:

```typescript
export async function getContentItem<T = any>({
  contentID,
  languageCode,
}: GetContentItemProps): Promise<T> {
  const { isPreview } = await getAgilityContext();
  const api = getAgilitySDK({ isPreview });

  const item = await api.getContentItem({
    contentID,
    languageCode,
    // Cache configuration
    revalidateInSeconds: Number(process.env.AGILITY_FETCH_CACHE_DURATION || 60),
    // Cache tags for on-demand revalidation
    cacheTags: [`agility-content-${contentID}-${languageCode}`],
  });

  return item.fields as T;
}
```

#### `getContentList.ts`
Fetches content lists with pagination:

```typescript
export async function getContentList<T = any>({
  referenceName,
  languageCode,
  take = 50,
  skip = 0,
  sort,
  direction = "asc",
  filter,
}: GetContentListProps): Promise<T[]> {
  const { isPreview } = await getAgilityContext();
  const api = getAgilitySDK({ isPreview });

  const list = await api.getContentList({
    referenceName,
    languageCode,
    take,
    skip,
    sort,
    direction,
    filters: filter ? [filter] : undefined,
    revalidateInSeconds: Number(process.env.AGILITY_FETCH_CACHE_DURATION || 60),
    cacheTags: [`agility-content-${referenceName}-${languageCode}`],
  });

  return list.items.map((item) => item.fields as T);
}
```

#### `getAgilityPage.ts`
Fetches complete page with layout:

```typescript
export async function getAgilityPage({
  slug,
  locale,
  sitemap,
}: GetAgilityPageProps): Promise<AgilityPage> {
  const { isPreview } = await getAgilityContext();
  const api = getAgilitySDK({ isPreview });

  const page = await api.getPage({
    pagePath: slug,
    locale,
    sitemap,
    revalidateInSeconds: Number(process.env.AGILITY_PATH_REVALIDATE_DURATION || 60),
  });

  return page;
}
```

### Domain Layer (`lib/cms-content/`)

Application-specific data fetching:

#### `getPostListing.ts`
Fetches blog posts with URLs and filtering:

```typescript
export async function getPostListing({
  take = 10,
  skip = 0,
  category,
}: GetPostListingProps): Promise<PostListingResult> {
  const languageCode = "en-us";

  // Fetch posts with optional category filter
  const posts = await getContentList<IPost>({
    referenceName: "posts",
    languageCode,
    take,
    skip,
    sort: "fields.date",
    direction: "desc",
    filter: category ? `fields.category[eq]${category}` : undefined,
  });

  // Get sitemap to resolve URLs
  const sitemap = await getSitemapFlat({ languageCode });
  const postsNode = sitemap.find((node) =>
    node.contentID && node.isFolder === false
  );

  // Attach URLs to posts
  const postsWithUrls = posts.map((post) => ({
    ...post,
    url: `${postsNode?.path}/${post.slug}`,
  }));

  return {
    posts: postsWithUrls,
    hasMore: posts.length === take,
  };
}
```

#### `getHeaderContent.ts`
Fetches navigation with nested structure:

```typescript
export async function getHeaderContent(): Promise<HeaderContent> {
  const languageCode = "en-us";

  // Fetch header config
  const [header] = await getContentList<IHeader>({
    referenceName: "header",
    languageCode,
    take: 1,
  });

  // Fetch navigation items
  const navItems = await getContentList<INavLink>({
    referenceName: header.navigationReferenceName,
    languageCode,
  });

  // Get sitemap for URL resolution
  const sitemap = await getSitemapNested({ languageCode });

  // Build navigation tree
  const navigation = buildNavigationTree(navItems, sitemap);

  return {
    logo: header.logo,
    navigation,
    cta: header.cta,
  };
}
```

## Caching Strategy

### Multi-Layer Cache Architecture

```
┌──────────────────────────────────────────────────────┐
│                 Browser Cache                        │  Client-side
│           (Automatic via HTTP headers)               │
└───────────────────┬──────────────────────────────────┘
                    │
┌───────────────────▼──────────────────────────────────┐
│              Vercel CDN / Edge Cache                 │  Edge
│              (Static HTML + ISR)                     │
└───────────────────┬──────────────────────────────────┘
                    │
┌───────────────────▼──────────────────────────────────┐
│          Next.js Full Route Cache                    │  Server
│      (Static pages + revalidate configs)             │
└───────────────────┬──────────────────────────────────┘
                    │
┌───────────────────▼──────────────────────────────────┐
│          Agility SDK Object Cache                    │  SDK
│        (Content items cached in memory)              │
└───────────────────┬──────────────────────────────────┘
                    │
┌───────────────────▼──────────────────────────────────┐
│            Agility CMS API / CDN                     │  External
│                                                       │
└──────────────────────────────────────────────────────┘
```

### Cache Tags System

Content fetches are tagged for granular invalidation:

```typescript
// Fetching with tags
const post = await api.getContentItem({
  contentID: 123,
  languageCode: "en-us",
  cacheTags: [
    `agility-content-123-en-us`,        // Specific item
    `agility-content-posts-en-us`,      // All posts
    `agility-sitemap-en-us`,            // Sitemap
  ],
});
```

**Tag Naming Convention:**
- `agility-content-{contentID}-{locale}` - Specific content item
- `agility-content-{referenceName}-{locale}` - Content list
- `agility-sitemap-{locale}` - Entire sitemap

### On-Demand Revalidation

Webhook endpoint at `app/api/revalidate/route.ts`:

```typescript
export async function POST(request: Request) {
  const secret = request.headers.get("x-agility-webhook-secret");

  // Validate webhook
  if (secret !== process.env.AGILITY_SECURITY_KEY) {
    return new Response("Unauthorized", { status: 401 });
  }

  const body = await request.json();
  const { contentID, referenceName, languageCode } = body;

  // Revalidate by tag
  if (contentID) {
    revalidateTag(`agility-content-${contentID}-${languageCode}`);
  }

  if (referenceName) {
    revalidateTag(`agility-content-${referenceName}-${languageCode}`);
  }

  // Revalidate sitemap if page structure changed
  if (body.type === "page") {
    revalidateTag(`agility-sitemap-${languageCode}`);
  }

  return Response.json({ revalidated: true });
}
```

**Setup in Agility CMS:**
1. Go to **Settings > Webhooks**
2. Add webhook: `https://yoursite.com/api/revalidate`
3. Events: "Content Published", "Content Deleted"
4. Add custom header: `x-agility-webhook-secret: YOUR_SECURITY_KEY`

### Cache Configuration

Environment variables control cache behavior:

```env
# SDK caches content objects for this many seconds
AGILITY_FETCH_CACHE_DURATION=120

# Next.js revalidates paths after this many seconds
AGILITY_PATH_REVALIDATE_DURATION=60
```

**Recommended Settings:**

| Environment | SDK Cache | Path Revalidate | Use Case |
|-------------|-----------|-----------------|----------|
| **Production** | 300-600 | 60-300 | With webhooks |
| **Staging** | 60-120 | 30-60 | Testing |
| **Preview** | 0 | 0 | Real-time editing |
| **Development** | 10-30 | 10 | Fast iteration |

## Middleware & Preview Mode

### Middleware (`middleware.ts`)

Handles preview mode activation and routing:

```typescript
import { NextRequest, NextResponse } from "next/server";

export function middleware(request: NextRequest) {
  const { pathname, searchParams } = request.nextUrl;

  // Preview mode activation
  if (searchParams.has("agilitypreviewkey")) {
    // Rewrite to preview API for validation
    const url = new URL("/api/preview", request.url);
    url.search = searchParams.toString();

    return NextResponse.rewrite(url);
  }

  // Dynamic page redirects (ContentID → URL)
  if (pathname.startsWith("/api/dynamic-redirect")) {
    // Let API route handle it
    return NextResponse.next();
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization)
     * - favicon.ico (favicon file)
     */
    "/((?!_next/static|_next/image|favicon.ico).*)",
  ],
};
```

### Preview Mode Flow

```
┌─────────────────────────────────────────────────────┐
│  User clicks "Preview" in Agility CMS              │
└────────────────┬────────────────────────────────────┘
                 │
┌────────────────▼────────────────────────────────────┐
│  Request: /page?agilitypreviewkey=XXX&ContentID=123│
└────────────────┬────────────────────────────────────┘
                 │
┌────────────────▼────────────────────────────────────┐
│  Middleware intercepts request                     │
│  Rewrites to /api/preview                          │
└────────────────┬────────────────────────────────────┘
                 │
┌────────────────▼────────────────────────────────────┐
│  Preview API validates security key                │
│  Resolves ContentID → Page URL                     │
└────────────────┬────────────────────────────────────┘
                 │
┌────────────────▼────────────────────────────────────┐
│  draftMode().enable()                              │
│  Sets draft mode cookie                            │
└────────────────┬────────────────────────────────────┘
                 │
┌────────────────▼────────────────────────────────────┐
│  Redirect to actual page URL                       │
└────────────────┬────────────────────────────────────┘
                 │
┌────────────────▼────────────────────────────────────┐
│  Page renders with draft content                   │
│  PreviewBar shows "Exit Preview" button            │
└─────────────────────────────────────────────────────┘
```

## TypeScript Integration

### Type Safety Layers

1. **Content Model Types** (`lib/types/`)
2. **CMS Utility Types** (function parameters/returns)
3. **Component Props** (React component interfaces)
4. **API Route Types** (request/response)

### Content Model Interfaces

```typescript
// lib/types/IPost.ts
export interface IPost {
  contentID: number;
  title: string;
  slug: string;
  date: string;
  image?: {
    url: string;
    label: string;
  };
  category: string;
  categoryID: number;
  categoryName: string;
  tags: string;
  tagIDs: string;
  tagNames: string;
  author: string;
  authorID: number;
  authorName: string;
  excerpt: string;
  content: string;
}
```

**Usage:**
```typescript
const post = await getContentItem<IPost>({ contentID: 123 });
// post.title is typed as string
// post.image is typed as { url: string; label: string } | undefined
```

### Generic Utilities

CMS utilities use TypeScript generics:

```typescript
export async function getContentItem<T = any>(
  props: GetContentItemProps
): Promise<T> {
  // ... implementation
  return item.fields as T;
}

// Usage with type inference
const post = await getContentItem<IPost>({ contentID: 123 });
const author = await getContentItem<IAuthor>({ contentID: 456 });
```

### Component Props

```typescript
// Component prop interfaces
interface ModuleProps {
  module: {
    contentID: number;
    fields: any;
  };
  page: AgilityPage;
}

export default async function MyComponent({
  module,
  page
}: ModuleProps) {
  // Typed props
}
```

## Build & Deployment

### Build Process

```bash
npm run build
```

**What happens:**
1. TypeScript compilation (`tsc`)
2. Next.js build
   - Static page generation via `generateStaticParams()`
   - Route optimization
   - Image optimization
   - Bundle splitting
3. Output to `.next/` directory

### Build Output

```
.next/
├── static/              # Static assets (JS, CSS, images)
├── server/              # Server-side code
│   ├── app/            # App Router pages
│   └── chunks/         # Code splitting chunks
└── cache/              # Build cache
```

### Environment-Specific Builds

**Development:**
```bash
npm run dev
# - No static generation
# - Hot module replacement
# - Source maps enabled
# - Preview API key used
```

**Production:**
```bash
npm run build && npm run start
# - Full static generation
# - Minified bundles
# - Source maps disabled
# - Live API key used
```

### Deployment Checklist

- [ ] Set all environment variables
- [ ] Configure webhooks in Agility CMS
- [ ] Test preview mode works
- [ ] Verify on-demand revalidation
- [ ] Check image optimization
- [ ] Test 404 pages
- [ ] Verify SEO metadata
- [ ] Test dark mode toggle
- [ ] Check mobile responsiveness

---

This architecture provides a solid foundation for building scalable, performant content-managed sites with Agility CMS and Next.js. The patterns used here can be extended and customized to meet your specific project needs.
