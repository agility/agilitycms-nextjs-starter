# AGENTS.md

Instructions and context for AI coding agents working on the Agility CMS + Next.js Starter.

## Project Overview

This is a production-ready Next.js 15 starter template that integrates with Agility CMS, a headless content management system. The project demonstrates modern React patterns, server-first rendering, and sophisticated caching strategies.

**Stack:** Next.js 15 + React 18 + TypeScript + Agility CMS + Tailwind CSS 4

**Key Characteristics:**

- Content-driven architecture where CMS controls routing and page structure
- Server Components by default (use client components only when needed)
- Three-tier data architecture (Component → Domain → CMS → SDK)
- Multi-layer caching with cache tags for granular invalidation
- Dynamic page generation from CMS sitemap
- Component registry pattern for CMS module mapping

## Dev Environment Tips

### Navigation & Structure

- Use `npm run dev` to start development server (uses Preview API for draft content)
- All pages route through `app/[...slug]/page.tsx` - this is a catch-all route
- Components are in two key locations:
  - `components/agility-components/` - CMS modules (content components)
  - `components/agility-pages/` - Page templates (layout wrappers)
- Don't create individual page files - pages are generated from Agility CMS sitemap

### Finding Things Quickly

- CMS integration code is in `lib/cms/` (generic utilities)
- Domain-specific logic is in `lib/cms-content/` (business logic)
- TypeScript interfaces for CMS content are in `lib/types/`
- API routes are in `app/api/` for webhooks and preview mode
- All documentation is in `docs/` folder

### Component Registration

- **CRITICAL:** New components MUST be registered in `components/agility-components/index.ts`
- Component name in registry MUST match exactly (case-insensitive) with CMS component model name
- If component isn't registered, pages will fail to render

### Environment Variables

- Copy `.env.local.example` to `.env.local` for local development
- Never commit `.env.local` - it contains API keys
- Preview API key shows draft content, Fetch API key shows published only
- Missing env vars will cause build failures

### TypeScript & Linting

- Project uses TypeScript strict mode - all code must be typed
- Run `npm run lint` before committing
- Interfaces for CMS content go in `lib/types/`
- Use `UnloadedModuleProps` type from `@agility/nextjs` for component props

## Architecture Rules

### Server vs Client Components

```typescript
// ✅ Default: Server Component (can fetch data directly)
export default async function MyComponent({module}) {
	const data = await getContentItem({contentID: module.contentid})
	return <div>{data.title}</div>
}

// ⚠️ Only when needed: Client Component (interactive/hooks)
;("use client")
export default function InteractiveComponent() {
	const [state, setState] = useState(0)
	return <button onClick={() => setState(state + 1)}>{state}</button>
}
```

**Rules:**

- Default to server components
- Use client components ONLY for: user interactions, React hooks, browser APIs
- Never fetch data in client components - pass it as props from server component
- Mark files with `"use client"` at the top if they need client-side features

### Data Fetching Layer Pattern

Always follow the three-tier architecture:

```
Component (presentation)
   ↓ calls
Domain Helper (business logic in lib/cms-content/)
   ↓ calls
CMS Utility (generic operations in lib/cms/)
   ↓ calls
Agility SDK
```

**Example:**

```typescript
// ❌ WRONG: Component directly calls SDK
export default async function PostsList() {
  const api = getAgilitySDK({ isPreview: false });
  const posts = await api.getContentList({ ... });
  return <div>...</div>;
}

// ✅ CORRECT: Component calls domain helper
export default async function PostsList() {
  const { posts } = await getPostListing({ take: 10 });
  return <div>...</div>;
}
```

**Why?** Separates concerns, makes code testable, allows business logic to be reused.

### File Naming Conventions

- Components: PascalCase (e.g., `PostsListing.tsx`)
- Server/Client split: `Component.server.tsx` and `Component.client.tsx`
- Utilities: camelCase (e.g., `getContentItem.ts`)
- Types: PascalCase with `I` prefix (e.g., `IPost.ts`)
- API routes: lowercase (e.g., `route.ts`)

## Adding New Features

### Creating a New Component

**Step 1: Create TypeScript interface (if needed)**

```typescript
// lib/types/ITeamMember.ts
export interface ITeamMember {
	contentID: number
	name: string
	title: string
	bio?: string
	photo?: {
		url: string
		label: string
	}
}
```

**Step 2: Create component file**

```typescript
// components/agility-components/TeamGrid.tsx
import {UnloadedModuleProps} from "@agility/nextjs"
import {getContentList} from "@/lib/cms/getContentList"
import {ITeamMember} from "@/lib/types/ITeamMember"
import {AgilityPic} from "@agility/nextjs"

interface ITeamGridModule {
	heading: string
	teamContainer: string // Reference name of team members list
}

export default async function TeamGrid({module, languageCode}: UnloadedModuleProps) {
	const {fields} = module as {fields: ITeamGridModule}

	// Fetch data using CMS utility
	const members = await getContentList<ITeamMember>({
		referenceName: fields.teamContainer || "teammembers",
		languageCode,
	})

	return (
		<section className="py-16 px-8">
			<div className="max-w-7xl mx-auto">
				<h2 className="text-4xl font-bold mb-12 dark:text-white">{fields.heading}</h2>
				<div className="grid grid-cols-1 md:grid-cols-3 gap-8">
					{members.map((member) => (
						<div key={member.contentID} className="bg-white dark:bg-gray-800 rounded-lg p-6">
							{member.photo && (
								<AgilityPic
									image={member.photo}
									fallbackWidth={300}
									className="w-full h-64 object-cover rounded-lg mb-4"
								/>
							)}
							<h3 className="text-xl font-bold dark:text-white">{member.name}</h3>
							<p className="text-gray-600 dark:text-gray-400">{member.title}</p>
						</div>
					))}
				</div>
			</div>
		</section>
	)
}
```

**Step 3: Register component**

```typescript
// components/agility-components/index.ts
import TeamGrid from "./TeamGrid"

const allModules = [
	// ... existing modules
	{name: "TeamGrid", module: TeamGrid},
]
```

**Step 4: Create component model in Agility CMS**

- Name it "TeamGrid" (must match registry name)
- Add fields: `heading` (Text), `teamContainer` (Text)
- Add to a page content zone

### Creating a Domain Helper

When you need business logic for fetching data:

```typescript
// lib/cms-content/getTeamListing.ts
import {getContentList} from "@/lib/cms/getContentList"
import {ITeamMember} from "@/lib/types/ITeamMember"

export async function getTeamListing({
	department,
	take = 50,
	skip = 0,
}: {
	department?: string
	take?: number
	skip?: number
}) {
	const members = await getContentList<ITeamMember>({
		referenceName: "teammembers",
		languageCode: "en-us",
		take,
		skip,
		sort: "fields.name",
		direction: "asc",
		filter: department ? `fields.department[eq]${department}` : undefined,
	})

	// Add computed fields or transformations
	const enrichedMembers = members.map((member) => ({
		...member,
		fullName: `${member.name}, ${member.title}`,
	}))

	return {
		members: enrichedMembers,
		hasMore: members.length === take,
	}
}
```

### Creating a Page Template

When you need a different layout structure:

```typescript
// components/agility-pages/TwoColumnTemplate.tsx
import {ContentZone} from "@agility/nextjs"
import {getModule} from "../agility-components"

export default function TwoColumnTemplate({page}) {
	return (
		<div className="max-w-7xl mx-auto px-8 py-12">
			<div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
				{/* Main content area */}
				<div className="lg:col-span-2">
					<ContentZone name="MainContent" page={page} getModule={getModule} />
				</div>

				{/* Sidebar */}
				<aside className="lg:col-span-1">
					<ContentZone name="Sidebar" page={page} getModule={getModule} />
				</aside>
			</div>
		</div>
	)
}
```

Register it:

```typescript
// components/agility-pages/index.ts
import TwoColumnTemplate from "./TwoColumnTemplate"

export const allPageTemplates = {
	MainTemplate,
	TwoColumnTemplate, // Add this
}
```

## Testing Instructions

### Development Testing

- Run `npm run dev` to test with draft content (uses Preview API)
- Visit `http://localhost:3000` to see site
- Changes to components hot-reload automatically
- Check browser console for React/Next.js errors

### Production Testing

- Run `npm run build` to test production build
- This will catch TypeScript errors and build issues
- Run `npm start` to test built site locally
- Should see published content only (uses Live API)

### Preview Mode Testing

1. Start dev server: `npm run dev`
2. Go to any page in Agility CMS
3. Click "Preview" button
4. Copy preview URL (contains `agilitypreviewkey` param)
5. Replace domain with `http://localhost:3000`
6. Should see draft content with preview bar

### Before Committing

```bash
# Run linter
npm run lint

# Check for TypeScript errors
npm run build

# Test dev server works
npm run dev
# Visit http://localhost:3000 and check pages load
```

**Common Issues:**

- Missing component registration → Page renders blank or shows error
- Wrong API keys → Build fails or shows no content
- TypeScript errors → Build fails with type errors
- Missing cache tags → Content doesn't update after publish

## Styling Guidelines

### Tailwind CSS Usage

- **Always** include dark mode variants: `bg-white dark:bg-gray-900`
- **Always** make responsive: `grid-cols-1 md:grid-cols-2 lg:grid-cols-3`
- Use semantic spacing: `py-16 px-8` for sections, `mb-12` for headings
- Use max-width containers: `max-w-7xl mx-auto`

### Dark Mode Pattern

```typescript
// ✅ Correct
<div className="bg-white dark:bg-gray-900 text-gray-900 dark:text-white">

// ❌ Missing dark mode
<div className="bg-white text-gray-900">
```

### Responsive Pattern

```typescript
// ✅ Correct - mobile first
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3">

// ❌ Desktop only
<div className="grid grid-cols-3">
```

## Common Patterns

### Fetching Single Content Item

```typescript
const item = await getContentItem<IPost>({
	contentID: 123,
	languageCode: "en-us",
})
```

### Fetching Content List

```typescript
const items = await getContentList<IPost>({
	referenceName: "posts",
	languageCode: "en-us",
	take: 10,
	skip: 0,
	sort: "fields.date",
	direction: "desc",
	filter: "fields.category[eq]Technology",
})
```

### Fetching Page Data

```typescript
const page = await getAgilityPage({
	slug: "blog/my-post",
	locale: "en-us",
	sitemap: "website",
})
```

### Using Agility Images

```typescript
import {AgilityPic} from "@agility/nextjs"

;<AgilityPic
	image={fields.image} // { url, label }
	fallbackWidth={800}
	className="rounded-lg"
	alt={fields.image.label}
/>
```

### Conditional Rendering

```typescript
// ✅ Good - handle optional fields
{
	fields.subtitle && <p className="text-gray-600 dark:text-gray-400">{fields.subtitle}</p>
}

// ❌ Bad - will crash if undefined
;<p>{fields.subtitle}</p>
```

## Cache & Performance Notes

### Understanding Cache Layers

1. **Browser Cache** - Automatic via HTTP headers
2. **CDN Edge Cache** - Vercel/Netlify edge
3. **Next.js Route Cache** - ISR (Incremental Static Regeneration)
4. **SDK Cache** - Agility SDK object cache

### Cache Tags

Content fetches are automatically tagged:

- `agility-content-{contentID}-{locale}` - Specific item
- `agility-content-{referenceName}-{locale}` - Content list
- `agility-sitemap-{locale}` - Sitemap

### Invalidation

Webhooks from Agility CMS trigger `revalidateTag()` calls in `/api/revalidate`.

**When adding new content types:**

- Ensure they use cache tags in fetch calls
- Tags are automatic if you use `getContentItem()` or `getContentList()`

### ISR Configuration

Pages revalidate based on:

```typescript
// app/[...slug]/page.tsx
export const revalidate = Number(process.env.AGILITY_PATH_REVALIDATE_DURATION || 60)
```

Lower values = fresher content, more rebuilds
Higher values = better performance, less fresh content

## Error Handling

### Component Error Handling

```typescript
export default async function MyComponent({module}) {
	try {
		const data = await getContentItem({contentID: module.contentid})

		if (!data) {
			return <div>No content found</div>
		}

		return <div>{data.title}</div>
	} catch (error) {
		console.error("Error fetching content:", error)
		return <div>Error loading content</div>
	}
}
```

### Error Boundaries

Next.js provides automatic error boundaries:

- `app/[...slug]/error.tsx` - Catches rendering errors
- `app/[...slug]/not-found.tsx` - Handles 404s

## Security Notes

### API Keys

- **Never** commit `.env.local` file
- **Never** expose API keys in client-side code
- Use environment variables for all sensitive data
- Preview API key has broader access - use only in dev/preview

### Preview Mode

- Preview key validates webhook requests
- Only enable draft mode after key validation
- Preview mode cookie should expire on browser close

## Documentation Reference

Full documentation available in `docs/` folder:

- **QUICK-START-AI.md** - Quick reference for AI assistants (start here!)
- **GETTING-STARTED.md** - Complete setup and getting started guide
- **HOW-IT-WORKS.md** - Architecture and how everything fits together
- **ARCHITECTURE.md** - Deep technical architecture details
- **COMPONENTS.md** - Component API reference and examples
- **CONTENT-MODELS.md** - CMS content model schemas
- **AGILITY-CMS-GUIDE.md** - CMS integration patterns and best practices

## Using the Agility CMS MCP Server

### What is MCP?

The **Model Context Protocol (MCP)** is a standard that allows AI coding assistants to connect directly to external services. This project includes the **Agility CMS MCP Server** configuration in `.vscode/mcp.json`, which gives AI agents direct access to your Agility CMS instance.

### Benefits for AI Agents

With MCP enabled, AI agents can:

1. **Query content models directly** - Inspect your exact CMS schema without guessing
2. **List all content items** - See real content data from your instance
3. **Understand field types** - Know if a field is text, image, linked content, etc.
4. **Generate accurate TypeScript interfaces** - Create types that match your CMS exactly
5. **Validate component design** - Ensure components match available CMS fields
6. **Create intelligent queries** - Build correct filters and sorts based on actual fields

### How to Use MCP (For AI Agents)

**When the MCP server is available, you should:**

1. **Always check content models before creating components:**

   ```
   Use the Agility MCP server to get the schema for the "Posts" content model,
   then create a TypeScript interface for it.
   ```

2. **Validate field names and types:**

   ```
   Query the Agility MCP server for the "TeamMembers" model and confirm
   it has a "photo" field before using it in the component.
   ```

3. **Discover available content:**

   ```
   Use MCP to list all content models in this instance,
   then suggest which ones would be good for a new component.
   ```

4. **Generate accurate code:**
   ```
   Query the Agility MCP server for the "Products" content model,
   generate the IProduct interface, then create a ProductGrid component.
   ```

### Common MCP Workflows

**Workflow 1: Creating a New Component**

```
1. AI: Query MCP for content model schema
2. AI: Generate TypeScript interface from schema
3. AI: Create component that uses correct field names
4. AI: Register component
5. Result: Component works first time, no field name typos
```

**Workflow 2: Understanding the CMS Structure**

```
1. AI: Query MCP for all available models
2. AI: Query MCP for all content containers
3. AI: Analyze which models are being used
4. AI: Suggest new components based on underutilized content
```

**Workflow 3: Building Complex Queries**

```
1. AI: Query MCP for model schema
2. AI: Identify filterable fields (category, date, etc.)
3. AI: Build domain helper with correct filter syntax
4. AI: Create component with filtering options
```

### MCP-Aware Prompt Examples

**Creating a component:**

```
Use the Agility MCP server to get the "TeamMembers" content model,
then create:
1. TypeScript interface (ITeamMember) with all fields
2. TeamGrid component that displays them in a 3-column layout
3. Domain helper (getTeamListing) with department filtering
4. Register the component in index.ts
```

**Validating existing code:**

```
Query the Agility MCP server for the "Posts" model and compare
it to the IPost interface in lib/types/IPost.ts. Are there any
missing or incorrectly typed fields?
```

**Discovering opportunities:**

```
Use MCP to list all content models in the instance, then analyze
which ones don't have corresponding components yet. Suggest
5 new components we could build.
```

### When MCP is Not Available

If the MCP server connection isn't working:

1. **Refer to existing interfaces** in `lib/types/` as examples
2. **Check content model documentation** in `docs/CONTENT-MODELS.md`
3. **Ask the user** to describe the content model fields
4. **Use existing components** as patterns for similar content types

### Verification

After using MCP to generate code, verify:

- [ ] Field names match CMS exactly (case-sensitive)
- [ ] Optional fields use `?` in TypeScript
- [ ] Image fields use `{ url: string; label: string }` type
- [ ] Linked content fields reference correct types
- [ ] Component is registered in index.ts

## External Resources

- **Agility CMS Docs:** https://agilitycms.com/docs
- **Next.js 15 Docs:** https://nextjs.org/docs
- **Next.js App Router:** https://nextjs.org/docs/app
- **Tailwind CSS:** https://tailwindcss.com/docs
- **MCP Documentation:** https://modelcontextprotocol.io/

## Advanced Reference

For more complex features and patterns, reference:

**Next.js Demo Site 2025:** https://github.com/agility/nextjs-demo-site-2025

Includes:

- AI search with streaming
- Multi-locale implementation
- Personalization system
- A/B testing
- 27+ production components

Use when implementing advanced features:

```
Looking at nextjs-demo-site-2025's SearchModal component,
implement similar AI search for this project.
```

## Common Pitfalls

### 1. Forgetting Component Registration

**Symptom:** Component doesn't render, shows blank or error
**Fix:** Add to `components/agility-components/index.ts`

### 2. Wrong Component Name

**Symptom:** Component registered but doesn't render
**Fix:** Component name must exactly match CMS component model name (case-insensitive)

### 3. Client Component Everywhere

**Symptom:** Large bundle size, slow performance
**Fix:** Use server components by default, client only when needed

### 4. Skipping Data Layers

**Symptom:** Duplicated logic, hard to test
**Fix:** Follow three-tier pattern: Component → Domain → CMS → SDK

### 5. Missing Dark Mode

**Symptom:** Looks broken in dark mode
**Fix:** Add `dark:` variants to all color classes

### 6. Not Handling Undefined

**Symptom:** Runtime errors for missing fields
**Fix:** Use optional chaining and conditional rendering

### 7. Wrong API Key Environment

**Symptom:** Draft content in production or vice versa
**Fix:** Check `AGILITY_API_FETCH_KEY` vs `AGILITY_API_PREVIEW_KEY` usage

## Quick Command Reference

```bash
# Development
npm run dev              # Start dev server (draft content)

# Production
npm run build            # Build for production
npm start                # Start production server

# Linting
npm run lint             # Run ESLint

# Azure Static Web Apps
npm run build-swa        # Build without cache (for Azure)
```

## Contact

- **Issues:** https://github.com/agility/agilitycms-nextjs-starter/issues
- **Slack:** https://agilitycms.com/join-slack
- **Support:** support@agilitycms.com
