import React from "react";
import { renderHTML } from "@agility/nextjs";
import Image from "next/image";

const PostDetails = ({ dynamicPageItem }) => {
  // get post fields
  const post = dynamicPageItem.fields;

  // get category
  const category = post.category?.fields.title || "Uncategorized";

  // get author
  const author = post?.author || "Unknown";

  // set up date string
  let dateStr = null;

  // try to format date with current languageCode
  try {
    dateStr = newDate(post.date).toLocaleDateString(languageCode);
  } catch (e) {
    dateStr = new Date(post.date).toLocaleDateString();
  }

  return (
    <div className="max-w-2xl mx-auto my-12 md:my-18 lg:my-20 px-6">
      <Image
        src={post.image.url}
        alt={post.title}
        width="1000"
        height="1000"
        className="rounded-md"
      />
      <div className="flex items-center mt-2 mb-8">
        <div>
          <img
            src={author ? author.fields.image.url : "https://picsum.photos/200"}
            width="50"
            height="50"
            className="rounded-md"
          />
        </div>
        <div className="pl-2">
          <p className="font-medium">{author.fields.name}</p>
          <p className="text-gray-400 text-sm">Published: {dateStr}</p>
        </div>
      </div>
      <p className="text-indigo-700 font-medium text-sm uppercase mb-2">
        {category}
      </p>
      <h1 className="text-4xl font-bold mb-4">{post.title}</h1>
      <div
        className="prose max-w-full"
        dangerouslySetInnerHTML={renderHTML(post.content)}
      />
    </div>
  );
};

export default PostDetails;
