# Agility CMS & Next.js Starter

This is sample Next.js starter site that uses Agility CMS and aims to be a foundation for building fully static sites using Next.js and Agility CMS.

Live Website Demo

New to Agility CMS? Sign up for a FREE account.

## About This Starter
- Uses our [`@agility/next`](https://github.com/agility/agility-next) package to make getting started with Agility CMS and Next.js easy
- Connected to a sample Agility CMS Instance for sample content & pages
- Uses the `getStaticProps` function from Next.js to allow for full SSG (Static Site Generation)
- Supports full [Page Management](https://help.agilitycms.com/hc/en-us/articles/360055805831)
- Supports Preview Mode
- Uses `revalidate` tag with Vercel to enable [ISR (Incremental Static Regeneration)](https://nextjs.org/docs/basic-features/data-fetching#incremental-static-regeneration) builds
- Provides a functional structure that dynamically routes each page based on the request, loads a Page Templates dynamically, and also dynamically loads and renders appropriate Agility CMS Page Modules (as React components)

### Tailwind CSS
This starter uses [Tailwind CSS](https://tailwindcss.com/), a simple and lightweight utility-first CSS framework packed with classes that can be composed to build any design, directly in your markup.

### Typescript
This starter supports TypeScript out of the box. Simply rename your files with a `.ts` extension to start taking advantage of Typescript concepts such as types and interfaces to describe your data.
