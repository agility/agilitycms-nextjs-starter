import React from "react";
import Link from "next/link";
import Image from "next/image";

const Hero = ({ module }) => {
  const { fields } = module;
  return (
    <section className="container mx-auto px-6 mb-20 text-center md:flex md:flex-row-reverse md:items-center">
      <div className="md:flex-1 md:p-6">
        <Image
          src={fields.heroImage.url}
          width="600"
          height="600"
          alt={fields.heroImage.label}
        />
      </div>
      <div className="md:flex-1 md:text-left md:p-6">
        <p className="font-medium text-indigo-600 md:border-l-4 pl-2 mb-2">
          {fields.kicker}
        </p>
        <h1 className="text-4xl font-bold mb-12">{fields.title}</h1>
        <Link href="[.../slug]" as={fields.primaryCTA.href}>
          <a
            title={fields.primaryCTA.text}
            href={fields.primaryCTA.href}
            target={fields.primaryCTA.target}
            className="px-8 py-3 border border-transparent text-base leading-6 font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-500 focus:outline-none focus:border-indigo-700 focus:shadow-outline-indigo transition duration-150 ease-in-out md:py-4 md:text-lg md:px-10"
          >
            {fields.primaryCTA.text}
          </a>
        </Link>
      </div>
    </section>
  );
};

export default Hero;
