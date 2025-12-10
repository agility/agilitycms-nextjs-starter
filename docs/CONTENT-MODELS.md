# Content Models Reference

Complete documentation of all content models and component models in the Agility CMS instance, including field schemas, relationships, and usage examples.

## Table of Contents

- [Overview](#overview)
- [Content Models](#content-models)
- [Component Models](#component-models)
- [Containers](#containers)
- [Sitemap Structure](#sitemap-structure)
- [Field Types Reference](#field-types-reference)

## Overview

This Agility CMS instance contains **24 content models** and **20 component models** organized into categories:

**Content Categories:**
- **Blog** - Post, Author, Category, Tag
- **Global** - Header, Footer, Settings, AI Configuration
- **Personalization** - Audience, Region, Customer Profile

**Component Categories:**
- Blog components (Post Listing, Post Details, Featured Post)
- Marketing components (Hero, Bento Section, Testimonials, Pricing)
- Layout components (Heading, Rich Text Area, Text Block with Image)
- Interactive components (Carousel, Contact Us, FAQ)

## Content Models

Content models define the structure of content items stored in Agility CMS.

### Post

Blog posts and articles with rich content, categorization, and authorship.

**Reference Name:** `Post`
**Category:** Blog
**Type:** Content List

**Fields:**

| Field Name | Type | Required | Description |
|------------|------|----------|-------------|
| **Details Tab** | | | |
| `Heading` | Text | Yes | Post title |
| `Slug` | Text | Yes | URL-friendly identifier |
| `PostDate` | Date | Yes | Publication date |
| `Category` | Linked Content (Dropdown) | No | Post category |
| `CategoryID` | Integer | No | Auto-populated category ID |
| `CategoryName` | Text | No | Auto-populated category name |
| `Tags` | Linked Content (Search List) | No | Post tags (multiple) |
| `TagIDs` | Text | No | Comma-separated tag IDs |
| `TagNames` | Text | No | Comma-separated tag names |
| `Author` | Linked Content (Dropdown) | No | Post author |
| `AuthorID` | Integer | No | Auto-populated author ID |
| `AuthorName` | Text | No | Auto-populated author name |
| **Content Tab** | | | |
| `Content` | HTML | Yes | Post body content |
| **Image Tab** | | | |
| `Image` | Image Attachment | No | Hero/featured image |

**Linked Content:**
- **Category** → Links to `Categories` container, saves to `CategoryID` and `CategoryName`
- **Tags** → Links to `Tags` container, saves to `TagIDs` and `TagNames`
- **Author** → Links to `Authors` container, saves to `AuthorID` and `AuthorName`

**TypeScript Interface:**
```typescript
export interface IPost {
  contentID: number;
  heading: string;
  slug: string;
  postDate: string;
  category: string;
  categoryID: number;
  categoryName: string;
  tags: string;
  tagIDs: string;
  tagNames: string;
  author: string;
  authorID: number;
  authorName: string;
  content: string;
  image?: {
    url: string;
    label: string;
    width: number;
    height: number;
  };
}
```

**Usage:**
```typescript
import { getContentItem } from "@/lib/cms/getContentItem";
import { IPost } from "@/lib/types/IPost";

const post = await getContentItem<IPost>({
  contentID: 123,
  languageCode: "en-us",
});
```

---

### Author

Author profiles with biographical information and headshot photos.

**Reference Name:** `Author`
**Category:** Blog
**Type:** Content Item

**Fields:**

| Field Name | Type | Required | Description |
|------------|------|----------|-------------|
| `Name` | Text | Yes | Author full name |
| `Title` | Text | No | Job title or role |
| `Bio` | Long Text | No | Author biography |
| `Headshot` | Image Attachment | No | Author photo |

**TypeScript Interface:**
```typescript
export interface IAuthor {
  contentID: number;
  name: string;
  title?: string;
  bio?: string;
  headshot?: {
    url: string;
    label: string;
  };
}
```

---

### Category

Post categories for content organization.

**Reference Name:** `Category`
**Category:** Blog
**Type:** Content Item

**Fields:**

| Field Name | Type | Required | Description |
|------------|------|----------|-------------|
| `Name` | Text | Yes | Category name |
| `Description` | Long Text | No | Category description |
| `Image` | Image Attachment | No | Category icon/image |

**TypeScript Interface:**
```typescript
export interface ICategory {
  contentID: number;
  name: string;
  description?: string;
  image?: {
    url: string;
    label: string;
  };
}
```

---

### Tag

Content tags for classification.

**Reference Name:** `Tag`
**Category:** Blog
**Type:** Content List

**Fields:**

| Field Name | Type | Required | Description |
|------------|------|----------|-------------|
| `Name` | Text | Yes | Tag name |

**TypeScript Interface:**
```typescript
export interface ITag {
  contentID: number;
  name: string;
}
```

---

### Header

Site header configuration with logo and navigation.

**Reference Name:** `Header`
**Category:** Global
**Type:** Content List

**Fields:**

| Field Name | Type | Required | Description |
|------------|------|----------|-------------|
| `Logo` | Image Attachment | Yes | Site logo |
| `SiteName` | Text | Yes | Site name for accessibility |
| `Navigation` | Linked Content (Grid) | No | Navigation links |

**TypeScript Interface:**
```typescript
export interface IHeader {
  contentID: number;
  logo: {
    url: string;
    label: string;
    width: number;
    height: number;
  };
  siteName: string;
  navigation: string;  // Reference to nav items container
}
```

---

### Footer

Site footer with links and social media.

**Reference Name:** `Footer`
**Category:** Global
**Type:** Content List

**Fields:**

| Field Name | Type | Required | Description |
|------------|------|----------|-------------|
| `Logo` | Image Attachment | Yes | Footer logo |
| `Copyright` | Text | Yes | Copyright notice |
| `FooterLinks` | Linked Content (Grid) | No | Footer navigation links |
| `SocialLinks` | Linked Content (Grid) | No | Social media links |

**TypeScript Interface:**
```typescript
export interface IFooter {
  contentID: number;
  logo: {
    url: string;
    label: string;
  };
  copyright: string;
  footerLinks: string;
  socialLinks: string;
}
```

---

### Global Settings

Site-wide configuration values.

**Reference Name:** `globalsettings`
**Category:** Global
**Type:** Content Item

**Fields:**

| Field Name | Type | Required | Description |
|------------|------|----------|-------------|
| `SiteName` | Text | Yes | Global site name |
| `GoogleAnalyticsID` | Text | No | GA tracking ID |
| `MetaDescription` | Long Text | No | Default meta description |
| `FavIcon` | Image Attachment | No | Site favicon |

**TypeScript Interface:**
```typescript
export interface IGlobalSettings {
  siteName: string;
  googleAnalyticsID?: string;
  metaDescription?: string;
  favIcon?: {
    url: string;
  };
}
```

---

### AI Search Configuration

Configuration for AI-powered search features (advanced).

**Reference Name:** `AISearchConfiguration`
**Category:** Global
**Type:** Content List

**Fields:**

| Field Name | Type | Required | Description |
|------------|------|----------|-------------|
| `SystemPrompt` | Long Text | Yes | AI system instructions |
| `Temperature` | Decimal | No | AI response creativity (0-1) |
| `MaxTokens` | Integer | No | Maximum response length |
| `DefaultPrompts` | Long Text | No | Suggested search queries |
| `EnableAgent` | Boolean | No | Enable full agent mode |

**TypeScript Interface:**
```typescript
export interface IAISearchConfiguration {
  systemPrompt: string;
  temperature: number;
  maxTokens: number;
  defaultPrompts: string;
  enableAgent: boolean;
}
```

---

### Testimonial Item

Customer testimonials and reviews.

**Reference Name:** `TestimonialItem`
**Category:** Marketing
**Type:** Content List

**Fields:**

| Field Name | Type | Required | Description |
|------------|------|----------|-------------|
| `Name` | Text | Yes | Customer name |
| `Company` | Text | No | Company name |
| `Title` | Text | No | Job title |
| `Quote` | Long Text | Yes | Testimonial text |
| `Rating` | Integer | No | Star rating (1-5) |
| `Headshot` | Image Attachment | No | Customer photo |

**TypeScript Interface:**
```typescript
export interface ITestimonial {
  contentID: number;
  name: string;
  company?: string;
  title?: string;
  quote: string;
  rating?: number;
  headshot?: {
    url: string;
    label: string;
  };
}
```

---

### FAQ Item

Frequently asked questions.

**Reference Name:** `FAQItem`
**Category:** Marketing
**Type:** Content List

**Fields:**

| Field Name | Type | Required | Description |
|------------|------|----------|-------------|
| `Question` | Text | Yes | Question text |
| `Answer` | HTML | Yes | Answer with rich formatting |

**TypeScript Interface:**
```typescript
export interface IFAQItem {
  contentID: number;
  question: string;
  answer: string;  // HTML content
}
```

---

### Pricing Tier

Pricing plans and feature lists.

**Reference Name:** `PricingTier`
**Category:** Marketing
**Type:** Content List

**Fields:**

| Field Name | Type | Required | Description |
|------------|------|----------|-------------|
| `Name` | Text | Yes | Plan name (e.g., "Pro") |
| `Price` | Decimal | Yes | Monthly price |
| `BillingPeriod` | Text | No | Billing frequency |
| `Features` | Long Text | Yes | Feature list (line-separated) |
| `CTAText` | Text | Yes | Button text |
| `CTALink` | Link | No | Button URL |
| `IsFeatured` | Boolean | No | Highlight this plan |

**TypeScript Interface:**
```typescript
export interface IPricingTier {
  contentID: number;
  name: string;
  price: number;
  billingPeriod?: string;
  features: string;
  ctaText: string;
  ctaLink?: {
    href: string;
    target: string;
    text: string;
  };
  isFeatured: boolean;
}
```

---

### Carousel Slide

Individual carousel slide content.

**Reference Name:** `carouselSlide`
**Category:** Marketing
**Type:** Content Item

**Fields:**

| Field Name | Type | Required | Description |
|------------|------|----------|-------------|
| `Title` | Text | Yes | Slide heading |
| `Description` | Long Text | No | Slide text |
| `Image` | Image Attachment | Yes | Slide image |
| `Link` | Link | No | Slide link |

**TypeScript Interface:**
```typescript
export interface ICarouselSlide {
  contentID: number;
  title: string;
  description?: string;
  image: {
    url: string;
    label: string;
  };
  link?: {
    href: string;
    target: string;
    text: string;
  };
}
```

---

### Personalization Models (Advanced)

**Audience** - Custom demographic segments
**Region** - Geographic personalization
**Customer Profile** - User-specific targeting

These models are used in advanced personalization features. See the [nextjs-demo-site-2025](https://github.com/agility/nextjs-demo-site-2025) repository for complete personalization implementation examples.

---

## Component Models

Component models (modules) define content blocks that can be placed on pages.

### Post Details

Displays individual blog post content (no configuration needed).

**Reference Name:** `PostDetails`
**Description:** Shows full blog post on detail pages
**Fields:** None (uses dynamic page context)

**Usage:**
- Add to "post-details" dynamic page template
- Automatically fetches post via page's `contentID`

---

### Post Listing

Displays a grid of blog posts with pagination.

**Reference Name:** `PostListing`
**Description:** Blog post listing with infinite scroll

**Fields:**

| Field Name | Type | Required | Description |
|------------|------|----------|-------------|
| `Title` | Text | Yes | Listing heading |
| `Subtitle` | Text | No | Listing subheading |
| `PreHeader` | Text | No | Optional tagline |

**TypeScript Interface:**
```typescript
interface IPostListingModule {
  title: string;
  subtitle?: string;
  preHeader?: string;
}
```

---

### Featured Post

Highlights a single blog post.

**Reference Name:** `FeaturedPost`

**Fields:**

| Field Name | Type | Required | Description |
|------------|------|----------|-------------|
| `Post` | Linked Content (Dropdown) | Yes | Select post to feature |
| `PostID` | Integer | No | Auto-populated |
| `PostTitle` | Text | No | Auto-populated |

---

### Text Block With Image

Flexible text and image layout.

**Reference Name:** `TextBlockWithImage`

**Fields:**

| Field Name | Type | Required | Description |
|------------|------|----------|-------------|
| `Title` | Text | Yes | Section heading |
| `Content` | Long Text | Yes | Description text |
| `Tagline` | Text | No | Optional overline |
| `ImagePosition` | Dropdown | Yes | "left" or "right" |
| `Image` | Image Attachment | Yes | Section image |
| `PrimaryButton` | Link | No | CTA button |
| `HighPriority` | Boolean | No | Above-the-fold image |

---

### Heading

Simple heading component.

**Reference Name:** `Heading`

**Fields:**

| Field Name | Type | Required | Description |
|------------|------|----------|-------------|
| `Title` | Text | Yes | Heading text |
| `Level` | Dropdown | Yes | h1, h2, h3, or h4 |
| `Alignment` | Dropdown | Yes | left, center, or right |

---

### Rich Text Area

HTML content block.

**Reference Name:** `RichTextArea`

**Fields:**

| Field Name | Type | Required | Description |
|------------|------|----------|-------------|
| `Textblob` | HTML | Yes | Rich text content |

**Usage:**
- Add formatted content with headings, lists, links
- Styled with Tailwind Typography
- Supports dark mode

---

### Advanced Components

The following component models are available for more complex use cases:

- **Background Hero** - Hero with gradient or image background
- **A/B Test Hero** - Hero with variant testing
- **Bento Section** - Grid of feature cards
- **Logo Strip** - Client/partner logos
- **Personalized Logo Strip** - Audience-specific logos
- **Carousel** - Image/content carousel
- **Testimonials** - Customer testimonial grid
- **Testimonial** - Single testimonial display
- **Frequently Asked Questions** - FAQ accordion
- **Pricing Cards** - Pricing tier cards
- **Pricing Table** - Comparison table
- **Company Stats** - Key metrics display
- **Team Listing** - Team member grid
- **Service Listing** - Services showcase
- **Contact Us** - Contact form

For complete implementation examples, see [nextjs-demo-site-2025](https://github.com/agility/nextjs-demo-site-2025).

---

## Containers

Containers are instances of content models that store actual content items.

| Container | Model | Type | Description |
|-----------|-------|------|-------------|
| `Posts` | Post | List | Blog posts |
| `Authors` | Author | List | Author profiles |
| `Categories` | Category | List | Post categories |
| `Tags` | Tag | List | Content tags |
| `Header` | Header | List | Site header config |
| `Footer` | Footer | List | Site footer config |
| `Settings` | Global Settings | List | Site settings |
| `AISearchConfiguration` | AI Search Configuration | List | AI config |
| `Testimonials` | Testimonial Item | List | Testimonials |
| `Audiences` | Audience | List | Personalization segments |
| `Regions` | Region | List | Geographic regions |
| `Customers` | Customer Profile | List | Customer data |
| `Carousel` | Carousel Slide | Single | Carousel content |

**Dynamic Pages:**
- **Posts** container is configured as a dynamic page list
- Generates individual pages at `/blog/{slug}`
- Title/URL formulas use `##heading##` and `##slug##`

---

## Sitemap Structure

Current site structure:

```
Website (Sitemap)
├── Home (/)
├── About Us (/about-us)
├── Blog (/blog)
│   └── post-details (dynamic: /blog/{slug})
├── Pricing (/pricing)
├── Features (/features)
├── Contact Us (/contact-us)
└── Test (/test)
```

**Dynamic Pages:**
- **Blog > post-details** - Generated from `Posts` container
- Each post creates a page: `/blog/my-post-title`
- Page formulas:
  - Page Name: `##slug##`
  - Title: `##heading##`
  - Menu Text: `##heading##`

---

## Field Types Reference

### Basic Types

**Text** - Single-line text input
**Long Text** - Multi-line textarea
**HTML** - Rich text editor
**Integer** - Whole numbers
**Decimal** - Decimal numbers
**Boolean** - True/false checkbox
**Date** - Date picker (with optional time)

### Media Types

**Image Attachment**
```typescript
{
  url: string;          // CDN URL
  label: string;        // Alt text
  width: number;
  height: number;
  filesize: number;
}
```

**File Attachment**
```typescript
{
  url: string;          // CDN URL
  label: string;        // File description
  filesize: number;
}
```

### Link Type

**Link**
```typescript
{
  href: string;         // URL
  target: string;       // "_blank" or "_self"
  text: string;         // Link text
}
```

### Linked Content Types

**Dropdown** - Single selection from content list
**Checkboxes** - Multiple selections
**Search List Box** - Searchable multi-select
**Grid (Shared)** - Reference existing content
**Grid (Nested)** - Create child content

**Linked Content Configuration:**
- **Content Model** - Which model to link to
- **Content View** - Which container to pull from
- **Display Column** - Which field to show in UI
- **Save Value To** - Field for content ID
- **Save Text To** - Field for display text

---

## Best Practices

### 1. Naming Conventions

- **Content Models** - PascalCase: `Post`, `Author`, `Category`
- **Component Models** - PascalCase: `PostListing`, `Hero`
- **Containers** - PascalCase: `Posts`, `Authors`, `Categories`
- **Fields** - PascalCase: `Heading`, `Content`, `ImagePosition`

### 2. Linked Content

- Always include hidden fields for `{Name}ID` and `{Name}Name`
- Use dropdowns for single selection
- Use search list box for multiple selection
- Grid (nested) creates child items, grid (shared) references existing

### 3. Required Fields

- Mark essential fields as required
- Balance required fields vs. editor flexibility
- Use validation patterns for specific formats

### 4. Tabs

- Organize complex models with tabs
- Group related fields together
- "Details", "Content", "Settings" are common tab names

### 5. TypeScript

- Create interfaces for all content models
- Export from `lib/types/`
- Use generics with fetch utilities
- Keep field names synchronized with CMS

---

## Adding New Content Models

### Step-by-Step

1. **Create in Agility CMS:**
   - Go to **Settings > Models > Content**
   - Click **"+ New Content Model"**
   - Add fields
   - Save model

2. **Create Container:**
   - Go to **Content > "+ Add Content"**
   - Select your model
   - Choose List or Single Item
   - Set reference name

3. **Create TypeScript Interface:**
```typescript
// lib/types/IMyModel.ts
export interface IMyModel {
  contentID: number;
  // ... your fields
}
```

4. **Fetch Content:**
```typescript
import { getContentList } from "@/lib/cms/getContentList";
import { IMyModel } from "@/lib/types/IMyModel";

const items = await getContentList<IMyModel>({
  referenceName: "mymodel",
  languageCode: "en-us",
});
```

---

For more advanced content model examples and patterns, see the [nextjs-demo-site-2025](https://github.com/agility/nextjs-demo-site-2025) repository.
