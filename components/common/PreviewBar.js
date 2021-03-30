import React, { useState } from "react";
import {
  FaInfoCircle,
  FaGithub,
  FaChevronDown,
  FaChevronUp,
} from "react-icons/fa";

/**
 * This is a preview bar that is enabled by default to handle viewing content in preview & live mode, remove this for production use.
 **/

const PreviewBar = ({ isPreview, isDevelopmentMode }) => {
  const [open, setOpen] = useState(false);

  // handle view function to determine preview / live mode
  const handleView = () => {
    if (!isDevelopmentMode && !isPreview) {
      const xhr = new XMLHttpRequest();

      xhr.onload = function () {
        // Process our return data
        if (xhr.status >= 200 && xhr.status < 300) {
          // What do when the request is successful
          const previewKey = xhr.responseText;

          window.location.replace(
            `${window.location.pathname}?agilitypreviewkey=${escape(
              previewKey
            )}`
          );
          console.log("redirect here");
        }
      };
      // Create and send a GET request
      xhr.open("GET", "/api/generatePreviewKey");
      xhr.send();
    } else {
      const exit = confirm("Would you like to exit preview mode?");
      if (exit === true) {
        window.location.href = `/api/exitPreview?slug=${window.location.pathname}`;
      } else return;
    }
  };

  return (
    <div className="bg-agility relative px-8 py-3 text-gray-200">
      <div className="flex justify-between items-center max-w-screen-xl mx-auto">
        <div className="flex items-center">
          <span className="p-2 bg-black rounded-lg mr-4">
            <a
              href="https://www.agilitycms.com"
              target="_blank"
              title="Agility CMS"
            >
              <img
                src="https://static.agilitycms.com/brand/agility-triangle-yellow.svg"
                alt="Agility CMS"
                className="w-5 h-5 block md:hidden"
              />
              <img
                src="/assets/agility-preview-logo.svg"
                alt="Agility CMS"
                className="h-5 w-20 hidden md:block"
              />
            </a>
          </span>
          <div className="mr-4">
            <a
              href="https://help.agilitycms.com/hc/en-us"
              target="_blank"
              title="Help Center"
            >
              <div className="flex items-center">
                <FaInfoCircle className="text-2xl mr-2" />
                <p className="hidden md:block text-sm">Help Center</p>
              </div>
            </a>
          </div>
          <div>
            <a
              href="https://www.github.com"
              target="_blank"
              title="View on Github"
              className="text-2xl"
            >
              <div className="flex items-center">
                <FaGithub className="mr-2" />
                <p className="hidden md:block text-sm">View on Github</p>
              </div>
            </a>
          </div>
        </div>
        <div className="relative flex items-center">
          {isPreview ? (
            <p className="hidden md:block text-sm mr-4">
              Previewing <span className="font-bold">Latest</span> Changes
            </p>
          ) : (
            <p className="hidden md:block text-sm mr-4">
              Viewing <span className="font-bold">Published</span> Content
            </p>
          )}
          <div
            className="p-2 bg-black text-gray-200 rounded-lg cursor-pointer z-20"
            onClick={() => setOpen(!open)}
          >
            {open ? <FaChevronUp /> : <FaChevronDown />}
          </div>
          <div
            className="absolute bg-agility text-white text-sm py-4 px-4 w-64 -right-0 -bottom-28 md:-bottom-20 z-10 rounded-b-lg"
            style={{ display: open ? "block" : "none" }}
          >
            {isPreview ? (
              <p className="mb-4 text-center md:hidden text-gray-200 z-20">
                Preview Latest Changes
              </p>
            ) : (
              <p className="mb-4 text-center md:hidden text-gray-200 z-20">
                View Published Content
              </p>
            )}
            <button
              className="bg-gray-200 text-agility p-2 w-full rounded-lg text-sm"
              onClick={() => handleView()}
            >
              {`View ${isPreview ? `Live` : `Preview`} Mode`}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PreviewBar;
