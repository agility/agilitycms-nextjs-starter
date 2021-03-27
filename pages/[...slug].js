import Layout from "components/common/Layout";
import { getAgilityPageProps, getAgilityPaths } from "@agility/nextjs/node";
import { getModule } from "components/agility-modules";
import SiteHeader from "components/common/SiteHeader";

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
  return <Layout {...props} />;
};

export default AgilityPage;
