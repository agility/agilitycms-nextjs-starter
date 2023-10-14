import RichTextArea from "./RichTextArea";
import FeaturedPost from "./FeaturedPost";
import PostsListing from "./PostsListing/PostsListing.server";
import PostDetails from "./PostDetails";
import Heading from "./Heading";
import TextBlockWithImage from "./TextBlockWithImage";
import NoComponentFound from "./NoComponentFound";
import { ModuleWithInit } from "@agility/nextjs";

// All of the Agility Page Module Components that are in use in this site need to be imported into this index file.
// Place Page Modules in allModules array below, passing in a name and the component.

const allModules = [
	{ name: "TextBlockWithImage", module: TextBlockWithImage },
	{ name: "Heading", module: Heading },
	{ name: "FeaturedPost", module: FeaturedPost },
	{ name: "PostsListing", module: PostsListing },
	{ name: "PostDetails", module: PostDetails },
	{ name: "RichTextArea", module: RichTextArea },
];

/**
 * Get the Agility Component/Module by name.
 * If the component is not found, a default component will be returned.
 * @param moduleName
 * @returns
 */
export const getModule = (moduleName: string): ModuleWithInit | null => {

	if (!moduleName) return null;
	const obj = allModules.find(
		(m) => m.name.toLowerCase() === moduleName.toLowerCase()
	);
	if (!obj) return NoComponentFound;
	return obj.module as ModuleWithInit;
};
