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
      alert(
        "To view your content in Preview Mode, sign into your Agility Instance and click `Preview` on a content item."
      );
    } else {
      const exit = confirm("Would you like to exit preview mode?");
      if (exit === true) {
        window.location.href = `/api/exitPreview?slug=${window.location.pathname}`;
      } else return;
    }
  };

  return (
    <div className="bg-agility relative px-8 py-3 text-white">
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
                alt=""
                className="w-5 h-5"
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
        {/* <select className="text-black p-2">
          <option>viewing in preview</option>
          <option>viewing in live</option>
        </select> */}
        <div className="relative">
          <div
            className="p-2 bg-black rounded-lg cursor-pointer"
            onClick={() => setOpen(!open)}
          >
            {open ? <FaChevronUp /> : <FaChevronDown />}
          </div>
          <div
            className="absolute bg-agility text-white text-sm py-6 px-4 w-64 -right-0 -bottom-30 z-20 rounded-b-lg"
            style={{ display: open ? "block" : "none" }}
          >
            <p className="mb-4 text-center">
              {`Viewing Content in ${isPreview ? `Preview` : `Live`} Mode`}
            </p>
            <button
              className="bg-white text-agility p-2 w-full rounded-lg text-sm"
              onClick={() => handleView()}
            >
              {`Switch to ${isPreview ? `Live` : `Preview`} Mode`}
            </button>
          </div>
        </div>
        {/* {isPreview ? (
          <button
            className="bg-white text-agility text-sm p-2 font-medium rounded-lg"
            onClick={() => handleView()}
          >
            Exit Preview Mode
          </button>
        ) : (
          <button
            className="bg-white text-agility text-sm p-2 font-medium rounded-lg"
            onClick={() => handleView()}
          >
            View Preview Mode
          </button>
        )} */}
      </div>
    </div>
  );
};

export default PreviewBar;
