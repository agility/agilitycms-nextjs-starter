import { getStaticProps as getSlugStaticProps } from './[...slug]';
import Layout from "components/common/Layout";

export async function getStaticProps ({
  preview,
  locale,
  defaultLocale,
  locales,
}) {

  //pass the 404 path into our getStaticProps function from the slug
  const params = { slug: [ '404' ] }

  console.log('params', params)

  return getSlugStaticProps({
    preview,
    params,
    locale,
    defaultLocale,
    locales,
  } )
}


const AgilityPage = (props) => {
  return <Layout {...props} />;
};

export default AgilityPage