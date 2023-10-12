import React from "react";
import Head from "next/head";
import ReactHtmlParser from 'html-react-parser';

interface Props {
	title: string
	description: string
	keywords: string
	ogImage?: string
	metaHTML?: string
}

const SEO = ({ title, description, keywords, ogImage, metaHTML }:Props) => {
  // setup and parse additional header markup
  let additionalHeaderMarkup = null;
  if (metaHTML) {
    additionalHeaderMarkup = ReactHtmlParser(metaHTML);
  }

  const strTitle = `${title} | My Travel Blog`

  return (
    <Head>
      <title>{strTitle}</title>
      <meta name="generator" content="Agility CMS" />
      <meta name="agility_timestamp" content={new Date().toLocaleString()} />
      <meta name="viewport" content="initial-scale=1.0, width=device-width" />
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />

      {ogImage && <meta property="og:image" content={ogImage} />}
      {additionalHeaderMarkup}
    </Head>
  );
};

export default SEO;
