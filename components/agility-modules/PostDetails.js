import React from "react";
import { renderHTML } from "@agility/nextjs";
import Image from "next/image";

const PostDetails = ({ dynamicPageItem }) => {
  // post fields
  const post = dynamicPageItem.fields;

  // category
  const category = post.category?.fields.title || "Uncategorized";

  // format date
  const dateStr = new Date(post.date).toLocaleDateString();

  return (
    <div className="relative px-8">
      <div className="max-w-screen-xl mx-auto">
        <div className="h-64 md:h-96 relative">
          <Image
            src={post.image.url}
            className="object-cover object-center rounded-lg"
            layout="fill"
          />
        </div>
        <div className="max-w-2xl mx-auto mt-4">
          <div className="uppercase text-indigo-500 text-xs font-bold tracking-widest leading-loose border-b-2 inline-block border-indigo-500 after:w-8">
            {category}
          </div>
          <div className="mt-4 uppercase text-gray-600 italic font-semibold text-xs">
            {dateStr}
          </div>
          <h1 className="text-4xl font-bold my-6">{post.title}</h1>
          <div
            className="prose max-w-full"
            dangerouslySetInnerHTML={renderHTML(post.content)}
          />
        </div>
      </div>
    </div>
  );
};

export default PostDetails;
