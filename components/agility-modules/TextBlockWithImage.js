import React from "react";
import Image from "next/image";
import Link from "next/link";

const TextBlockWithImage = ({ module }) => {
  const { fields } = module;
  // set href
  const href = "[.../slug]";
  return (
    <div className="container mx-auto px-6 my-12 md:my-18 lg:my-20">
      {fields.imagePosition === "right" ? (
        // display image on right side
        <div className="md:flex md:flex-row-reverse md:items-center mb-16">
          <div className="flex-1 mb-4 h-64 md:h-80 w-full relative">
            <Image
              src={fields.image.url}
              alt={fields.image.label}
              layout="fill"
              objectFit="cover"
              className="rounded-2xl object-contain"
            />
          </div>
          <div className="flex-1 md:pr-14">
            <p className="text-indigo-700 font-medium uppercase mb-2">
              {fields.tagline}
            </p>
            <h2 className="text-4xl font-bold">{fields.title}</h2>
            <p className="mt-4 mb-12">{fields.content}</p>
            <div className="mb-8">
              <Link href={href} as={fields.primaryButton.href}>
                <a
                  title={fields.primaryButton.text}
                  className="p-4 bg-indigo-700 text-white font-semibold rounded-lg shadow-md hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:ring-opacity-75"
                >
                  {fields.primaryButton.text}
                </a>
              </Link>
            </div>
          </div>
        </div>
      ) : (
        // display image on left side
        <div className="flex flex-col md:flex-row mb-16 md:items-center">
          <div className="order-2 md:flex-1 md:pl-14">
            <p className="text-indigo-700 font-medium uppercase mb-2">
              {fields.tagline}
            </p>
            <h2 className="text-4xl font-bold">{fields.title}</h2>
            <p className="mt-4 mb-12">{fields.content}</p>
            <div className="mb-8">
              <Link href={href} as={fields.primaryButton.href}>
                <a
                  title={fields.primaryButton.text}
                  className="p-4 bg-indigo-700 text-white font-semibold rounded-lg shadow-md hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:ring-opacity-75"
                >
                  {fields.primaryButton.text}
                </a>
              </Link>
            </div>
          </div>
          <div className="order-1 mb-4 h-64 w-full relative  md:h-80 md:flex-1">
            <Image
              src={fields.image.url}
              alt={fields.image.label}
              layout="fill"
              objectFit="cover"
              className="rounded-2xl object-contain shadow-sm"
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default TextBlockWithImage;
