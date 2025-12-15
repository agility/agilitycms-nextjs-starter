# Agility CMS Integration Guide

Complete guide to working with Agility CMS in this Next.js starter, including patterns, best practices, and advanced techniques.

## Table of Contents

- [Understanding Agility CMS](#understanding-agility-cms)
- [Content Models vs Components](#content-models-vs-components)
- [Fetching Content](#fetching-content)
- [Working with Pages](#working-with-pages)
- [Working with Modules](#working-with-modules)
- [Advanced Patterns](#advanced-patterns)
- [Best Practices](#best-practices)

## Understanding Agility CMS

### Core Concepts

**Content Items**
- Individual pieces of content (e.g., a blog post, an author profile)
- Stored in **Containers** (Content Lists or Single Items)
- Defined by **Content Models** (schema/structure)

**Pages**
- Represent URLs in your site structure
- Can be static pages or dynamic (generated from content)
- Organized in a **Sitemap** (hierarchy)
- Use **Page Templates** to define layout

**Modules (Components)**
- Reusable content blocks placed on pages
- Defined by **Component Models** (schema)
- Rendered in **Content Zones** on page templates
- Map to React components in your code

**Sitemap**
- Hierarchical structure of your site
- Defines URLs and navigation
- Can have multiple channels (e.g., website, mobile app)

### Agility Instance Structure

This starter connects to an Agility instance with:

**Content Models (24):**
- Post, Author, Category, Tag (blog content)
- Header, Footer, Global Settings (site-wide)
- Testimonial Item, FAQ Item, Pricing Tier (marketing)
- Audience, Region, Customer Profile (personalization)
- And more...

**Component Models (20):**
- Hero, Background Hero, A/B Test Hero
- Post Listing, Post Details, Featured Post
- Bento Section, Logo Strip, Carousel
- Testimonials, Pricing Cards, FAQ
- Contact Us, Team Listing
- And more...

**Containers (13):**
- Posts, Authors, Categories, Tags
- Header, Footer, Settings
- Testimonials, Audiences, Regions
- And more...

**Sitemap:**
- Home
- About Us
- Blog → Post Details (dynamic pages)
- Pricing
- Features
- Contact Us

See [CONTENT-MODELS.md](./CONTENT-MODELS.md) for complete schemas.

## Content Models vs Components

Understanding the difference is crucial:

### Content Models

**Purpose:** Define the structure of content items that live in the CMS

**Example:** "Post" Content Model
```typescript
interface IPost {
  title: string;           // Text field
  slug: string;            // Text field
  date: string;            // Date field
  image: {                 // Image field
    url: string;
    label: string;
  };
  category: string;        // Linked content (dropdown)
  categoryID: number;      // Auto-populated
  categoryName: string;    // Auto-populated
  content: string;         // HTML field
}
```

**Where they're used:**
- Data storage in Agility CMS
- Content entry forms for editors
- Data returned by API calls

### Component Models (Modules)

**Purpose:** Define content blocks that can be placed on pages

**Example:** "PostListing" Component
```typescript
interface PostListingModule {
  heading: string;              // Text field
  subheading: string;           // Text field
  postsPerPage: number;         // Integer field
  showFeaturedPost: boolean;    // Boolean field
  categoryFilter: string;       // Linked content (dropdown)
}
```

**Where they're used:**
- Content zones on pages
- Page builder in Agility CMS
- Dynamic rendering in React components

**Key Difference:**
- Content Models = **Data**
- Component Models = **Presentation**

A "PostListing" component might fetch and display multiple "Post" content items.

## Fetching Content

### Content Items (Single)

Fetch a single content item by ID:

```typescript
import { getContentItem } from "@/lib/cms/getContentItem";
import { IPost } from "@/lib/types/IPost";

const post = await getContentItem<IPost>({
  contentID: 123,
  languageCode: "en-us",
});

console.log(post.title);
console.log(post.content);
```

**When to use:**
- Fetching a specific post for a detail page
- Getting site settings or configuration
- Resolving linked content references

### Content Lists

Fetch multiple content items from a container:

```typescript
import { getContentList } from "@/lib/cms/getContentList";
import { IPost } from "@/lib/types/IPost";

const posts = await getContentList<IPost>({
  referenceName: "posts",      // Container reference name
  languageCode: "en-us",
  take: 10,                    // Number of items
  skip: 0,                     // Offset for pagination
  sort: "fields.date",         // Sort field
  direction: "desc",           // Sort direction
});

posts.forEach((post) => {
  console.log(post.title);
});
```

**Filtering:**
```typescript
const posts = await getContentList<IPost>({
  referenceName: "posts",
  languageCode: "en-us",
  take: 10,
  filter: "fields.category[eq]Technology",  // Filter by category
});
```

**Filter Operators:**
- `[eq]` - Equals
- `[ne]` - Not equals
- `[gt]` - Greater than
- `[lt]` - Less than
- `[contains]` - Contains text
- `[startswith]` - Starts with

**When to use:**
- Blog post listings
- Navigation menus
- Testimonials, team members, etc.
- Any collection of content

### Pages

Fetch a complete page with layout and modules:

```typescript
import { getAgilityPage } from "@/lib/cms/getAgilityPage";

const page = await getAgilityPage({
  slug: "/blog",
  locale: "en-us",
  sitemap: "website",
});

console.log(page.title);
console.log(page.templateName);   // "MainTemplate"
console.log(page.zones);          // { MainContent: [...] }
```

**Page Structure:**
```typescript
interface AgilityPage {
  pageID: number;
  title: string;
  name: string;                 // URL slug
  path: string;                 // Full path
  templateName: string;         // "MainTemplate"
  zones: {
    [zoneName: string]: Array<{
      module: string;           // Component name
      item: {
        contentID: number;
        fields: any;
      };
    }>;
  };
  seo: {
    metaDescription: string;
    metaKeywords: string;
    metaHTML: string;
  };
  scripts: {
    top: string;
    bottom: string;
  };
}
```

**When to use:**
- Rendering pages dynamically
- Getting page metadata for SEO
- Accessing page modules/components

### Sitemap

Fetch the site structure:

```typescript
import { getSitemapFlat } from "@/lib/cms/getSitemapFlat";

const sitemap = await getSitemapFlat({
  languageCode: "en-us",
});

sitemap.forEach((node) => {
  console.log(node.path);       // "/blog"
  console.log(node.pageID);     // 5
  console.log(node.title);      // "Blog"
});
```

**Nested Sitemap:**
```typescript
import { getSitemapNested } from "@/lib/cms/getSitemapNested";

const sitemap = await getSitemapNested({
  languageCode: "en-us",
});

// Tree structure with children
sitemap.forEach((node) => {
  console.log(node.path);
  node.children?.forEach((child) => {
    console.log(`  ${child.path}`);
  });
});
```

**When to use:**
- Navigation menus
- Breadcrumbs
- Generating static paths
- URL resolution

## Working with Pages

### Creating a Page in Agility CMS

1. **Go to Pages** in Agility CMS
2. **Click "+ New"** to add a page
3. **Choose a parent page** (or select root for top-level)
4. **Fill in details:**
   - Name (URL slug)
   - Title (page title)
   - Menu Text (navigation label)
   - Page Template (e.g., "Main Template")
5. **Add modules to content zones**
6. **Save and publish**

### Rendering Pages in Next.js

Pages are automatically rendered via the catch-all route:

```typescript
// app/[...slug]/page.tsx
export default async function Page({ params }) {
  const slug = params.slug.join("/");

  const page = await getAgilityPage({
    slug,
    locale: "en-us",
    sitemap: "website",
  });

  const PageTemplate = getPageTemplate(page.templateName);

  return <PageTemplate page={page} />;
}
```

### Dynamic Pages

Dynamic pages are generated from content items:

**Example:** Blog post details

1. **In Agility CMS:**
   - Create a page under "Blog" called "post-details"
   - Set it as a **Dynamic Page List**
   - Connect to "Posts" container
   - Use formulas for URL generation:
     - Page Name Formula: `##slug##`
     - Title Formula: `##title##`
     - Menu Text Formula: `##title##`

2. **In Next.js:**
   - Dynamic pages are automatically generated
   - `generateStaticParams()` creates a route for each post
   - URL: `/blog/my-first-post` (where `my-first-post` is the slug)

**Accessing dynamic content:**
```typescript
// components/agility-components/PostDetails.tsx
export default async function PostDetails({ page }) {
  // page.contentID contains the ID of the dynamic content item
  const post = await getContentItem<IPost>({
    contentID: page.contentID,
    languageCode: "en-us",
  });

  return (
    <article>
      <h1>{post.title}</h1>
      <div dangerouslySetInnerHTML={{ __html: post.content }} />
    </article>
  );
}
```

## Working with Modules

### Creating a Module in Agility CMS

1. **Go to Settings > Models > Modules**
2. **Click "+ New Module"**
3. **Define fields:**
   - Text fields (heading, subheading)
   - Rich text (content)
   - Images (hero image)
   - Linked content (posts, categories)
   - Booleans (show/hide options)
4. **Save the module**

### Mapping Modules to React Components

1. **Create React component:**
```typescript
// components/agility-components/MyHero.tsx
interface MyHeroModule {
  heading: string;
  subheading: string;
  image: {
    url: string;
    label: string;
  };
  ctaText: string;
  ctaLink: string;
}

export default function MyHero({ module }) {
  const { fields } = module;
  const data = fields as MyHeroModule;

  return (
    <section>
      <h1>{data.heading}</h1>
      <p>{data.subheading}</p>
      <img src={data.image.url} alt={data.image.label} />
      <a href={data.ctaLink}>{data.ctaText}</a>
    </section>
  );
}
```

2. **Register in component index:**
```typescript
// components/agility-components/index.ts
import MyHero from "./MyHero";

const allModules = [
  // ... existing modules
  { name: "MyHero", module: MyHero },
];
```

3. **Add to page in Agility CMS:**
   - Edit a page
   - Add module to a content zone
   - Fill in fields
   - Save and publish

### Module Props

All modules receive these props:

```typescript
interface ModuleProps {
  module: {
    contentID: number;
    fields: any;              // Module fields
  };
  page: AgilityPage;          // Current page
  index?: number;             // Position in zone
}
```

**Accessing props:**
```typescript
export default function MyComponent({ module, page, index }) {
  const { contentID, fields } = module;

  console.log("Module ID:", contentID);
  console.log("Page ID:", page.pageID);
  console.log("Position:", index);

  return <div>...</div>;
}
```

## Advanced Patterns

### Linked Content

Agility supports linked content fields (dropdowns, checkboxes, grids):

**Example:** Post with Category (Dropdown)

```typescript
// Component field configuration in Agility:
// - Type: Linked Content
// - Render As: Dropdown
// - Content Model: "Category"
// - Display Column: "title"
// - Save Value To Field: "categoryID" (Integer field)
// - Save Text To Field: "categoryName" (Text field)

// In React:
export default async function PostCard({ module }) {
  const post = module.fields as IPost;

  // Values are auto-populated by Agility
  console.log(post.category);      // "categories" (container ref)
  console.log(post.categoryID);    // 42
  console.log(post.categoryName);  // "Technology"

  // Fetch full category if needed
  const category = await getContentItem<ICategory>({
    contentID: post.categoryID,
    languageCode: "en-us",
  });

  return (
    <article>
      <h2>{post.title}</h2>
      <span>{category.title}</span>
    </article>
  );
}
```

### Nested Content

Nested content (child lists) for one-to-many relationships:

**Example:** FAQ module with nested question items

```typescript
// In Agility CMS:
// - FAQ Module has a "Linked Content (Grid)" field
// - Type: Nested (creates child items per module instance)
// - Content Model: "FAQItem"

// In React:
export default async function FAQ({ module }) {
  const { faqItems } = module.fields; // "faqitems-123" (child container ref)

  // Fetch nested items
  const items = await getContentList<IFAQItem>({
    referenceName: faqItems,
    languageCode: "en-us",
  });

  return (
    <dl>
      {items.map((item) => (
        <div key={item.contentID}>
          <dt>{item.question}</dt>
          <dd>{item.answer}</dd>
        </div>
      ))}
    </dl>
  );
}
```

### Server Actions

Use Server Actions for interactive module features:

**Example:** Load more posts

```typescript
// components/agility-components/PostsListing/actions.ts
"use server";

import { getContentList } from "@/lib/cms/getContentList";
import { IPost } from "@/lib/types/IPost";

export async function loadMorePosts(skip: number, take: number) {
  const posts = await getContentList<IPost>({
    referenceName: "posts",
    languageCode: "en-us",
    take,
    skip,
    sort: "fields.date",
    direction: "desc",
  });

  return posts;
}
```

```typescript
// components/agility-components/PostsListing/PostsListing.client.tsx
"use client";

import { useState } from "react";
import { loadMorePosts } from "./actions";

export default function PostsListingClient({ initialPosts }) {
  const [posts, setPosts] = useState(initialPosts);
  const [skip, setSkip] = useState(initialPosts.length);

  const handleLoadMore = async () => {
    const newPosts = await loadMorePosts(skip, 10);
    setPosts([...posts, ...newPosts]);
    setSkip(skip + newPosts.length);
  };

  return (
    <div>
      {posts.map((post) => (
        <PostCard key={post.contentID} post={post} />
      ))}
      <button onClick={handleLoadMore}>Load More</button>
    </div>
  );
}
```

### Image Optimization

Use Next.js `Image` component with Agility images:

```typescript
import Image from "next/image";

export default function Hero({ module }) {
  const { image } = module.fields;

  // Agility CDN supports query params for resizing
  const imageSrc = `${image.url}?w=1200&h=600&mode=crop`;

  return (
    <Image
      src={imageSrc}
      alt={image.label}
      width={1200}
      height={600}
      priority          // Load above the fold
    />
  );
}
```

**Agility Image CDN Parameters:**
- `?w=800` - Width
- `?h=600` - Height
- `?mode=crop` - Crop to dimensions
- `?mode=max` - Fit within dimensions
- `?format=webp` - Convert to WebP
- `?quality=80` - JPEG quality (1-100)

### Multi-Locale Support

This starter is ready for multiple locales:

1. **Update environment:**
```env
AGILITY_LOCALES=en-us,fr-ca,es-mx
```

2. **Update routing:**
```typescript
// app/[locale]/[...slug]/page.tsx
export async function generateStaticParams() {
  const locales = process.env.AGILITY_LOCALES.split(",");

  const paths = [];

  for (const locale of locales) {
    const sitemap = await getSitemapFlat({ languageCode: locale });

    sitemap.forEach((node) => {
      paths.push({
        locale,
        slug: node.pagePath.split("/").filter(Boolean),
      });
    });
  }

  return paths;
}
```

3. **Fetch content for locale:**
```typescript
export default async function Page({ params }) {
  const { locale, slug } = params;

  const page = await getAgilityPage({
    slug: slug.join("/"),
    locale,
    sitemap: "website",
  });

  // ...
}
```

See [nextjs-demo-site-2025](https://github.com/agility/nextjs-demo-site-2025) for a complete multi-locale implementation.

## Best Practices

### 1. Type Your Content

Always create TypeScript interfaces for content models:

```typescript
// lib/types/ITestimonial.ts
export interface ITestimonial {
  contentID: number;
  name: string;
  title: string;
  company: string;
  quote: string;
  headshot?: {
    url: string;
    label: string;
  };
  rating: number;
}
```

**Benefits:**
- IntelliSense in VS Code
- Catch errors at compile time
- Self-documenting code

### 2. Cache Appropriately

Use cache tags for granular invalidation:

```typescript
// Good - specific tags
const post = await api.getContentItem({
  contentID: 123,
  cacheTags: [
    `agility-content-123-en-us`,
    `agility-content-posts-en-us`,
  ],
});

// Bad - no tags (can't invalidate)
const post = await api.getContentItem({
  contentID: 123,
});
```

### 3. Separate Concerns

Keep layers separate:

- **CMS Layer** (`lib/cms/`) - Generic Agility operations
- **Domain Layer** (`lib/cms-content/`) - Business logic
- **Components** - Presentation only

**Example:**
```typescript
// ❌ Bad - fetching in component
export default async function PostsListing({ module }) {
  const posts = await api.getContentList({
    referenceName: "posts",
    languageCode: "en-us",
  });

  return <div>...</div>;
}

// ✅ Good - fetching in domain layer
export default async function PostsListing({ module }) {
  const { posts } = await getPostListing({
    take: 10,
    category: module.fields.categoryFilter,
  });

  return <div>...</div>;
}
```

### 4. Error Handling

Always handle missing content gracefully:

```typescript
export default async function PostDetails({ page }) {
  const post = await getContentItem<IPost>({
    contentID: page.contentID,
    languageCode: "en-us",
  }).catch(() => null);

  if (!post) {
    return <InlineError message="Post not found" />;
  }

  return <article>...</article>;
}
```

### 5. Preview Mode

Always bypass cache in preview:

```typescript
const { isPreview } = await getAgilityContext();

const revalidateSeconds = isPreview
  ? 0  // No caching in preview
  : Number(process.env.AGILITY_FETCH_CACHE_DURATION || 60);
```

### 6. Optimize Images

Always use Next.js `Image` component:

```typescript
// ❌ Bad
<img src={image.url} alt={image.label} />

// ✅ Good
<Image
  src={image.url}
  alt={image.label}
  width={800}
  height={600}
  sizes="(max-width: 768px) 100vw, 800px"
/>
```

### 7. URL Resolution

Use sitemap for URL generation:

```typescript
// ❌ Bad - hardcoded URLs
const postUrl = `/blog/${post.slug}`;

// ✅ Good - resolved from sitemap
const sitemap = await getSitemapFlat({ languageCode: "en-us" });
const blogNode = sitemap.find((n) => n.contentID === blogPageID);
const postUrl = `${blogNode.path}/${post.slug}`;
```

### 8. Module Naming

Keep module names consistent between Agility and React:

**In Agility CMS:**
- "PostListing" (PascalCase)

**In React:**
```typescript
// components/agility-components/PostListing.tsx
export default function PostListing() { ... }

// components/agility-components/index.ts
{ name: "PostListing", module: PostListing }
```

---

This guide covers the essential patterns for working with Agility CMS in Next.js. For more advanced examples including AI integration, personalization, and complex content relationships, see the [nextjs-demo-site-2025](https://github.com/agility/nextjs-demo-site-2025) repository.
