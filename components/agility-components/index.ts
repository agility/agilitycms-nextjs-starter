import RichTextArea from "./RichTextArea";
import FeaturedPost from "./FeaturedPost";
import PostsListing from "./PostsListing/PostsListing.server";
import PostDetails from "./PostDetails";
import Heading from "./Heading";
import TextBlockWithImage from "./TextBlockWithImage";
import NoComponentFound from "./NoComponentFound";


// All of the Agility Page Module Components that are in use in this site need to be imported into this index file.
// Place Page Modules in allModules array below, passing in a name and the component.

const components = [
	{ name: "TextBlockWithImage", component: TextBlockWithImage },
	{ name: "Heading", component: Heading },
	{ name: "FeaturedPost", component: FeaturedPost },
	{ name: "PostsListing", component: PostsListing },
	{ name: "PostDetails", component: PostDetails },
	{ name: "RichTextArea", component: RichTextArea },
];

/**
 * Get the Agility Component/Module by name.
 * If the component is not found, a default component will be returned.
 * @param componentName
 * @returns
 */
export const getComponent = (componentName: string): any | null => {

	if (!componentName) return null;
	const obj = components.find(
		(c) => c.name.toLowerCase() === componentName.toLowerCase()
	);
	if (!obj) return NoComponentFound;
	return obj.component
};
