import RichTextArea from "./RichTextArea";
import Hero from "./Hero";
import Metrics from "./Metrics";
import PostsListing from "./PostsListing";
import PostDetails from "./PostDetails";
import TextBlockWithImage from "./TextBlockWithImage";

/**
 * All of the Agility Module components that are in use in this site.
 */
const allModules = [
  { name: "Hero", module: Hero },
  { name: "Metrics", module: Metrics },
  { name: "TextBlockWithImage", module: TextBlockWithImage },
  { name: "PostsListing", module: PostsListing },
  { name: "PostDetails", module: PostDetails },
  { name: "RichTextArea", module: RichTextArea },
];

/**
 * Find the component for a module by name.
 * @param moduleName
 */
export const getModule = (moduleName) => {
  if (!moduleName) return null;
  const obj = allModules.find(
    (m) => m.name.toLowerCase() === moduleName.toLowerCase()
  );
  if (!obj) return null;
  return obj.module;
};
