import React from "react";
import { renderHTML } from "@agility/nextjs";

const RichTextArea = ({ module }) => {
  // get module fields
  const { fields } = module;
  return (
    <div className="max-w-3xl mx-auto my-12 md:my-18 lg:my-20 px-6">
      <div
        className="prose prose-sm sm:prose lg:prose-lg xl:prose-xl max-w-full"
        dangerouslySetInnerHTML={renderHTML(fields.textblob)}
      />
    </div>
  );
};

export default RichTextArea;
