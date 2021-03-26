import Layout from "components/common/Layout";

import { getAgilityPageProps, getAgilityPaths } from "@agility/nextjs/node";
// import { handlePreview } from "@agility/nextjs";
import { getModule } from "components/agility-modules";
import SiteHeader from "components/common/SiteHeader";
import LoadingWidget from "components/common/LoadingWidget";

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
  }, 2000);
  return true;
};

export async function getStaticProps({
  preview,
  params,
  locale,
  defaultLocale,
  locales,
}) {
  const globalComponents = {
    header: SiteHeader,
  };

  const agilityProps = await getAgilityPageProps({
    preview,
    params,
    locale,
    getModule,
    defaultLocale,
    globalComponents,
  });

  let rebuildFrequency = 10;

  if (!agilityProps) {
    // We throw to make sure this fails at build time as this is never expected to happen
    throw new Error(`Page not found`);
  }

  return {
    props: agilityProps,
    revalidate: rebuildFrequency,
  };
}

export async function getStaticPaths({ locales, defaultLocale }) {
  //get the paths configured in agility
  let agilityPaths = await getAgilityPaths({
    preview: false,
    locales,
    defaultLocale,
  });

  return {
    paths: agilityPaths,
    fallback: true,
  };
}

const AgilityPage = (props) => {
  if (handlePreview()) {
    return (
      <div className="testing">
        <LoadingWidget message="Activating preview mode..." />
      </div>
    );
  }

  return <Layout {...props} />;
};

export default AgilityPage;
