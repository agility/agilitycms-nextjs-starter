import React from "react";
import { renderHTML } from "@agility/nextjs";

const RichTextArea = ({ module }) => {
  const { fields } = module;
  return (
    <div className="my-16 container px-6 mx-auto">
      <div
        //prose-sm sm:prose lg:prose-lg xl:prose-xl mx-auto px-6 font-normal
        className="prose prose-sm sm:prose lg:prose-lg xl:prose-xl max-w-full"
        dangerouslySetInnerHTML={renderHTML(fields.textblob)}
      />
    </div>
  );
};

export default RichTextArea;
