import React from "react";
import truncate from "truncate-html";
import Link from "next/link";
import Image from "next/image";

const PostsListing = ({ module, customData }) => {
  // get module fields
  const { fields } = module;

  // get posts
  const { posts } = customData;

  // set href
  let href = "/pages/[...slug]";

  return (
    <div className="my-12 md:my-18 lg:my-20">
      <div className="text-center max-w-2xl m-auto mb-10 px-6">
        <h1 className="text-4xl font-bold mb-4">{fields.title}</h1>
        <p>{fields.subtitle}</p>
      </div>
      <div className="container mx-auto px-6 md:grid md:grid-cols-2 md:gap-8 lg:grid-cols-3">
        {posts.map((post, index) => (
          <div className="mb-8" key={index}>
            <Link href="[.../slug]" as={post.url}>
              <a className="hover:cursor-pointer">
                <Image
                  src={post.imageSrc}
                  alt={post.imageAlt}
                  layout="responsive"
                  width="1000"
                  height="1000"
                  className="rounded-md object-contain"
                />
                <p className="text-gray-500 font-medium text-sm my-2">
                  {post.category ? post.category : "Uncategorized"}
                </p>
                <p className="text-xl font-bold">{post.title}</p>
                <p className="inline-block px-4 py-2 my-3 border border-transparent text-base leading-6 font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-500 focus:outline-none focus:border-indigo-700 focus:shadow-outline-indigo transition duration-150 ease-in-out">
                  {fields.readMoreLabel}
                </p>
              </a>
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
};

// function to resole post urls
const resolvePostUrls = function (sitemap, posts) {
  let dynamicUrls = {};
  posts.forEach((post) => {
    Object.keys(sitemap).forEach((path) => {
      if (sitemap[path].contentID === post.contentID) {
        dynamicUrls[post.contentID] = path;
      }
    });
  });
  return dynamicUrls;
};

PostsListing.getCustomInitialProps = async ({
  agility,
  channelName,
  languageCode,
}) => {
  const api = agility;

  try {
    // get sitemap...
    let sitemap = await api.getSitemap({
      channelName: channelName,
      languageCode,
    });

    // get posts...
    let rawPosts = await api.getContentList({
      referenceName: "posts",
      languageCode,
    });

    // get categories...
    let categories = await api.getContentList({
      referenceName: "categories",
      languageCode,
    });

    // get authors
    let authors = await api.getContentList({
      referenceName: "authors",
      languageCode,
    });

    // resolve dynamic urls
    const dynamicUrls = resolvePostUrls(sitemap, rawPosts);

    const posts = rawPosts.map((post) => {
      // get categoryID
      const categoryID = post.fields.category?.contentid;

      // get authorID
      const authorID = post.fields.author?.contentid;

      // find category
      const category = categories?.find((c) => c.contentID == categoryID);

      // find author
      const author = authors?.find((a) => a.contentID == authorID);

      // get url
      const url = dynamicUrls[post.contentID] || "#";

      // get image src
      let imageSrc = post.fields.image?.url || null;

      // get image alt
      let imageAlt = post.fields.image?.label || null;

      return {
        contentID: post.contentID,
        title: post.fields.title,
        url,
        category: category?.fields.title || null,
        author: author?.fields.name || null,
        imageSrc,
        imageAlt,
      };
    });

    return {
      posts,
    };
  } catch (error) {
    if (console) console.error(error);
  }
};

export default PostsListing;
