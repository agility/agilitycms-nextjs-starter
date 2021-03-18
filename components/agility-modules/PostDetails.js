import React from "react";
import { renderHTML } from "@agility/nextjs";
import Image from "next/image";

const PostDetails = ({ dynamicPageItem }) => {
  // get fields for post
  const post = dynamicPageItem.fields;

  // get category
  const category = post.category?.fields.title || "Uncategorized";

  // get author
  const author = post?.author;

  // set up date string
  let dateStr = null;

  // try to format date with current languageCode
  try {
    dateStr = newDate(post.date).toLocaleDateString(languageCode);
  } catch (e) {
    dateStr = new Date(post.date).toLocaleDateString();
  }

  return (
    <div className="max-w-3xl mx-auto px-6 my-12 md:my-18 lg:my-20">
      <Image
        src={post.image.url}
        alt={post.title}
        width="1000"
        height="1000"
        className="rounded-md"
      />
      <div className="flex items-center mt-2 mb-4">
        <div>
          <img
            src={
              author?.fields?.image
                ? author.fields.image.url
                : "https://picsum.photos/200"
            }
            width="60"
            height="60"
            className="rounded-full"
          />
        </div>
        <div className="pl-2">
          <p className="font-medium">
            {author?.fields?.name ? author.fields.name : "Unknown"}
          </p>
          <p className="text-gray-400 text-sm">Published: {dateStr}</p>
        </div>
      </div>
      <p className="text-indigo-700 font-medium text-sm uppercase">
        {category}
      </p>
      <h1 className="text-4xl font-bold mb-4">{post.title}</h1>
      <div
        className="prose prose-sm sm:prose lg:prose-lg xl:prose-xl"
        dangerouslySetInnerHTML={renderHTML(post.content)}
      />
    </div>
  );
};

export default PostDetails;
