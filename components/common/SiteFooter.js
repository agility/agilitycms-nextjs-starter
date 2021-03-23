import React from "react";
import Image from "next/image";
import { FaTwitter, FaInstagram, FaSlack } from "react-icons/fa";

const SiteFooter = ({ globalData }) => {
  // get footer data
  const { footer } = globalData;

  if (!footer) {
    return (
      <footer className="relative p-8 text-center">
        <p className="text-gray-400 font-bold">No Footer Available</p>
      </footer>
    );
  }

  return (
    <footer className="relative px-8 mt-24 mb-4">
      <div className="max-w-screen-xl mx-auto md:flex md:items-center">
        <div className="text-center mb-4 md:mb-0 md:text-left flex-shrink-0 relative">
          <a
            href="https://www.agilitycms.com"
            target="_blank"
            title="Agility CMS"
          >
            <Image
              src="/assets/agility-logo.png"
              alt="Agility CMS"
              width="90"
              height="24"
            />
          </a>
        </div>
        <div className="flex-grow mb-4 md:mb-0">
          <p className="text-center md:text-left text-gray-400 text-xs md:ml-8 md:max-w-3xl">
            {footer.footnote}
          </p>
        </div>
        <div className="flex-1-grow">
          <ul className="flex justify-center md:justify-start">
            {footer.twitter && (
              <li>
                <a
                  href={footer.twitter.href}
                  title={footer.twitter.text}
                  target={footer.twitter.target}
                >
                  <FaTwitter className="text-xl md:ml-8 text-indigo-600 hover:text-indigo-500" />
                </a>
              </li>
            )}
            {footer.instagram && (
              <li>
                <a
                  href={footer.instagram.href}
                  title={footer.instagram.text}
                  target={footer.instagram.target}
                >
                  <FaInstagram className="text-xl ml-4 text-indigo-600 hover:text-indigo-500" />
                </a>
              </li>
            )}
            {footer.slack && (
              <li>
                <a
                  href={footer.slack.href}
                  title={footer.slack.text}
                  target={footer.slack.target}
                >
                  <FaSlack className="text-xl ml-4 text-indigo-600 hover:text-indigo-500" />
                </a>
              </li>
            )}
          </ul>
        </div>
      </div>
    </footer>
  );
};

SiteFooter.getCustomInitialProps = async function ({
  agility,
  languageCode,
  channelName,
}) {
  // set up api
  const api = agility;

  // set up our content item
  let contentItem = null;

  try {
    // try to fetch our site footer
    let footer = await api.getContentList({
      referenceName: "sitefooter",
      languageCode: languageCode,
    });

    // if we have a footer, grab the content item
    if (footer && footer.length > 0) {
      contentItem = footer[0];

      // else return null
    } else {
      return null;
    }
  } catch (error) {
    if (console) console.error("Could not load global footer item.", error);
    return null;
  }

  // return a clean object...
  return {
    footnote: contentItem.fields?.footnote,
    twitter: contentItem.fields?.twitter,
    instagram: contentItem.fields?.instagram,
    slack: contentItem.fields?.slack,
  };
};

export default SiteFooter;
