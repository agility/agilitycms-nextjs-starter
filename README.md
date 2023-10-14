# Agility CMS & Next.js Starter

This is sample Next.js starter site that uses Agility CMS and aims to be a foundation for building fully static sites using Next.js and Agility CMS.

[Live Website Demo](https://agilitycms-nextjs-starter-blog.vercel.app/)

[New to Agility CMS? Sign up for a FREE account](https://agilitycms.com/free)

## 📢 UPDATED FOR NEXT.JS 13.5 📢

- We have updated this starter for Next.js 13. It is using a pre-release version of the [@agility/nextjs](https://www.npmjs.com/package/@agility/nextjs) npm package specialized for app router.

## About This Starter

- Uses our [`@agility/nextjs`](https://www.npmjs.com/package/@agility/nextjs) package to make getting started with Agility CMS and Next.js easy
- Support for Next.js 13 and React 18
- Connected to a sample Agility CMS Instance for sample content & pages
- Uses the `getStaticProps` function from Next.js to allow for full SSG (Static Site Generation)
- Supports [`next/image`](https://nextjs.org/docs/api-reference/next/image) for image optimization using the `<Image />` component or the next.js `<Image />` component for images that aren't stored in Agility.
- Supports full [Page Management](https://help.agilitycms.com/hc/en-us/articles/360055805831)
- Supports Preview Mode
- Supports the `next/font` package
- Uses the `revalidate` and `fallback` properties to enable [ISR (Incremental Static Regeneration)](https://nextjs.org/docs/basic-features/data-fetching#incremental-static-regeneration) builds
- Provides a functional structure that dynamically routes each page based on the request, loads a Page Templates dynamically, and also dynamically loads and renders appropriate Agility CMS Page Modules (as React components)
- Supports component level data fetching.

### Tailwind CSS

This starter uses [Tailwind CSS](https://tailwindcss.com/), a simple and lightweight utility-first CSS framework packed with classes that can be composed to build any design, directly in your markup.

It also comes equipped with [Autoprefixer](https://www.npmjs.com/package/autoprefixer), a plugin which use the data based on current browser popularity and property support to apply CSS prefixes for you.

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
