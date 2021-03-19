import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";

import { expandLinkedList } from "@agility/nextjs";

const SiteFooter = ({ globalData }) => {
  // get footer data
  const { footer } = globalData;

  const siteName = footer?.siteName || "Website Name";

  const footerLogo = footer?.footerLogo;

  const quickLinks = footer?.quickLinks;

  // set up date
  const date = new Date();

  // set href
  let href = "/pages/[...slug]";

  if (footer == null) {
    return <footer>No footer</footer>;
  }

  return (
    <footer className="text-center">
      <div className="container mx-auto p-6">
        <Link href="/" as="/">
          <a className="cursor-pointer">
            {footerLogo && (
              <Image
                src={footerLogo.url}
                alt={footerLogo.label}
                width="60"
                height="60"
              />
            )}
            <h3 className="text-2xl font-bold mt-2 mb-6 tracking-wider">
              {siteName}
            </h3>
          </a>
        </Link>
        <ul className="sm:flex sm:max-w-lg sm:justify-center sm:mx-auto">
          {quickLinks.map((link, index) => (
            <li key={index} className="my-4 sm:my-0 sm:mx-4">
              <Link href={href} as={link.href}>
                <a
                  title={link.text}
                  className="font-bold hover:text-indigo-700"
                >
                  {link.text}
                </a>
              </Link>
            </li>
          ))}
        </ul>
      </div>
      <div className="bg-indigo-600 py-4 px-6">
        <p className="text-white text-xs">
          &#169; &nbsp;
          {`Copyright, ${siteName} ${date.getFullYear()}`}
        </p>
      </div>
    </footer>
  );
};

SiteFooter.getCustomInitialProps = async function ({
  agility,
  languageCode,
  channelName,
}) {
  const api = agility;

  let contentItem = null;

  try {
    //get the site footer
    let contentItemList = await api.getContentList({
      referenceName: "sitefooter",
      languageCode: languageCode,
    });

    if (contentItemList?.length > 0) {
      contentItem = contentItemList[0];

      // resolve quick links
      contentItem = await expandLinkedList({
        agility,
        contentItem,
        languageCode,
        fieldName: "quickLinks",
        sortIDField: "quickLinks_SortIdField",
      });
    } else {
      return null;
    }
  } catch (error) {
    if (console) console.error("Could not load global footer item.", error);
  }

  //return a clean object...
  return {
    footerLogo: contentItem.fields?.footerLogo || null,
    siteName: contentItem.fields.siteName,
    quickLinks: contentItem.fields.quickLinks.map((link) => link.fields.link),
  };
};

export default SiteFooter;
