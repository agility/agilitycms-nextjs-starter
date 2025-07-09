# Agility CMS & Next.js Starter

This is sample Next.js starter site that uses Agility CMS and aims to be a foundation for building sites using Next.js and Agility CMS.

[Live Website Demo](https://agilitycms-nextjs-starter-blog.vercel.app/)

[New to Agility CMS? Sign up for a FREE account](https://agilitycms.com/free)

## 📢 UPDATED FOR NEXT.JS 15 📢

- We have updated this starter for Next.js 15.0.3. It is built on top of the [@agility/nextjs](https://www.npmjs.com/package/@agility/nextjs) npm package specialized for app router.

### Caching

There are 2 new env var settings that are used to control caching.

- `AGILITY_FETCH_CACHE_DURATION`

  - this setting sets the number of seconds that content items retrieved using the Agility Fetch SDK will be cached as objects.
  - Works best to use this with on-demand invalidation. If your hosting environment doesn't support this, set it to `0` to disable caching, or set it to a low value, like `10` seconds.

- `AGILITY_PATH_REVALIDATE_DURATION`
  - this value controls the `revalidate` export that will tell next.js how long to cache a particular path segment. Set this to a longer value if you are using on-demand revalidation, and a lower value if not, and if your users expect content changes to be reflected earlier.

Agility will NOT cache anything in preview mode :)

#### On Demand Revalidation

- If you are hosting your site on an environment that supports Next.js on-demand revalidation, then you should be using the `AGILITY_FETCH_CACHE_DURATION` value and actively caching items returned from the SDK.
- the revalidation endpoint example is located at `app/api/revalidate/route.ts` and will revalidate the items based on the tags that are used to cache those object.
- The `lib/cms-content` has examples of how to retrieve content while specifying the cache tags for it.

## Changes

This starter now relies on component based data-fetching.

## About This Starter

- Uses our [`@agility/nextjs`](https://www.npmjs.com/package/@agility/nextjs) package to make getting started with Agility CMS and Next.js easy
- Support for Next.js 15.0.3
- Connected to a sample Agility CMS Instance for sample content & pages
- Supports [`next/image`](https://nextjs.org/docs/api-reference/next/image) for image optimization using the `<Image />` component or the next.js `<Image />` component for images that aren't stored in Agility.
- Supports full [Page Management](https://help.agilitycms.com/hc/en-us/articles/360055805831)
- Supports Preview Mode
- Supports the `next/font` package
- Provides a functional structure that dynamically routes each page based on the request, loads Layout Models (Page Templates) dynamically, and also dynamically loads and renders appropriate Agility CMS Components (as React Server Components)
- Supports component level data fetching.

### Tailwind CSS

This starter uses [Tailwind CSS](https://tailwindcss.com/), a simple and lightweight utility-first CSS framework packed with classes that can be composed to build any design, directly in your markup.

### TypeScript

This starter is written in TypeScript, with ESLint.

## Getting Started

To start using the Agility CMS & Next.js Starter, [sign up](https://agilitycms.com/free) for a FREE account and create a new Instance using the Blog Template.

1. Clone this repository
2. Run `npm install` or `yarn install`
3. Rename the `.env.local.example` file to `.env.local`
4. Retrieve your `GUID`, `API Keys (Preview/Fetch)`, and `Security Key` from Agility CMS by going to [Settings > API Keys](https://manager.agilitycms.com/settings/apikeys).

[How to Retrieve your GUID and API Keys from Agility](https://help.agilitycms.com/hc/en-us/articles/360031919212-Retrieving-your-API-Key-s-Guid-and-API-URL-)

## Running the Site Locally

### Development Mode

When running your site in `development` mode, you will see the latest content in real-time from the CMS.

#### yarn

1. `yarn install`
2. `yarn dev`

This will launch the site in development mode, using your preview API key to pull in the latest content from Agility.

#### npm

1. `npm install`
2. `npm run dev`

### Production Mode

When running your site in `production` mode, you will see the published content from Agility.

#### yarn

1. `yarn build`
2. `yarn start`

#### npm

1. `npm run build`
2. `npm run start`

## Accessing Content

You can use the Agility Content Fetch SDK normally - either REST or GraphQL within server components.

## Deploying Your Site

The easiest way to deploy a Next.js website to production is to use [Vercel](https://vercel.com/) from the creators of Next.js, or [Netlify](https:netlify.com). Vercel and Netlify are all-in-one platforms - perfect for Next.js.

## 🤖 Cursor AI Configuration

This starter includes a comprehensive Cursor AI configuration designed to provide expert-level assistance for Agility CMS development. The configuration follows DRY principles and emphasizes code reuse patterns established in this codebase.

### Configuration Files

#### `.cursorrules` (Root Level)
The main Cursor rules file that provides quick reference during active coding:
- **Purpose**: Immediate guidance and workflow instructions
- **Contains**: Core patterns, common mistakes to avoid, essential imports
- **Workflow**: Mandates planning in manifest before implementation
- **Code Quality**: Enforces strong typing and DRY principles

#### `.cursor/project.md` 
Project context and AI agent role definition:
- **AI Role**: Defines Cursor as an "Expert Frontend Developer" for Agility CMS
- **Architecture**: Documents the granular, DRY file structure (20-30 lines per function)
- **Methodology**: 5-phase development workflow (Analysis → Setup → Implementation → Integration → Documentation)
- **Communication**: Sets expectations for asking clarifying questions vs. making assumptions

#### `.cursor/rules.md`
Comprehensive implementation rules and patterns:
- **DRY Principles**: Emphasizes code reuse and avoiding duplication
- **Architecture**: Documents the `/lib/cms` SDK wrapper patterns
- **Type Safety**: Strong typing requirements with `I` prefix conventions
- **Examples**: Good/bad code examples with detailed explanations
- **Performance**: Caching strategies and optimization patterns

#### `.cursor/manifest.md`
Task planning and progress tracking template:
- **Structure**: 5-phase project breakdown with parallel task identification
- **Progress**: Visual indicators (✅ completed, 🔄 in progress, ⚠️ blocked)
- **Decision Tracking**: Documents technical choices and pattern decisions
- **Questions**: Formal process for clarifying unclear requirements

### Key Principles

#### DRY & Code Reuse
- **ALWAYS** check existing code before creating new functions
- **NEVER** duplicate SDK initialization - reuse `getAgilitySDK()`
- **AVOID** bridge functions - extend existing patterns instead
- **ONE** function per file, one interface per file

#### Granular Architecture
```
/lib/cms/              # Core SDK functions (20-30 lines each)
├── getAgilitySDK.ts   # Centralized SDK initialization (reused by all)
├── getContentItem.ts  # Content fetching + caching wrapper
├── getContentList.ts  # List fetching + caching wrapper
└── ...

/lib/types/            # TypeScript definitions (3-15 lines each)
├── IPost.ts           # Single content type interface
├── IAuthor.ts         # Single content type interface
└── ...
```

#### Workflow Methodology

1. **Before Implementation:**
   - Update `.cursor/manifest.md` with analysis and task breakdown
   - Identify tasks that can be executed in parallel
   - Ask clarifying questions for unclear requirements

2. **During Implementation:**
   - Follow established patterns from existing codebase
   - Update manifest with progress after each major step
   - Ensure strong typing and comprehensive error handling

3. **After Implementation:**
   - Validate against original requirements
   - Update manifest with completion status
   - Document any new patterns or architectural decisions

### Strong Typing Requirements

All code must follow these TypeScript patterns:
- **Interface Naming**: Use `I` prefix for content types (`IPost`, `IAuthor`)
- **Generic Usage**: Type-safe patterns (`getContentItem<IPost>()`)
- **Error Handling**: Explicit error handling with graceful degradation
- **Null Safety**: Always handle null/undefined states
- **Data Attributes**: Consistent `data-agility-*` attributes for Web Studio SDK

### Getting Started with Cursor

1. Open the project in Cursor IDE
2. The AI will automatically reference the configuration files
3. For any Agility CMS development task, the AI will:
   - Consult `.cursor/project.md` for context
   - Plan tasks in `.cursor/manifest.md`
   - Reference `.cursor/rules.md` for implementation details
   - Ask clarifying questions instead of making assumptions

### Benefits

- **Expert Guidance**: AI acts as an experienced Agility CMS developer
- **Consistent Patterns**: Follows established codebase architecture
- **DRY Enforcement**: Prevents code duplication and unnecessary abstractions
- **Type Safety**: Ensures comprehensive TypeScript usage
- **Performance**: Optimized caching and component patterns
- **Planning**: Structured approach with progress tracking

This configuration ensures that Cursor AI provides expert-level assistance while maintaining the high-quality, granular architecture that makes this starter both maintainable and performant.

## Resources

### Agility CMS

- [Official site](https://agilitycms.com)
- [Documentation](https://agilitycms.com/docs)

### Next.js

- [Official site](https://nextjs.org/)
- [Documentation](https://nextjs.org/docs/getting-started)

### Vercel

- [Official site](https://vercel.com/)

### Netlify

- [Official site](https://netlify.com/)

### Tailwind CSS

- [Official site](http://tailwindcss.com/)
- [Documentation](http://tailwindcss.com/docs)

### Community

- [Official Slack](https://agilitycms.com/join-slack)
- [Blog](https://agilitycms.com/resources/posts)
- [GitHub](https://github.com/agility)

- [LinkedIn](https://www.linkedin.com/company/agilitycms)
- [X](https://x.com/agilitycms)
- [Facebook](https://www.facebook.com/AgilityCMS/)

## Feedback and Questions

If you have feedback or questions about this starter, please use the [Github Issues](https://github.com/agility/agilitycms-nextjs-starter/issues) on this repo, or join our [Community Slack Channel](https://agilitycms.com/join-slack).
