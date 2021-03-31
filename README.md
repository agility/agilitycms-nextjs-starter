# Agility CMS & Next.js Starter

This is sample Next.js starter site that uses Agility CMS and aims to be a foundation for building fully static sites using Next.js and Agility CMS.

Live Website Demo

New to Agility CMS? Sign up for a FREE account.

## About This Starter
- Uses our [`@agility/next`](https://github.com/agility/agility-next) package to make getting started with Agility CMS and Next.js easy
- Connected to a sample Agility CMS Instance for sample content & pages
- Uses the `getStaticProps` function from Next.js to allow for full SSG (Static Site Generation)
- Supports [`next/image`](https://nextjs.org/docs/api-reference/next/image) for image optimization
- Supports full [Page Management](https://help.agilitycms.com/hc/en-us/articles/360055805831)
- Supports Preview Mode
- Uses `revalidate` tag with Vercel to enable [ISR (Incremental Static Regeneration)](https://nextjs.org/docs/basic-features/data-fetching#incremental-static-regeneration) builds
- Provides a functional structure that dynamically routes each page based on the request, loads a Page Templates dynamically, and also dynamically loads and renders appropriate Agility CMS Page Modules (as React components)

### Tailwind CSS
This starter uses [Tailwind CSS](https://tailwindcss.com/), a simple and lightweight utility-first CSS framework packed with classes that can be composed to build any design, directly in your markup.

It also comes equipped with Autoprefixer, a plugin which use the data based on current browser popularity and property support to apply CSS prefixes for you.

### TypeScript
This starter supports [TypeScript](https://nextjs.org/docs/basic-features/typescript) out of the box. If you would like to use TypeScript in your project, simply rename your files with a `.ts` extension to start taking advantage of Typescript concepts such as types and interfaces to help describe your data.

## Getting Started
Sign up for the Agility CMS Blog Template

1. Clone this repository
2. Run `npm install` or `yarn install`
3. Rename the `.env.local.example` file to `.env.local`
4. Retrieve your `GUID`, `API Keys (Preview/Fetch)`, and `Security Key` from Agility CMS

[How to Retrieve your GUID and API Keys from Agility](https://help.agilitycms.com/hc/en-us/articles/360031919212-Retrieving-your-API-Key-s-Guid-and-API-URL-)

## Running the Site Locally

### Development Mode

When running your site in `development` mode, you will see the latest content in real-time from the CMS.

#### yarn
1. `yarn install`
2. `yarn dev`

To update content locally without restarting your dev server, run `yarn cms-pull`

To clear your content cache locally, run `yarn cms-clear`

#### npm
1. `npm install`
2. `npm run dev`

To update content locally without restarting your dev server, run `npm run cms-pull`

To clear your content cache locally, run `npm run cms-clear`

### Production Mode

When running your site in `production` mode, you will see the published from the CMS.

#### yarn
1. `yarn build`
2. `yarn start`

#### npm
`npm run build`
`npm run start`

## Deploying Your Site
The easiest way to deploy a Next.js website to production is to use [Vercel](http://vercel.com/) from the creators of Next.js. Vercel is an all-in-one platform with Global CDN supporting static & Jamstack deployment and Serverless Functions. 

<a href="https://vercel.com/new/git/external?repository-url=https%3A%2F%2Fgithub.com%2Fjoshua-isaac%2Fagility-nextjs-starter"><img src="https://vercel.com/button" alt="Deploy with Vercel"/></a>

👆 By clicking the button above, you can get this starter repo deployed with a Preview Environment within minutes! It will prompt you to enter your `AGILITY_GUID`, `AGILITY_API_FETCH_KEY`, `AGILITY_API_PREVIEW_KEY` and your `AGILITY_SECURITY_KEY`.
