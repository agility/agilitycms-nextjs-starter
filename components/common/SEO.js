import React from "react";
import Head from "next/head";
import ReactHtmlParser from "react-html-parser";

const SEO = ({ title, description, keywords, ogImage, metaHTML }) => {
  // setup and parse additional header markup
  let additionalHeaderMarkup = null;
  if (metaHTML) {
    additionalHeaderMarkup = ReactHtmlParser(metaHTML);
  }
  return (
    <Head>
      <title>{title} - Agility CMS Sample Blog</title>
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
