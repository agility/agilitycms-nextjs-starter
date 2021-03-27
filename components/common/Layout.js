import { getPageTemplate } from "components/agility-pageTemplates";
// import { handlePreview } from "@agility/nextjs";
import { useRouter } from "next/router";
import Error from "next/error";
import PreviewBar from "./PreviewBar";
import SEO from "./SEO";
import SiteHeader from "./SiteHeader";
import SiteFooter from "./SiteFooter";
import LoadingWidget from "./LoadingWidget";

const getParameterByName = (name) => {
  name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
  var regex = new RegExp("[\\?&]" + name + "=([^&#]*)");
  var results = regex.exec(location.search);
  return results === null
    ? ""
    : decodeURIComponent(results[1].replace(/\+/g, " "));
};
const handlePreview = () => {
  if (!process.browser) {
    //kickout if this is not being executed in the browser
    return false;
  }
  const agilityPreviewKey = getParameterByName(`agilitypreviewkey`);
  if (!agilityPreviewKey) {
    //kickout if we don't have a preview key
    return false;
  }
  //redirect this to our preview API route
  const previewAPIRoute = `/api/preview`;
  let previewAPIUrl = `${previewAPIRoute}?slug=${window.location.pathname}&agilitypreviewkey=${agilityPreviewKey}`;
  const dynamicPageContentID = parseInt(
    getParameterByName("ContentID") ?? getParameterByName("contentID")
  );
  if (dynamicPageContentID > 0) {
    previewAPIUrl += `&ContentID=${dynamicPageContentID}`;
  }
  console.log("Activating preview", previewAPIUrl);
  //do the redirect
  setTimeout(function () {
    window.location.href = previewAPIUrl;
  }, 2500);
  return true;
};

const isPreview = handlePreview();

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

  // if page not found, throw 404
  if (notFound === true) {
    return <Error statusCode={404} />;
  }

  const AgilityPageTemplate = getPageTemplate(pageTemplateName);

  if (dynamicPageItem?.seo?.metaDescription) {
    page.seo.metaDescription = dynamicPageItem.seo.metaDescription;
  }

  return (
    <>
      <SEO
        title={sitemapNode?.title}
        description={page.seo.metaDescription}
        keywords={page.seo.metaKeywords}
        metaHTML={page.seo.metaHTML}
      />
      <div id="site-wrapper">
        {isPreview && <LoadingWidget message="Loading Preview" />}
        {!isPreview && (
          <div id="site">
            <PreviewBar {...props} />
            <div className="flex flex-col min-h-screen">
              <SiteHeader {...props} />
              <main className="flex-grow">
                <AgilityPageTemplate {...props} />
              </main>
              <SiteFooter {...props} />
            </div>
          </div>
        )}
      </div>
    </>
  );
}

export default Layout;
