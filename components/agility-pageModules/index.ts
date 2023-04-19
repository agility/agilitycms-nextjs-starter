import RichTextArea from "./RichTextArea";
import FeaturedPost from "./FeaturedPost";
import PostsListing from "./PostsListing";
import PostDetails from "./PostDetails";
import Heading from "./Heading";

import Hero from "./HeroModule";
import PricingCards from "./PricingCards";

import { ModuleWithInit } from "@agility/nextjs";

import DefaultModule from "./DefaultModule";

// All of the Agility Page Module Components that are in use in this site need to be imported into this index file.
// Place Page Modules in allModules array below, passing in a name and the component.

const allModules = [
  { name: "Hero", module: Hero },
  { name: "Heading", module: Heading },
  { name: "FeaturedPost", module: FeaturedPost },
  { name: "PostsListing", module: PostsListing },
  { name: "PostDetails", module: PostDetails },
  { name: "PricingCards", module: PricingCards },
  { name: "RichTextArea", module: RichTextArea },
];

export const getModule = (moduleName: string): ModuleWithInit | null => {
  if (!moduleName) return null;
  const obj = allModules.find(
    (m) => m.name.toLowerCase() === moduleName.toLowerCase()
  );
  if (!obj) return DefaultModule as ModuleWithInit;
  return obj.module as ModuleWithInit;
};


