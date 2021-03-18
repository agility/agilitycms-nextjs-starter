import { getPageTemplate } from "components/agility-pageTemplates";
import PreviewBar from "./PreviewBar";
import SiteHeader from "./SiteHeader";
import SiteFooter from "./SiteFooter";
import LoadingWidget from "./LoadingWidget";

import { useRouter } from "next/router";

import Head from "next/head";

import Error from "next/error";

function Layout(props) {
  const {
    page,
    sitemapNode,
    dynamicPageItem,
    notFound,
    pageTemplateName,
  } = props;

  // If the page is not yet generated, this will be displayed
  // initially until getStaticProps() finishes running
  const router = useRouter();
  if (router.isFallback) {
    return <LoadingWidget message="Loading" />;
  }

  if (notFound === true) {
    return <Error statusCode={404} />;
  }

  const AgilityPageTemplate = getPageTemplate(pageTemplateName);

  if (dynamicPageItem?.seo?.metaDescription) {
    page.seo.metaDescription = dynamicPageItem.seo.metaDescription;
  }

  return (
    <>
      <Head>
        <title>{sitemapNode?.title} - Agility CMS Sample Blog</title>
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
        <meta name="description" content={page.seo.metaDescription} />
        <meta name="generator" content="Agility CMS" />
        <meta name="agility_timestamp" content={new Date().toLocaleString()} />
        {dynamicPageItem?.seo?.ogImage && (
          <meta property="og:image" content={dynamicPageItem.seo.ogImage} />
        )}
      </Head>
      <PreviewBar {...props} />

      <main>
        <SiteHeader {...props} />
        <AgilityPageTemplate {...props} />
        <SiteFooter {...props} />
      </main>
    </>
  );
}

export default Layout;
