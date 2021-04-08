# Agility CMS & Next.js Starter

This is sample Next.js starter site that uses Agility CMS and aims to be a foundation for building fully static sites using Next.js and Agility CMS.

[Live Website Demo](https://agilitycms-nextjs-starter-blog.vercel.app/)

[New to Agility CMS? Sign up for a FREE account](https://agilitycms.com/free)

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

It also comes equipped with [Autoprefixer](https://www.npmjs.com/package/autoprefixer), a plugin which use the data based on current browser popularity and property support to apply CSS prefixes for you.

### TypeScript

This starter supports [TypeScript](https://nextjs.org/docs/basic-features/typescript) out of the box. If you would like to use TypeScript in your project, simply rename your files with a `.ts` extension to start taking advantage of Typescript concepts such as types and interfaces to help describe your data.

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

1. `npm run build`
2. `npm run start`

## Deploying Your Site

The easiest way to deploy a Next.js website to production is to use [Vercel](http://vercel.com/) from the creators of Next.js. Vercel is an all-in-one platform with Global CDN supporting static & Jamstack deployment and Serverless Functions.

<a href="https://vercel.com/new/git/external?repository-url=https%3A%2F%2Fgithub.com%2Fjoshua-isaac%2Fagility-nextjs-starter"><img src="https://vercel.com/button" alt="Deploy with Vercel"/></a>

By clicking the button above, you can get this starter repo deployed to Vercel with a Preview Environment within minutes! It will prompt you to enter your `AGILITY_GUID`, `AGILITY_API_FETCH_KEY`, `AGILITY_API_PREVIEW_KEY` and your `AGILITY_SECURITY_KEY`.

## Notes

### How to Register Page Modules

1. To create a new Page Module, create a new React component within the `/components/agility-pageModules` directory.
2. All of the Page Modules that are being used within the site need to be imported into the `index` file within the `/components/agility-pageModules` directory and added to the `allModules` array:

```
import RichTextArea from "./RichTextArea";
import FeaturedPost from "./FeaturedPost";
import PostsListing from "./PostsListing";
import PostDetails from "./PostDetails";
import Heading from "./Heading";
import TextBlockWithImage from "./TextBlockWithImage";

const allModules = [
  { name: "TextBlockWithImage", module: TextBlockWithImage },
  { name: "Heading", module: Heading },
  { name: "FeaturedPost", module: FeaturedPost },
  { name: "PostsListing", module: PostsListing },
  { name: "PostDetails", module: PostDetails },
  { name: "RichTextArea", module: RichTextArea },
];
```

### How to Register Page Templates

1. To create a new Page Template, create a new React component within the `/components/agility-pageTemplates` directory.
2. All of the Page Template that are being used within the site need to be imported into the `index` file within the `/components/agility-pageTemplates` directory and added to the `allTemplates` array:

```
import MainTemplate from "./MainTemplate";

const allTemplates = [
  { name: "MainTemplate", template: MainTemplate }
];
```

### How to Properly Link to an Internal Page

To link to internal pages, use the `next/link` component.

```
import Link from 'next/link';

//where '[...slug]' is the catch-all dynamic page we have (pages/[...slug].js) and '/posts' is the actual real page path for the page
<Link href="[...slug]" as="/posts">
  <a>{item.fields.title}</a>
</Link>
```

### How to Preview Content

Since this is a static site, how can editors preview content in real-time as they are making edits within Agility CMS? Vercel supports Previews out of the box! Simply paste the address of your site deployed on Vercel into your Agility Sitemap Configuration (Settings > Sitemaps), and use it as your Preview Deployment.

## Resources

### Agility CMS
- [Official site](https://agilitycms.com)
- [Documentation](https://help.agilitycms.com/hc/en-us)

### Next.js
- [Official site](https://nextjs.org/)
- [Documentation](https://nextjs.org/docs/getting-started)

### Vercel
- [Official site](https://vercel.com/)

### Tailwind CSS
- [Official site](http://tailwindcss.com/)
- [Documentation](http://tailwindcss.com/docs)

### Community
- [Official Slack](https://join.slack.com/t/agilitycommunity/shared_invite/enQtNzI2NDc3MzU4Njc2LWI2OTNjZTI3ZGY1NWRiNTYzNmEyNmI0MGZlZTRkYzI3NmRjNzkxYmI5YTZjNTg2ZTk4NGUzNjg5NzY3OWViZGI)
- [Blog](https://agilitycms.com/resources/posts)
- [GitHub](https://github.com/agility)
- [Forums](https://help.agilitycms.com/hc/en-us/community/topics)
- [Facebook](https://www.facebook.com/AgilityCMS/)
- [Twitter](https://twitter.com/AgilityCMS)

## Feedback and Questions
If you have feedback or questions about this starter, please use the [Github Issues](https://github.com/agility/agilitycms-nextjs-starter/issues) on this repo, join our [Community Slack Channel](https://join.slack.com/t/agilitycommunity/shared_invite/enQtNzI2NDc3MzU4Njc2LWI2OTNjZTI3ZGY1NWRiNTYzNmEyNmI0MGZlZTRkYzI3NmRjNzkxYmI5YTZjNTg2ZTk4NGUzNjg5NzY3OWViZGI) or create a post on the [Agility Developer Community](https://help.agilitycms.com/hc/en-us/community/topics).
