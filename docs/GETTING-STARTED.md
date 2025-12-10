# Getting Started with Agility CMS + Next.js Starter

A complete guide to setting up and running your Agility CMS + Next.js website locally and deploying to production.

## Table of Contents

- [Prerequisites](#prerequisites)
- [Quick Start](#quick-start)
- [Local Development](#local-development)
- [Understanding the Project](#understanding-the-project)
- [Deployment Options](#deployment-options)
- [Setting Up Preview Mode](#setting-up-preview-mode)
- [Next Steps](#next-steps)
- [Troubleshooting](#troubleshooting)

## Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js 20.x or higher** - [Download Node.js](https://nodejs.org/)
- **npm or yarn** - Package manager (comes with Node.js)
- **Git** - [Download Git](https://git-scm.com/)
- **Agility CMS Account** - [Sign up for free](https://account.agilitycms.com/sign-up)

## Quick Start

### Option 1: Deploy to Vercel First (Recommended)

The fastest way to get started is to deploy first, then clone and work locally:

1. **Log in to your Agility CMS instance**

2. **Navigate to Settings > Deployment**

3. **Click "Setup Deployment" for Vercel**

4. **Follow the automated deployment wizard**

   - Authorize the Agility Integration with Vercel
   - Select or create a Git repository
   - Vercel will automatically:
     - Clone this starter template
     - Set up environment variables
     - Deploy your site
     - Configure preview and production domains

5. **Clone your repository locally**

   ```bash
   git clone https://github.com/YOUR-USERNAME/YOUR-REPO-NAME.git
   cd YOUR-REPO-NAME
   npm install
   ```

6. **Copy environment variables from Vercel**
   - Go to your Vercel project settings
   - Copy the `.env.local` tab
   - Or manually create `.env.local` (see below)

### Option 2: Start Locally First

If you prefer to start with local development:

1. **Clone this repository**

   ```bash
   git clone https://github.com/agility/agilitycms-nextjs-starter.git
   cd agilitycms-nextjs-starter
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Get your Agility CMS credentials**

   - Log in to [Agility CMS](https://manager.agilitycms.com/)
   - Go to **Settings > API Keys**
   - Copy the following values:
     - **GUID** - Your instance identifier
     - **Live API Key** - For production content
     - **Preview API Key** - For draft content
     - **Security Key** - For webhooks and previews

4. **Create your environment file**

   Copy `.env.local.example` to `.env.local`:

   ```bash
   cp .env.local.example .env.local
   ```

   Then edit `.env.local` with your credentials:

   ```env
   # Your Agility CMS Instance GUID
   AGILITY_GUID=your-guid-here

   # API Keys (from Settings > API Keys)
   AGILITY_API_FETCH_KEY=your-live-api-key
   AGILITY_API_PREVIEW_KEY=your-preview-api-key

   # Security Key (for webhooks and preview mode)
   AGILITY_SECURITY_KEY=your-security-key

   # Locales (comma-separated list, first is default)
   AGILITY_LOCALES=en-us

   # Sitemap reference name (usually 'website')
   AGILITY_SITEMAP=website

   # Cache durations (in seconds)
   AGILITY_FETCH_CACHE_DURATION=120
   AGILITY_PATH_REVALIDATE_DURATION=60
   ```

5. **Run the development server**

   ```bash
   npm run dev
   ```

6. **Open your browser**

   Navigate to [http://localhost:3000](http://localhost:3000)

   You should see your site with the sample content from your Agility instance!

## Local Development

### Development Server

Start the Next.js development server:

```bash
npm run dev
```

**Features in dev mode:**

- Hot module replacement (changes appear instantly)
- Real-time error reporting
- Source maps for debugging
- Draft content visible (uses Preview API Key)

### Building for Production

Test a production build locally:

```bash
# Build the site
npm run build

# Start the production server
npm start
```

The build process will:

1. Generate static pages from your Agility sitemap
2. Optimize images and assets
3. Create optimized JavaScript bundles
4. Output to `.next/` directory

### Project Structure

```
agilitycms-nextjs-starter/
├── app/                          # Next.js App Router
│   ├── layout.tsx               # Root layout (header, footer)
│   ├── page.tsx                 # Homepage
│   ├── [...slug]/               # Dynamic catch-all route
│   │   ├── page.tsx            # Page renderer
│   │   ├── error.tsx           # Error boundary
│   │   └── not-found.tsx       # 404 page
│   └── api/                     # API routes
│       ├── preview/             # Preview mode activation
│       ├── revalidate/          # Webhook handler
│       └── dynamic-redirect/    # ContentID redirects
│
├── components/
│   ├── agility-components/      # CMS modules (registered)
│   │   ├── index.ts            # Module registry
│   │   ├── Heading.tsx
│   │   ├── RichTextArea.tsx
│   │   ├── PostsListing/
│   │   └── ...
│   ├── agility-pages/           # Page templates
│   │   ├── index.ts            # Template registry
│   │   └── MainTemplate.tsx
│   └── common/                  # Shared UI components
│       ├── SiteHeader.tsx
│       ├── SiteFooter.tsx
│       ├── PreviewBar.tsx
│       └── ...
│
├── lib/
│   ├── cms/                     # Generic CMS utilities
│   │   ├── getAgilitySDK.ts
│   │   ├── getContentItem.ts
│   │   ├── getContentList.ts
│   │   └── ...
│   ├── cms-content/             # Domain-specific queries
│   │   ├── getPostListing.ts
│   │   ├── getHeaderContent.ts
│   │   └── ...
│   └── types/                   # TypeScript interfaces
│       ├── IPost.ts
│       ├── IAuthor.ts
│       └── ...
│
├── docs/                        # Documentation
├── public/                      # Static assets
├── styles/                      # Global styles
└── middleware.ts                # Middleware (preview mode)
```

### Key Files Explained

| File                                     | Purpose                                  |
| ---------------------------------------- | ---------------------------------------- |
| `app/[...slug]/page.tsx`                 | Renders all content pages dynamically    |
| `components/agility-components/index.ts` | Registers CMS modules → React components |
| `components/agility-pages/index.ts`      | Registers page templates                 |
| `lib/cms/getAgilityPage.ts`              | Fetches complete page with layout        |
| `middleware.ts`                          | Handles preview mode and redirects       |
| `.env.local`                             | Environment variables (not committed)    |

## Understanding the Project

### How Pages Are Generated

1. **Agility CMS manages your sitemap**

   - Editors create pages in the CMS
   - Each page has a URL, template, and content zones

2. **Build time: Static Generation**

   ```typescript
   // app/[...slug]/page.tsx
   export async function generateStaticParams() {
   	// Fetches all pages from Agility CMS
   	const sitemap = await getSitemapFlat({languageCode: "en-us"})

   	// Returns paths: ['/', '/about', '/blog', '/blog/post-1', ...]
   	return sitemap.map((node) => ({
   		slug: node.pagePath.split("/").filter(Boolean),
   	}))
   }
   ```

3. **Next.js generates HTML for each path**

   - `/` → `index.html`
   - `/about` → `about.html`
   - `/blog/post-1` → `blog/post-1.html`

4. **Runtime: Page Rendering**

   ```typescript
   export default async function Page({params}) {
   	// Get page data from Agility
   	const page = await getAgilityPage({
   		slug: params.slug.join("/"),
   	})

   	// Render appropriate template
   	const Template = getPageTemplate(page.templateName)
   	return <Template page={page} />
   }
   ```

### How Components Work

**In Agility CMS:**

- Create a "Component Model" (e.g., "Heading")
- Define fields (e.g., "title", "subtitle")
- Add to pages via content zones

**In Next.js:**

- Create React component: `components/agility-components/Heading.tsx`
- Register in `components/agility-components/index.ts`
- Component automatically renders when added to pages

**Example:**

```typescript
// components/agility-components/Heading.tsx
import {UnloadedModuleProps} from "@agility/nextjs"

interface IHeadingModule {
	title: string
	subtitle?: string
}

export default async function Heading({module}: UnloadedModuleProps) {
	const {fields} = module as {fields: IHeadingModule}

	return (
		<section className="py-12">
			<h1 className="text-5xl font-bold dark:text-white">{fields.title}</h1>
			{fields.subtitle && <p className="text-xl text-gray-600 dark:text-gray-400">{fields.subtitle}</p>}
		</section>
	)
}
```

### Data Fetching Pattern

This starter uses a three-tier architecture:

```
Component
  ↓
Domain Helper (lib/cms-content/)
  ↓
CMS Utility (lib/cms/)
  ↓
Agility SDK
```

**Example:**

```typescript
// Component
const posts = await getPostListing({take: 10})

// Domain Helper (lib/cms-content/getPostListing.ts)
export async function getPostListing({take, skip}) {
	const posts = await getContentList({
		referenceName: "posts",
		take,
		skip,
	})

	// Add computed fields (URLs, etc.)
	return {posts: postsWithUrls}
}

// CMS Utility (lib/cms/getContentList.ts)
export async function getContentList({referenceName}) {
	const api = getAgilitySDK({isPreview})
	return await api.getContentList({referenceName})
}
```

## Deployment Options

### Vercel (Recommended)

**Why Vercel?**

- Built by Next.js creators
- Zero-config deployments
- Automatic HTTPS
- Global CDN
- Instant rollbacks
- Built-in analytics

**Deploy via Agility Integration:**

1. Go to Agility CMS > **Settings > Deployment**
2. Click "Setup Deployment" for Vercel
3. Follow the wizard (autorizes, sets env vars, deploys)
4. Done! Your site is live.

**Manual Vercel Deployment:**

1. Push your code to GitHub
2. Go to [vercel.com/new](https://vercel.com/new)
3. Import your repository
4. Add environment variables:
   - `AGILITY_GUID`
   - `AGILITY_API_FETCH_KEY`
   - `AGILITY_API_PREVIEW_KEY`
   - `AGILITY_SECURITY_KEY`
   - `AGILITY_LOCALES`
   - `AGILITY_SITEMAP`
5. Click "Deploy"

**Setup Webhooks:**

1. After deployment, copy your site URL
2. In Agility: **Settings > Webhooks > Add Webhook**
3. URL: `https://your-site.vercel.app/api/revalidate`
4. Events: "Content Published", "Content Deleted", "Page Modified"
5. Add header: `x-agility-webhook-secret: YOUR_AGILITY_SECURITY_KEY`

### Azure Static Web Apps

This starter includes a GitHub Actions workflow for Azure Static Web Apps.

**Deployment Steps:**

1. **Create Azure Static Web App**

   - Go to [Azure Portal](https://portal.azure.com/)
   - Create new Static Web App
   - Connect to your GitHub repository
   - Framework: Next.js
   - Output location: `.next`

2. **Configure Build**

   The included workflow at `.github/workflows/azure-static-web-apps-wonderful-meadow-008797210.yml` handles:

   - Building with `npm run build-swa`
   - Setting environment variables
   - Deploying to Azure

3. **Set Repository Secrets**

   In GitHub: **Settings > Secrets and variables > Actions**

   Add:

   - `AZURE_STATIC_WEB_APPS_API_TOKEN_WONDERFUL_MEADOW_008797210` (from Azure)
   - `AGILITY_API_FETCH_KEY`

   And Variables:

   - `AGILITY_GUID`
   - `AGILITY_LOCALES`
   - `AGILITY_SITEMAP`

4. **Setup Webhooks**

   In Agility CMS: **Settings > Webhooks**

   - URL: `https://your-site.azurestaticapps.net/api/revalidate`
   - Same configuration as Vercel

### Netlify

**Deploy to Netlify:**

1. Push code to GitHub
2. Go to [app.netlify.com/start](https://app.netlify.com/start)
3. Import your repository
4. Build settings:
   - Build command: `npm run build`
   - Publish directory: `.next`
5. Add environment variables (same as Vercel)
6. Deploy

**Setup Webhooks:**
Same process as Vercel, using your Netlify URL.

### Self-Hosted

You can deploy to any Node.js hosting:

```bash
npm run build
npm start
```

Requires:

- Node.js 20+ runtime
- Environment variables configured
- Reverse proxy (nginx, Apache)

## Setting Up Preview Mode

Preview mode allows editors to see draft content before publishing.

### 1. Configure in Agility CMS

**Settings > Deployment:**

1. Set **Preview Domain**: `https://your-site.vercel.app`
2. Set **Production Domain**: `https://your-site.com` (or Vercel URL)
3. Save changes

### 2. How Preview Works

```
Editor clicks "Preview" in CMS
   ↓
Request: /page?agilitypreviewkey=SECRET&ContentID=123
   ↓
Middleware intercepts → /api/preview
   ↓
API validates key, enables draft mode
   ↓
Redirects to actual page URL
   ↓
Page renders with draft content
   ↓
Preview bar appears at top
```

### 3. Testing Preview Locally

1. Start dev server: `npm run dev`

2. Get a preview URL from any page in Agility CMS

3. Replace the domain:

   ```
   https://your-site.com/about?agilitypreviewkey=...&ContentID=123

   becomes

   http://localhost:3000/about?agilitypreviewkey=...&ContentID=123
   ```

4. You should see:
   - Draft content visible
   - Preview bar at top
   - "Exit Preview" button

### 4. Exit Preview

Click "Exit Preview" in the preview bar, or visit:

```
http://localhost:3000/api/preview/exit
```

## Next Steps

### For Content Editors

- **Create pages**: Add pages via Agility CMS sitemap
- **Add content**: Use page modules to build your pages
- **Preview changes**: Click "Preview" before publishing
- **Publish**: Click "Publish" to make changes live

### For Developers

1. **Read the architecture docs**: [ARCHITECTURE.md](./ARCHITECTURE.md)
2. **Create your first component**: [COMPONENTS.md](./COMPONENTS.md)
3. **Understand content models**: [CONTENT-MODELS.md](./CONTENT-MODELS.md)
4. **AI development guide**: [QUICK-START-AI.md](./QUICK-START-AI.md)

### Customize Your Site

**Add a new component:**

```bash
# 1. Create component
touch components/agility-components/MyComponent.tsx

# 2. Register component
# Edit components/agility-components/index.ts

# 3. Create component model in Agility CMS
# Match the reference name to "MyComponent"
```

**Add a new content model:**

```typescript
// 1. Define interface
// lib/types/IMyModel.ts
export interface IMyModel {
	contentID: number
	title: string
	// ... fields
}

// 2. Create helper
// lib/cms-content/getMyData.ts
export async function getMyData() {
	return await getContentList<IMyModel>({
		referenceName: "mymodel",
	})
}
```

**Customize styling:**

- Edit `styles/globals.css` for global styles
- Use Tailwind classes in components
- Modify `tailwind.config.js` for theme customization

## Troubleshooting

### Build Errors

**Error: "Missing environment variables"**

- Check `.env.local` file exists
- Verify all required variables are set
- Restart dev server after changes

**Error: "Invalid API Key"**

- Double-check API keys in Agility CMS
- Ensure you're using the correct instance GUID
- Try copying keys again (no extra spaces)

**Error: "Module not found"**

- Run `npm install` to ensure dependencies are installed
- Clear Next.js cache: `rm -rf .next`
- Rebuild: `npm run build`

### Preview Mode Issues

**Preview not working:**

- Verify `AGILITY_SECURITY_KEY` is set correctly
- Check preview domain is configured in Agility CMS
- Test with full URL including `agilitypreviewkey` param
- Check browser console for errors

**Can't exit preview mode:**

- Visit `/api/preview/exit` directly
- Clear browser cookies
- Try incognito/private window

### Content Not Updating

**Changes not appearing:**

- Check if webhooks are configured (production only)
- In development: Stop and restart `npm run dev`
- Verify content is Published (not just saved)
- Check cache duration settings in `.env.local`

**Old content still showing:**

- Trigger manual revalidation: `/api/revalidate` (POST)
- Clear Vercel cache (in Vercel dashboard)
- Wait for `revalidate` duration to expire
- Check webhook logs in Agility CMS

### Performance Issues

**Slow build times:**

- Reduce number of pages being generated
- Check for duplicate API calls
- Review component complexity
- Consider incremental builds (ISR)

**Slow page loads:**

- Optimize images (use `<AgilityPic>`)
- Check bundle size: `npm run build` (see output)
- Review client-side JavaScript
- Use React Server Components when possible

### Getting Help

- **Documentation**: Check the `/docs` folder
- **Agility CMS Support**: [help.agilitycms.com](https://help.agilitycms.com)
- **GitHub Issues**: [github.com/agility/agilitycms-nextjs-starter/issues](https://github.com/agility/agilitycms-nextjs-starter/issues)
- **Community Slack**: [Join Agility Community](https://agilitycms.com/community)
- **Next.js Docs**: [nextjs.org/docs](https://nextjs.org/docs)

---

**Ready to build?** Start by creating your first component! See [COMPONENTS.md](./COMPONENTS.md) for a step-by-step guide.
