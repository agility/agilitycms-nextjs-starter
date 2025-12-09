# Component Reference

Complete reference for all React components in this starter, including CMS modules, page templates, and utility components.

## Table of Contents

- [CMS Module Components](#cms-module-components)
- [Page Templates](#page-templates)
- [Common Components](#common-components)
- [Creating Custom Components](#creating-custom-components)

## CMS Module Components

These components map to Agility CMS modules and can be added to content zones in the CMS.

### TextBlockWithImage

Flexible component for displaying text content alongside an image.

**Location:** [`components/agility-components/TextBlockWithImage.tsx`](components/agility-components/TextBlockWithImage.tsx)

**Fields:**
```typescript
interface ITextBlockWithImage {
  title: string;              // Main heading
  content: string;            // Descriptive text
  tagline?: string;           // Optional overline text
  imagePosition: "left" | "right";  // Image placement
  image: ImageField;          // Image with responsive sources
  primaryButton: URLField;    // CTA button (optional)
  highPriority?: string;      // "true" for above-fold images
}
```

**Features:**
- Responsive image sizing with `AgilityPic`
- Left or right image positioning
- Optional CTA button (internal or external links)
- Dark mode support
- Priority loading for above-the-fold images

**Usage in CMS:**
1. Add "TextBlockWithImage" module to a content zone
2. Fill in heading, content, and upload image
3. Choose image position (left/right)
4. Optionally add a primary button link
5. Check "High Priority" for images above the fold

**Code Example:**
```tsx
// Automatically rendered when module is added to page
<TextBlockWithImage module={module} languageCode="en-us" />
```

---

### PostsListing

Server/client split component for displaying blog posts with infinite scroll.

**Location:**
- Server: [`components/agility-components/PostsListing/PostsListing.server.tsx`](components/agility-components/PostsListing/PostsListing.server.tsx)
- Client: [`components/agility-components/PostsListing/PostsListing.client.tsx`](components/agility-components/PostsListing/PostsListing.client.tsx)

**Module Fields:**
```typescript
interface IPostListing {
  title: string;        // Listing heading
  subtitle: string;     // Listing subheading
  preHeader: string;    // Optional tagline
}
```

**Features:**
- Server-side initial data fetching
- Client-side infinite scroll
- Server Actions for pagination
- Responsive grid layout
- Category badges
- Date formatting

**Architecture:**
```
PostsListing (Server Component)
├── Fetches initial posts (10 items)
├── Defines getNextPosts Server Action
└── Passes to PostsListingClient
    └── Client Component
        ├── Manages scroll state
        ├── Loads more posts on scroll
        └── Renders post grid
```

**Usage in CMS:**
1. Add "PostListing" module to page
2. Set heading and optional subheading
3. Component automatically fetches and displays posts

---

### PostDetails

Displays individual blog post with full content, metadata, and author info.

**Location:** [`components/agility-components/PostDetails.tsx`](components/agility-components/PostDetails.tsx)

**No Module Fields** - Relies on dynamic page context

**Features:**
- Full post content with rich text
- Category badge and tags
- Author information
- Date formatting
- Hero image with responsive sizing
- Dark mode support
- Breadcrumb navigation

**Usage:**
- Automatically rendered on blog post detail pages
- Content pulled from dynamic page's `contentID`
- Place on "post-details" dynamic page template

---

### FeaturedPost

Highlights a single blog post with large layout.

**Location:** [`components/agility-components/FeaturedPost.tsx`](components/agility-components/FeaturedPost.tsx)

**Module Fields:**
```typescript
interface IFeaturedPost {
  post: string;         // Linked content (Post dropdown)
  postID: number;       // Auto-populated
  postTitle: string;    // Auto-populated
}
```

**Features:**
- Large hero image
- Post title, excerpt, and category
- Read more link
- Responsive layout
- Dark mode support

**Usage in CMS:**
1. Add "FeaturedPost" module
2. Select post from dropdown
3. Component fetches and displays full post data

---

### Heading

Simple heading component for section titles.

**Location:** [`components/agility-components/Heading.tsx`](components/agility-components/Heading.tsx)

**Module Fields:**
```typescript
interface IHeading {
  title: string;        // Heading text
  level: "h1" | "h2" | "h3" | "h4";  // HTML heading level
  alignment: "left" | "center" | "right";  // Text alignment
}
```

**Features:**
- Semantic HTML headings
- Flexible alignment
- Dark mode support
- Responsive sizing

**Usage in CMS:**
1. Add "Heading" module to zone
2. Enter heading text
3. Choose heading level (h1-h4)
4. Set alignment preference

---

### RichTextArea

Renders rich HTML content from CMS.

**Location:** [`components/agility-components/RichTextArea.tsx`](components/agility-components/RichTextArea.tsx)

**Module Fields:**
```typescript
interface IRichTextArea {
  textblob: string;     // HTML content
}
```

**Features:**
- Tailwind Typography (`prose` class)
- Dark mode prose styling
- Responsive text sizing
- Automatic HTML sanitization (via `html-react-parser`)

**Usage in CMS:**
1. Add "RichTextArea" module
2. Use rich text editor to create content
3. Supports headings, lists, links, bold, italic, etc.

**Styling:**
Uses Tailwind Typography plugin for beautiful typographic defaults:
```tsx
<div className="prose dark:prose-invert max-w-none">
  {parse(fields.textblob)}
</div>
```

---

### NoComponentFound

Fallback component when module isn't registered.

**Location:** [`components/agility-components/NoComponentFound.tsx`](components/agility-components/NoComponentFound.tsx)

**Features:**
- Displays error message with module name
- Helpful for debugging missing components
- Prevents page crashes

**When shown:**
- Module exists in CMS but not registered in React
- Typo in module name registration
- Module file not imported

**How to fix:**
1. Create the component file
2. Register in [`components/agility-components/index.ts`](components/agility-components/index.ts)
3. Ensure name matches exactly

---

## Page Templates

Page templates define the layout structure for pages in Agility CMS.

### MainTemplate

Default page template with a main content zone.

**Location:** [`components/agility-pages/MainTemplate.tsx`](components/agility-pages/MainTemplate.tsx)

**Structure:**
```tsx
<div className="main-template">
  <ContentZone
    name="MainContent"
    page={page}
    getModule={getModule}
  />
</div>
```

**Content Zones:**
- **MainContent** - Primary content area

**Usage:**
- Most pages use this template
- Modules added to "MainContent" zone render sequentially
- Set as page template when creating pages in CMS

---

## Common Components

Shared components used throughout the site.

### SiteHeader

Main navigation header with dark mode toggle.

**Location:** [`components/common/SiteHeader.tsx`](components/common/SiteHeader.tsx)

**Features:**
- Responsive navigation (desktop/mobile)
- Dark mode toggle switch
- Logo with link to homepage
- Mobile menu drawer
- Auto-detects system color scheme preference
- Navigation items from sitemap

**Props:**
```typescript
interface Props {
  header: IHeaderData | null;
}

interface IHeaderData {
  logo: ImageField;
  siteName: string;
  links: Array<{
    title: string;
    path: string;
  }>;
}
```

**Dark Mode:**
- Uses Headless UI `<Switch>` component
- Persists to `<html class="dark">` for Tailwind
- Listens to system preference changes
- Icons: `IconBrightnessDown` (light) and `IconBrightnessUp` (dark)

**Usage:**
```tsx
// In app/layout.tsx
const header = await getHeaderContent();
<SiteHeader header={header} />
```

---

### SiteFooter

Footer with social links and copyright.

**Location:** [`components/common/SiteFooter.tsx`](components/common/SiteFooter.tsx)

**Features:**
- Social media links (Twitter, LinkedIn, GitHub, etc.)
- Footer navigation links
- Copyright notice
- Logo display
- Dark mode support

**Props:**
```typescript
interface Props {
  footer: IFooterData | null;
}

interface IFooterData {
  logo: ImageField;
  copyright: string;
  links: Array<{
    title: string;
    path: string;
  }>;
  socialLinks: Array<{
    platform: string;
    url: string;
    icon: string;
  }>;
}
```

**Usage:**
```tsx
// In app/layout.tsx
const footer = await getFooterContent();
<SiteFooter footer={footer} />
```

---

### PreviewBar

Visual indicator for preview/live mode.

**Location:** [`components/common/PreviewBar.tsx`](components/common/PreviewBar.tsx)

**Features:**
- Shows current mode (Preview/Live/Dev)
- Exit preview button
- Only visible in preview or development mode
- Sticky positioning
- Link to GitHub repo

**Modes:**
- **Preview Mode** - Shows "Preview" badge with exit button
- **Live Mode (Dev)** - Shows "Live" badge (development only)
- **Production** - Hidden

**Usage:**
```tsx
// In app/layout.tsx
<PreviewBar />
```

---

### InlineError

Error message display component.

**Location:** [`components/common/InlineError.tsx`](components/common/InlineError.tsx)

**Props:**
```typescript
interface Props {
  message: string;
}
```

**Features:**
- Centered error message
- Consistent styling
- Dark mode support
- Used for missing content or API errors

**Usage:**
```tsx
if (!post) {
  return <InlineError message="Post not found" />;
}
```

---

## Creating Custom Components

### Step-by-Step Guide

#### 1. Create Component File

```bash
touch components/agility-components/MyNewComponent.tsx
```

```tsx
// components/agility-components/MyNewComponent.tsx
import { UnloadedModuleProps } from "@agility/nextjs";
import { getContentItem } from "@/lib/cms/getContentItem";

interface IMyNewComponent {
  heading: string;
  description: string;
  showButton: boolean;
}

export default async function MyNewComponent({
  module,
  languageCode,
}: UnloadedModuleProps) {
  const { fields } = await getContentItem<IMyNewComponent>({
    contentID: module.contentid,
    languageCode,
  });

  return (
    <section className="py-12 px-8">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-3xl font-bold">{fields.heading}</h2>
        <p className="mt-4">{fields.description}</p>
        {fields.showButton && (
          <button className="mt-6 px-6 py-3 bg-blue-600 text-white rounded">
            Learn More
          </button>
        )}
      </div>
    </section>
  );
}
```

#### 2. Register Component

```tsx
// components/agility-components/index.ts
import MyNewComponent from "./MyNewComponent";

const allModules = [
  // ... existing modules
  { name: "MyNewComponent", module: MyNewComponent },
];
```

#### 3. Create Module in Agility CMS

1. Go to **Settings > Models > Modules**
2. Click **"+ New Module"**
3. Name: "MyNewComponent" (must match registration name)
4. Add fields:
   - `heading` (Text)
   - `description` (Long Text)
   - `showButton` (Boolean)
5. Save module

#### 4. Add to Page

1. Edit a page in Agility CMS
2. Click "+ Add Module" in a content zone
3. Select "MyNewComponent"
4. Fill in fields
5. Save and publish

### Component Patterns

#### Server Component (Default)

```tsx
// Async component that fetches data
export default async function MyComponent({ module, languageCode }) {
  const data = await getContentItem({ ... });

  return <div>{data.title}</div>;
}
```

**When to use:**
- Default for all components
- Fetch data directly
- No user interaction
- SEO-friendly content

#### Client Component

```tsx
"use client";

import { useState } from "react";

export default function MyInteractiveComponent({ initialData }) {
  const [count, setCount] = useState(0);

  return <button onClick={() => setCount(count + 1)}>{count}</button>;
}
```

**When to use:**
- User interactions (clicks, form input)
- React hooks (useState, useEffect, etc.)
- Browser APIs (localStorage, etc.)

#### Hybrid Pattern

```tsx
// Server Component (parent)
export default async function Parent({ module }) {
  const data = await fetchData();

  // Pass data to Client Component
  return <ClientChild data={data} />;
}
```

**Benefits:**
- Fetch on server (fast, SEO-friendly)
- Interactivity on client (when needed)
- Best of both worlds

### TypeScript Best Practices

1. **Create interface for module fields:**
```tsx
interface IMyModule {
  title: string;
  image?: ImageField;  // Optional field
  items: Array<string>;
}
```

2. **Use generics for content fetching:**
```tsx
const data = await getContentItem<IMyModule>({
  contentID: module.contentid,
  languageCode,
});
```

3. **Export interface for reuse:**
```tsx
// lib/types/IMyModule.ts
export interface IMyModule {
  // ...
}
```

### Styling Guidelines

1. **Use Tailwind CSS classes:**
```tsx
<div className="max-w-7xl mx-auto py-12 px-4">
```

2. **Support dark mode:**
```tsx
<div className="bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100">
```

3. **Responsive design:**
```tsx
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
```

4. **Use semantic HTML:**
```tsx
<article>
  <header>
    <h1>...</h1>
  </header>
  <main>...</main>
</article>
```

---

## Component Testing

### Manual Testing

1. **Preview Mode:**
   - Make changes in Agility CMS
   - Click "Preview" button
   - Verify component renders correctly
   - Test all field variations

2. **Dark Mode:**
   - Toggle dark mode switch
   - Verify colors and contrast
   - Check all component states

3. **Responsive:**
   - Test on mobile, tablet, desktop
   - Use browser DevTools responsive mode
   - Verify layout doesn't break

### Debugging

**Component not rendering:**
1. Check component is registered in `index.ts`
2. Verify module name matches exactly (case-sensitive)
3. Look for errors in browser console
4. Check Network tab for API calls

**Data not showing:**
1. Verify field names match CMS model
2. Check TypeScript interface matches CMS fields
3. Add `console.log(fields)` to inspect data
4. Ensure content is published in CMS

---

## Advanced Examples

For more complex component examples, see the [nextjs-demo-site-2025](https://github.com/agility/nextjs-demo-site-2025) repository:

- **Carousel** - Multi-slide carousel with navigation
- **Testimonials** - Customer testimonial grid
- **Pricing Cards** - Pricing tiers with features
- **FAQ Accordion** - Expandable question/answer list
- **Contact Form** - Form submission with validation
- **Personalized Components** - Audience-based content
- **A/B Testing** - Variant testing components
- **AI-Powered Search** - Intelligent search interface

---

This component library provides a solid foundation for building content-rich websites. Mix and match components, customize styling, and create your own to build unique experiences.
