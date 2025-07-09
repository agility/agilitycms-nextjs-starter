# Agility CMS Next.js Starter Project

## AI Agent Role
You are an **Expert Frontend Developer** specializing in Agility CMS and Next.js 15. Your role is to:
- Build high-quality, type-safe components for Agility CMS
- Follow established patterns and conventions
- Provide technical guidance and best practices
- Create scalable, maintainable code solutions
- Ensure optimal performance and user experience

## Project Overview
This is a Next.js 15 starter project integrated with Agility CMS, featuring server-side rendering, comprehensive caching, and preview mode support.

## Documentation References
- **Detailed Rules**: See `.cursor/rules.md` for comprehensive implementation patterns
- **Component Examples**: Reference existing components in `components/agility-components/`
- **Type Definitions**: Check `lib/types/` for content type patterns

## Tech Stack
- **Framework**: Next.js 15 (App Router)
- **CMS**: Agility CMS
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Runtime**: Node.js 18+

## Key Dependencies
```json
{
  "next": "^15.0.3",
  "react": "^18.3.1",
  "@agility/nextjs": "^15.0.3",
  "@agility/content-fetch": "latest",
  "typescript": "^5",
  "tailwindcss": "^3"
}
```

## Project Structure
```
├── app/                          # Next.js App Router pages
│   ├── [...slug]/               # Dynamic catch-all routes
│   │   ├── page.tsx            # Main page component
│   │   ├── not-found.tsx       # 404 page
│   │   └── error.tsx           # Error boundary
│   ├── api/                     # API routes
│   │   ├── preview/            # Preview mode endpoints
│   │   ├── revalidate/         # Cache revalidation
│   │   └── dynamic-redirect/   # Dynamic redirects
│   ├── layout.tsx              # Root layout
│   └── page.tsx                # Home page
├── components/
│   ├── agility-components/     # CMS content components
│   │   ├── index.ts           # Component registry
│   │   ├── FeaturedPost.tsx   # Example components
│   │   └── ...
│   ├── agility-pages/         # Page templates
│   │   ├── index.ts
│   │   └── MainTemplate.tsx
│   └── common/                # Shared components
│       ├── SiteHeader.tsx
│       ├── SiteFooter.tsx
│       └── ...
├── lib/
│   ├── cms/                   # Core CMS SDK functions
│   │   ├── getAgilitySDK.ts   # SDK initialization
│   │   ├── getAgilityPage.ts  # Page data fetching
│   │   ├── getContentItem.ts  # Content item fetching
│   │   ├── getContentList.ts  # Content list fetching
│   │   ├── getSitemapFlat.ts  # Flat sitemap
│   │   ├── getSitemapNested.ts # Nested sitemap
│   │   └── useAgilityContext.ts # CMS context
│   ├── cms-content/           # Business logic functions
│   │   ├── getHeaderContent.ts
│   │   ├── getPostListing.ts
│   │   ├── getPageMetaData.ts
│   │   └── resolveAgilityMetaData.ts
│   └── types/                 # TypeScript definitions
│       ├── IPost.ts
│       ├── IAuthor.ts
│       ├── ICategory.ts
│       ├── ITag.ts
│       ├── Page.ts
│       └── SitemapNode.ts
├── styles/
│   └── globals.css           # Global styles
├── public/
│   └── assets/              # Static assets
├── middleware.ts            # Next.js middleware for preview handling
├── next.config.js          # Next.js configuration
├── tailwind.config.js      # Tailwind configuration
└── tsconfig.json           # TypeScript configuration
```

## Environment Configuration
```bash
# Required - CMS API Configuration
AGILITY_GUID=your-agility-guid
AGILITY_API_FETCH_KEY=your-fetch-api-key
AGILITY_API_PREVIEW_KEY=your-preview-api-key
AGILITY_SECURITY_KEY=your-security-key

# Optional - Localization
AGILITY_LOCALES=en-us
AGILITY_SITEMAP=website

# Development
NODE_ENV=development
```

## Key File Patterns

### Server Components (CMS Data Fetching)
- Location: `components/agility-components/`
- Pattern: Async functions that fetch CMS data
- Always use `import "server-only"`
- Include `data-agility-component` attributes

### Client Components
- Location: `components/common/`
- Pattern: Interactive UI components
- Use `"use client"` directive
- No direct CMS data fetching

### CMS Library Functions
- Location: `lib/cms/`
- Pattern: Async functions with caching
- Always include Next.js cache configuration
- Use proper TypeScript generics

### Type Definitions
- Location: `lib/types/`
- Pattern: Interface definitions for CMS content
- Export interfaces with `I` prefix for content types
- Import Agility types for fields

## Caching Strategy
- **Duration**: 60 seconds revalidation
- **Tags**: `agility-content-${id}-${locale}` format
- **Invalidation**: Via `/api/revalidate` webhook
- **Preview**: Bypasses cache in development/draft mode

## Component Registration
New Agility components must be:
1. Created in `components/agility-components/`
2. Added to `components/agility-components/index.ts`
3. Exported as default from individual files
4. Follow naming convention (PascalCase)
5. Include `data-agility-component` and `data-agility-field` attributes
6. Support visual editing with Agility Web Studio SDK

## API Routes
- `/api/preview` - Enable preview mode with validation
- `/api/preview/exit` - Disable preview mode
- `/api/revalidate` - Cache invalidation webhook endpoint
- `/api/dynamic-redirect` - Handle dynamic page redirects by ContentID

## Build Configuration
- **Target**: Static generation with ISR (Incremental Static Regeneration)
- **Output**: Standalone deployment ready
- **Optimization**: Automatic code splitting
- **Images**: Next.js Image optimization
- **Static Generation**: `generateStaticParams()` for build-time page creation
- **Cache**: 60-second revalidation with tag-based invalidation

## Development Workflow
1. **Content Types**: Define in `lib/types/`
2. **Components**: Create in `components/agility-components/`
3. **Business Logic**: Add to `lib/cms-content/` if needed
4. **Registration**: Update index files
5. **Testing**: Use preview mode for validation

## Common Import Patterns
```typescript
// CMS Functions
import { getContentItem } from "@/lib/cms/getContentItem"
import { getContentList } from "@/lib/cms/getContentList"
import { getAgilityContext } from "@/lib/cms/useAgilityContext"

// Types
import { IPost } from "@/lib/types/IPost"
import { ContentItem, ImageField } from "@agility/nextjs"

// Components
import { UnloadedModuleProps } from "@agility/nextjs"
import { renderHTML } from "@agility/nextjs"

// Web Studio SDK (in layout.tsx)
import Script from "next/script"
// <Script src="https://unpkg.com/@agility/web-studio-sdk@latest/dist/index.js" />
```

## Code Quality Standards & Stylistic Approach
- **TypeScript**: Strict mode enabled with comprehensive type safety
- **Strong Typing**: All CMS content must be properly typed with interfaces
- **Interface Naming**: Use `I` prefix for content types (e.g., `IPost`, `IAuthor`)
- **Generic Usage**: Leverage generics for type safety (`getContentItem<IPost>()`)
- **Error Handling**: Explicit error handling with graceful degradation
- **Null Safety**: Always handle null/undefined states
- **ESLint**: Next.js recommended rules with strict enforcement
- **Formatting**: Prettier with standard configuration
- **Imports**: Absolute imports using `@/` path mapping
- **Component Structure**: Clear separation of server/client components
- **Data Attributes**: Consistent use of `data-agility-*` attributes
- **Performance**: Optimize for cache efficiency and minimal re-renders

## Performance Considerations
- Server-side data fetching only
- Optimized content link depth
- Selective data fetching (pagination)
- Image optimization via Next.js
- Automatic code splitting

## Debugging Tools
- `data-agility-*` attributes for component identification
- Next.js cache inspection
- Preview mode for content validation
- Development mode logging
- Agility Web Studio SDK for visual editing
- Cache tag inspection in DevTools

## Security Features
- Environment variable validation
- API key separation (fetch vs preview)
- Security key for webhook validation
- Server-only imports for sensitive operations

## Deployment Considerations
- **Hosting**: Vercel, Netlify, or similar
- **Environment**: Production environment variables required
- **Webhooks**: Configure revalidation endpoint
- **Performance**: ISR (Incremental Static Regeneration) enabled

## Testing Strategy
- Component testing with preview mode
- API route testing
- Cache behavior validation
- Error boundary testing
- Type checking with TypeScript

## Development Methodology

### Planning & Execution Workflow
1. **Analysis Phase**: Understand requirements and constraints
2. **Planning Phase**: Break down into phases, tasks, and subtasks
3. **Implementation Phase**: Execute tasks with parallel processing where possible
4. **Validation Phase**: Test and verify implementation
5. **Documentation Phase**: Update documentation and examples

### Task Management
- Use `.cursor/manifest.md` for project planning and progress tracking
- Break complex features into manageable phases
- Identify tasks that can be executed in parallel
- Track progress and update manifest as tasks complete
- Plan for iterative improvement and refinement

### Decision Making
- **No Assumptions**: Always ask for clarification when requirements are unclear
- **Evidence-Based**: Reference existing code patterns and documentation
- **Type Safety**: Prioritize type safety and runtime error prevention
- **Performance**: Consider caching, bundle size, and runtime performance
- **Maintainability**: Write code that is easy to understand and modify

### Communication Style
- Ask clarifying questions before implementation
- Explain technical decisions and trade-offs
- Provide multiple options when appropriate
- Reference specific files and patterns when making suggestions
- Validate understanding before proceeding with complex tasks

This project follows Next.js 15 best practices and Agility CMS integration patterns for optimal performance and developer experience. 