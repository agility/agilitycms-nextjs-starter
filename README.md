# Agility CMS & Next.js Starter

A modern, production-ready starter for building content-managed websites with [Agility CMS](https://agilitycms.com) and [Next.js 15](https://nextjs.org/).

[Live Website Demo](https://agilitycms-nextjs-starter-blog.vercel.app/)

[New to Agility CMS? Sign up for a FREE account](https://agilitycms.com/free)

## ✨ Features

### Next.js 15 & React 18

- **App Router** - Modern Next.js routing with Server Components
- **TypeScript** - Full type safety throughout the project
- **Tailwind CSS 4** - Utility-first styling with dark mode support
- **Static Site Generation (SSG)** - Pre-rendered pages with Incremental Static Regeneration (ISR)
- **Server Components** - React Server Components for optimal performance

### Agility CMS Integration

- **Dynamic Page Routing** - Automatic page generation from Agility CMS sitemap
- **Component Module System** - CMS components mapped to React components
- **Content Fetching** - Server-side data fetching with caching strategies
- **Preview Mode** - Real-time content preview for editors
- **On-Demand Revalidation** - Webhook-triggered cache invalidation
- **Multi-Locale Ready** - Framework supports multiple languages

### Developer Experience

- **Component-Level Data Fetching** - Fetch data where you need it
- **Cache Tag Strategy** - Granular cache control with automatic invalidation
- **Dark Mode** - Built-in dark mode toggle with persistence
- **Responsive Design** - Mobile-first responsive layout
- **Image Optimization** - Next.js Image component integration
- **TypeScript Interfaces** - Strongly typed CMS content models

## 📋 Table of Contents

- [Quick Start](#quick-start)
- [Project Structure](#project-structure)
- [Architecture](#architecture)
- [Content Models](#content-models)
- [Components](#components)
- [Data Fetching](#data-fetching)
- [Caching Strategy](#caching-strategy)
- [Preview Mode](#preview-mode)
- [Deployment](#deployment)
- [Advanced Guides](#advanced-guides)

## 🚀 Quick Start

### Prerequisites

- Node.js 18.x or higher
- npm or yarn package manager
- An Agility CMS instance ([sign up for free](https://agilitycms.com/free))

### Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/agility/agilitycms-nextjs-starter.git
   cd agilitycms-nextjs-starter
   ```

2. **Install dependencies**

   ```bash
   npm install
   # or
   yarn install
   ```

3. **Configure environment variables**

   ```bash
   cp .env.local.example .env.local
   ```

4. **Get your API keys from Agility CMS**

   - Log into [Agility CMS](https://manager.agilitycms.com/)
   - Navigate to **Settings > API Keys**
   - Copy your:
     - **GUID** (Instance ID)
     - **Live API Key** (for production)
     - **Preview API Key** (for development/preview)
     - **Security Key** (for webhooks)

5. **Update `.env.local`** with your credentials:

   ```env
   AGILITY_GUID=your-guid-here
   AGILITY_API_FETCH_KEY=your-live-api-key
   AGILITY_API_PREVIEW_KEY=your-preview-api-key
   AGILITY_SECURITY_KEY=your-security-key
   AGILITY_LOCALES=en-us
   AGILITY_SITEMAP=website
   AGILITY_FETCH_CACHE_DURATION=120
   AGILITY_PATH_REVALIDATE_DURATION=10
   ```

6. **Run the development server**

   ```bash
   npm run dev
   # or
   yarn dev
   ```

7. **Open your browser** to [http://localhost:3000](http://localhost:3000)

### Production Build

```bash
npm run build
npm run start
```

## 📁 Project Structure

```
agilitycms-nextjs-starter/
├── app/                              # Next.js App Router
│   ├── layout.tsx                   # Root layout with header/footer
│   ├── page.tsx                     # Home page (delegates to [...slug])
│   ├── [...slug]/                   # Dynamic catch-all route
│   │   ├── page.tsx                 # Main page component with SSG
│   │   ├── error.tsx                # Error boundary
│   │   └── not-found.tsx            # 404 page
│   └── api/                         # API routes
│       ├── preview/                 # Preview mode endpoints
│       ├── preview/exit/            # Exit preview mode
│       ├── revalidate/              # Webhook for cache invalidation
│       └── dynamic-redirect/        # ContentID-based redirects
├── components/                      # React components
│   ├── agility-components/          # CMS component modules
│   │   ├── FeaturedPost.tsx        # Featured post display
│   │   ├── PostDetails.tsx         # Dynamic post detail view
│   │   ├── PostsListing/           # Infinite scroll post list
│   │   ├── TextBlockWithImage.tsx  # Flexible layout component
│   │   ├── RichTextArea.tsx        # HTML content display
│   │   ├── Heading.tsx             # Typography component
│   │   └── index.ts                # Component registry
│   ├── agility-pages/              # Page templates
│   │   ├── MainTemplate.tsx        # Main page template
│   │   └── index.ts                # Template registry
│   └── common/                     # Shared components
│       ├── SiteHeader.tsx          # Responsive header with dark mode
│       ├── SiteFooter.tsx          # Footer with social links
│       ├── PreviewBar.tsx          # Preview/Live mode toggle
│       └── InlineError.tsx         # Error display
├── lib/                            # Utilities and helpers
│   ├── cms/                        # CMS data fetching
│   │   ├── getAgilityContext.ts    # Mode detection (preview/live)
│   │   ├── getAgilitySDK.ts        # SDK initialization
│   │   ├── getAgilityPage.ts       # Fetch pages with layout
│   │   ├── getContentItem.ts       # Fetch single content item
│   │   ├── getContentList.ts       # Fetch content lists
│   │   ├── getSitemapFlat.ts       # Flat sitemap retrieval
│   │   └── getSitemapNested.ts     # Nested sitemap retrieval
│   ├── cms-content/                # Domain-specific queries
│   │   ├── getPostListing.ts       # Blog posts with URLs
│   │   ├── getHeaderContent.ts     # Header navigation data
│   │   ├── getPageMetaData.ts      # Page SEO metadata
│   │   └── resolveAgilityMetaData.ts # Advanced metadata
│   └── types/                      # TypeScript interfaces
│       └── (IPost, IAuthor, ICategory, etc.)
├── styles/
│   └── globals.css                 # Tailwind imports & global styles
├── middleware.ts                   # Next.js middleware for routing
├── .env.local.example              # Environment template
├── tailwind.config.js              # Tailwind configuration
├── next.config.js                  # Next.js configuration
└── tsconfig.json                   # TypeScript configuration
```

## 🏗️ Architecture

### Dynamic Page Routing

This starter uses Next.js App Router with a catch-all dynamic route `[...slug]` that maps to Agility CMS pages.

**How it works:**

1. Agility CMS sitemap defines your site structure
2. `generateStaticParams()` pre-renders all pages at build time
3. Each page fetches its layout template and content zones from Agility
4. Components are dynamically loaded based on CMS configuration

See [ARCHITECTURE.md](./docs/ARCHITECTURE.md) for detailed explanation.

### Component Module System

CMS components (modules) are mapped to React components via a registry pattern:

```typescript
// components/agility-components/index.ts
const allModules = [
	{name: "TextBlockWithImage", module: TextBlockWithImage},
	{name: "Heading", module: Heading},
	{name: "FeaturedPost", module: FeaturedPost},
	{name: "PostsListing", module: PostsListing},
	{name: "PostDetails", module: PostDetails},
	{name: "RichTextArea", module: RichTextArea},
]
```

When Agility CMS returns a page with a "TextBlockWithImage" module, the system automatically renders the corresponding React component.

### Server Components & Data Fetching

This starter uses React Server Components for optimal performance:

- **Server Components** - Default for all components, fetch data server-side
- **Client Components** - Used only when necessary (interactive features, hooks)
- **Component-level fetching** - Each component fetches its own data
- **Parallel data fetching** - Multiple components fetch concurrently

Example:

```typescript
// Server Component (default)
export default async function PostDetails({module, page}) {
	const post = await getContentItem({contentID: page.contentID})
	return <article>...</article>
}
```

## 📊 Content Models

The Agility CMS instance includes the following content models:

### Blog Content

- **Post** - Blog posts with category, tags, author, image, and rich content
- **Author** - Author profiles with name, title, and headshot
- **Category** - Post categories with images and descriptions
- **Tag** - Post tags for classification

### Global Content

- **Header** - Site header with navigation and logo
- **Footer** - Site footer with links and social media
- **Global Settings** - Site-wide configuration

### Specialized Content

- **Testimonial Item** - Customer testimonials
- **FAQ Item** - Frequently asked questions
- **Pricing Tier** - Pricing plans and features
- **Carousel Slide** - Carousel content items

### Personalization (Advanced)

- **Audience** - Custom demographic targeting
- **Region** - Geographic personalization
- **Customer Profile** - User profiles for personalization

See [CONTENT-MODELS.md](./docs/CONTENT-MODELS.md) for complete schema documentation.

## 🧩 Components

### Page Components

- **MainTemplate** - Standard page layout with content zones

### Blog Components

- **PostsListing** - Paginated blog post list with infinite scroll
- **PostDetails** - Individual post view with author, category, and rich content
- **FeaturedPost** - Highlighted post display

### Layout Components

- **TextBlockWithImage** - Flexible text + image layout (left/right)
- **RichTextArea** - Rich HTML content with Tailwind prose styling
- **Heading** - Page headings with various styles

### Global Components

- **SiteHeader** - Responsive navigation with dark mode toggle
- **SiteFooter** - Footer with social links and copyright
- **PreviewBar** - Preview mode indicator (development only)

See [COMPONENTS.md](./docs/COMPONENTS.md) for complete component API documentation.

## 🔄 Data Fetching

### CMS Utilities

Located in `lib/cms/`, these utilities handle all Agility CMS interactions:

#### `getAgilityContext()`

Determines the current mode (preview vs. production):

```typescript
const context = await getAgilityContext()
// Returns: { isPreview: boolean, locale: string, sitemap: string }
```

#### `getContentItem(contentID, languageCode)`

Fetches a single content item with cache tags:

```typescript
const post = await getContentItem({
	contentID: 123,
	languageCode: "en-us",
})
```

#### `getContentList(referenceName, languageCode, options)`

Fetches content lists with pagination and filtering:

```typescript
const posts = await getContentList({
	referenceName: "posts",
	languageCode: "en-us",
	take: 10,
	skip: 0,
	sort: "fields.date",
	direction: "desc",
})
```

#### `getAgilityPage(slug, locale, sitemap)`

Fetches a complete page with layout and content zones:

```typescript
const page = await getAgilityPage({
	slug: "/blog",
	locale: "en-us",
	sitemap: "website",
})
```

### Domain-Specific Utilities

Located in `lib/cms-content/`, these build on the CMS utilities for specific use cases:

- `getPostListing()` - Blog posts with category filtering and URLs
- `getHeaderContent()` - Navigation structure and branding
- `getPageMetaData()` - SEO metadata for pages

See [AGILITY-CMS-GUIDE.md](./docs/AGILITY-CMS-GUIDE.md) for complete data fetching patterns.

## 💾 Caching Strategy

This starter implements a sophisticated caching strategy for optimal performance:

### Cache Levels

1. **SDK Object Cache** - Agility Fetch SDK caches content items

   - Controlled by `AGILITY_FETCH_CACHE_DURATION` (default: 120 seconds)
   - Works best with on-demand revalidation

2. **Next.js Route Cache** - Next.js caches rendered pages
   - Controlled by `AGILITY_PATH_REVALIDATE_DURATION` (default: 10 seconds)
   - ISR (Incremental Static Regeneration) automatically updates stale pages

### Cache Tags

Content fetches use cache tags for granular invalidation:

```typescript
// Automatically tagged as: agility-content-{contentID}-{locale}
const post = await getContentItem({contentID: 123})
```

When content is published in Agility CMS, a webhook triggers revalidation:

- Tags associated with changed content are invalidated
- Next.js regenerates affected pages on the next request

### On-Demand Revalidation

The `/api/revalidate` endpoint handles webhook callbacks from Agility CMS:

```typescript
// Revalidates specific content items and their dependent pages
POST /api/revalidate
{
  "contentID": 123,
  "languageCode": "en-us"
}
```

### Environment Variables

```env
# Cache content objects for 120 seconds
AGILITY_FETCH_CACHE_DURATION=120

# Revalidate page paths every 10 seconds
AGILITY_PATH_REVALIDATE_DURATION=10
```

**Best Practices:**

- Use **higher values** (120-600) with on-demand revalidation for production
- Use **lower values** (10-30) or `0` without webhooks for faster content updates
- Preview mode **always bypasses cache** for real-time editing

## 👁️ Preview Mode

Preview mode allows content editors to see draft content before publishing.

### How It Works

1. **Activate Preview** - Click "Preview" in Agility CMS
2. **Validation** - System validates preview key and ContentID
3. **Draft Mode** - Next.js draft mode is enabled
4. **Live Preview** - Page displays with unpublished content
5. **Exit** - Click "Exit Preview" in the preview bar

### Implementation

**Preview Endpoint** (`app/api/preview/route.ts`):

```typescript
// Validates request and enables draft mode
export async function GET(request: Request) {
	const {agilitypreviewkey, ContentID, slug} = searchParams

	// Validate preview key
	if (agilitypreviewkey !== process.env.AGILITY_SECURITY_KEY) {
		return new Response("Invalid token", {status: 401})
	}

	// Enable draft mode
	draftMode().enable()

	// Redirect to preview page
	redirect(slug)
}
```

**Middleware** (`middleware.ts`):

```typescript
// Intercepts preview requests before they reach pages
export function middleware(request: NextRequest) {
	const {pathname, searchParams} = request.nextUrl

	if (searchParams.has("agilitypreviewkey")) {
		// Rewrite to preview API for validation
		return NextResponse.rewrite(new URL("/api/preview", request.url))
	}
}
```

**Preview Bar** (`components/common/PreviewBar.tsx`):

- Shows when in preview/development mode
- Displays current mode (Preview/Live)
- Provides exit button to leave preview mode

### Configuration

Set your security key in `.env.local`:

```env
AGILITY_SECURITY_KEY=your-security-key-from-agility
```

This key must match the one configured in Agility CMS webhook settings.

## 🚀 Deployment

### Vercel (Recommended)

Vercel provides the best Next.js experience with zero configuration:

1. **Push to GitHub** - Commit your code to a GitHub repository
2. **Import to Vercel** - Connect your repo at [vercel.com](https://vercel.com)
3. **Configure Environment Variables** - Add your `.env.local` values
4. **Deploy** - Vercel automatically builds and deploys

**Environment Variables to Set:**

```
AGILITY_GUID
AGILITY_API_FETCH_KEY
AGILITY_API_PREVIEW_KEY
AGILITY_SECURITY_KEY
AGILITY_LOCALES
AGILITY_SITEMAP
AGILITY_FETCH_CACHE_DURATION
AGILITY_PATH_REVALIDATE_DURATION
```

**Configure Webhooks in Agility CMS:**

- Navigate to **Settings > Webhooks**
- Add webhook URL: `https://your-site.vercel.app/api/revalidate`
- Set trigger: "Content Published"

### Netlify

1. **Push to GitHub**
2. **Import to Netlify** - Connect your repo at [netlify.com](https://netlify.com)
3. **Build Settings**:
   - Build command: `npm run build`
   - Publish directory: `.next`
4. **Environment Variables** - Add your `.env.local` values
5. **Deploy**

### Other Platforms

This starter can deploy to any platform supporting Next.js:

- **AWS Amplify**
- **Digital Ocean App Platform**
- **Railway**
- **Render**

Ensure your platform supports:

- Node.js 18+
- Next.js 15
- On-demand revalidation (optional but recommended)

## 🤖 AI-Powered Development (Vibe Coding)

This starter is designed to work seamlessly with AI coding assistants like **Claude Code**, **GitHub Copilot**, **Cursor**, and **ChatGPT** for rapid development.

### What is Vibe Coding?

"Vibe coding" is the practice of using AI assistants to help you build features by describing what you want in natural language, rather than writing every line of code manually. This starter's comprehensive documentation makes it perfect for AI-assisted development.

### Why This Starter is AI-Ready

1. **Complete Documentation** - All patterns and schemas are documented, giving AI context
2. **Type Safety** - TypeScript interfaces help AI understand data structures
3. **Consistent Patterns** - Clear architectural patterns AI can follow
4. **Example Code** - Real implementations AI can reference

### Getting Started with AI

#### Using Claude Code / Cursor / GitHub Copilot

1. **Open this README in your editor** - AI assistants have full context
2. **Ask natural language questions:**
   - "Add a new component that displays team members in a grid"
   - "Create a contact form component with validation"
   - "Add a hero section with background image support"
   - "Implement multi-locale routing"
3. **AI will:**
   - Reference the documentation
   - Follow existing patterns
   - Create properly typed code
   - Register components correctly

#### Example AI Prompts

**Create a new component:**

```
Create a "TeamGrid" component that:
- Fetches team members from a "teammembers" container
- Displays them in a responsive 3-column grid
- Shows name, title, photo, and bio
- Supports dark mode
- Follows the same patterns as PostsListing
```

**Add a feature:**

```
Add search functionality to the PostsListing component:
- Add a search input at the top
- Filter posts by title/content as user types
- Maintain infinite scroll behavior
- Use client component for interactivity
```

**Extend existing code:**

```
Looking at TextBlockWithImage component, create a similar
"ImageGallery" component that shows multiple images in a grid
with lightbox functionality.
```

### Advanced AI Usage with MCP

This project includes the **Agility CMS MCP Server** configuration in `.vscode/mcp.json`, which gives AI coding assistants (like Claude Code) direct access to your CMS instance through the Model Context Protocol.

**What is MCP?**

MCP (Model Context Protocol) is a standard that allows AI assistants to connect to external services. The Agility MCP Server acts as a bridge between your AI assistant and your Agility CMS instance, providing real-time access to your content structure and data.

**What AI can do with MCP:**

- ✅ **Query content models** - See the exact schema of your Posts, Products, etc.
- ✅ **List content items** - Browse actual content from your CMS
- ✅ **Inspect field types** - Know if a field is text, image, linked content, etc.
- ✅ **Generate accurate interfaces** - Create TypeScript types that match your CMS exactly
- ✅ **Validate component code** - Ensure components use correct field names
- ✅ **Build smart queries** - Create filters based on actual available fields

**Example Workflows with MCP:**

**Creating a new component:**

```
Use the Agility MCP server to get the "Products" content model,
then create:
1. A TypeScript interface (IProduct) with all fields
2. A ProductGrid component with category filtering
3. A domain helper (getProductListing) for data fetching
4. Register the component in the index
```

**Validating existing code:**

```
Query the Agility MCP server for the "TeamMembers" model and
verify that the ITeamMember interface in lib/types/ has all
the correct fields with proper types.
```

**Discovering opportunities:**

```
Use MCP to list all content models in my instance, then
suggest 5 new components I could build based on unused models.
```

**Why MCP Makes AI Development Better:**

| Without MCP                  | With MCP                    |
| ---------------------------- | --------------------------- |
| AI guesses field names       | AI sees exact field names   |
| AI assumes field types       | AI knows actual field types |
| Trial and error fixing typos | Works first time            |
| Generic component templates  | CMS-specific, accurate code |
| Manual schema documentation  | Direct CMS inspection       |

**Getting Started with MCP:**

1. **Ensure `.vscode/mcp.json` exists** - Already configured in this project
2. **Use Claude Code or compatible AI** - MCP is supported by Claude and others
3. **Reference MCP in prompts** - Say "Use the Agility MCP server to..."
4. **Let AI query your CMS** - AI will fetch schemas and data automatically

**MCP Server Configuration:**

The project includes a pre-configured MCP connection:

```json
// .vscode/mcp.json
{
	"servers": {
		"Agility CMS": {
			"url": "https://mcp.agilitycms.com/api/mcp",
			"type": "http"
		}
	}
}
```

This connects to the public Agility MCP server, which requires your API keys (from `.env.local`) to access your specific instance.

**Learn More:**

- [Model Context Protocol](https://modelcontextprotocol.io/)
- [Agility MCP Server Documentation](https://agilitycms.com/docs/mcp) (coming soon)

### Full-Featured Reference

For more advanced examples including AI integration, personalization, and complex patterns, see:

**[Next.js Demo Site 2025](https://github.com/agility/nextjs-demo-site-2025)**

This repository includes:

- AI-powered search with streaming responses
- Multi-locale implementation (3+ languages)
- Personalization system (audience/region targeting)
- A/B testing components
- Advanced caching strategies
- 27+ production-ready components
- Complete documentation for AI assistants

Use it as a reference when asking AI to build advanced features:

```
Looking at the nextjs-demo-site-2025 repo, implement a similar
AI search modal for this project.
```

### Tips for AI-Assisted Development

1. **Reference Documentation** - Point AI to specific docs:

   - "Following docs/ARCHITECTURE.md, add..."
   - "Using patterns from docs/AGILITY-CMS-GUIDE.md, create..."
   - "Based on docs/COMPONENTS.md examples, build..."

2. **Provide Context** - Share your CMS structure:

   - "My 'Products' model has these fields: ..."
   - "I have a container called 'testimonials' with..."

3. **Request Tests** - Ask AI to validate:

   - "Create this component and test it renders correctly"
   - "Add error handling for missing data"

4. **Iterate** - Refine in steps:

   - Start with basic version
   - Add features incrementally
   - Request optimizations

5. **Use Type Safety** - Let AI leverage TypeScript:
   - "Generate the TypeScript interface first"
   - "Ensure all props are properly typed"

### AI Development Workflow

```
1. Describe Feature → AI generates component
   ↓
2. Review Code → AI refines based on feedback
   ↓
3. Create CMS Model → AI generates TypeScript interface
   ↓
4. Register Component → AI updates index file
   ↓
5. Test & Iterate → AI fixes issues
```

This documentation-first approach makes AI assistants highly effective at extending this starter with new features, components, and integrations.

---

## 📚 Advanced Guides

Detailed documentation for specific topics:

- [**QUICK-START-AI.md**](./docs/QUICK-START-AI.md) - **Quick reference for AI assistants** (start here for vibe coding!)
- [**ARCHITECTURE.md**](./docs/ARCHITECTURE.md) - Deep dive into code structure and patterns
- [**AGILITY-CMS-GUIDE.md**](./docs/AGILITY-CMS-GUIDE.md) - CMS integration patterns and best practices
- [**COMPONENTS.md**](./docs/COMPONENTS.md) - Component API reference and usage
- [**CONTENT-MODELS.md**](./docs/CONTENT-MODELS.md) - Complete CMS schema documentation

**AI Assistant Configuration:**

- [`.cursorrules`](./.cursorrules) - Rules for Cursor, Claude Code, and other AI tools (auto-loaded)

## 🛠️ Development

### Development Mode

Shows latest content in real-time (uses Preview API Key):

```bash
npm run dev
```

### Production Mode

Shows published content (uses Live API Key):

```bash
npm run build
npm run start
```

### TypeScript

This project uses TypeScript with strict mode. Type definitions for CMS content are in `lib/types/`.

### Linting

```bash
npm run lint
```

### Code Style

- **ESLint** - Configured with `next/core-web-vitals`
- **Prettier** - (Optional) Add `.prettierrc` for consistent formatting

## 📖 Resources

### Agility CMS

- [Official Website](https://agilitycms.com)
- [Documentation](https://agilitycms.com/docs)
- [Help Center](https://help.agilitycms.com)
- [API Reference](https://agilitycms.com/docs/api)

### Next.js

- [Official Website](https://nextjs.org/)
- [Documentation](https://nextjs.org/docs)
- [App Router](https://nextjs.org/docs/app)
- [Server Components](https://nextjs.org/docs/app/building-your-application/rendering/server-components)

### Community

- [Agility CMS Slack](https://agilitycms.com/join-slack)
- [Blog](https://agilitycms.com/resources/posts)
- [GitHub](https://github.com/agility)
- [LinkedIn](https://www.linkedin.com/company/agilitycms)
- [X (Twitter)](https://x.com/agilitycms)

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 💬 Feedback and Questions

If you have feedback or questions about this starter:

- **GitHub Issues** - [Report bugs or request features](https://github.com/agility/agilitycms-nextjs-starter/issues)
- **Community Slack** - [Join our Slack community](https://agilitycms.com/join-slack)
- **Support** - Email support@agilitycms.com

## 📄 License

This project is licensed under the MIT License.

---

Made with ❤️ by [Agility CMS](https://agilitycms.com)
