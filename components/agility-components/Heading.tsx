import React from "react"

import { Module, UnloadedModuleProps } from "@agility/nextjs"
import { getContentItem } from "lib/cms/getContentItem"
import { UnloadedComponentProps } from "lib/types/Components"
import { IHeading } from "lib/types/Components"


const Heading = async ({ component, languageCode }: UnloadedComponentProps) => {
  const { fields, contentID } = await getContentItem<IHeading>({
    contentID: component.contentid,
    languageCode,
  })

  return (
    <div className="relative px-8" data-agility-component={contentID}>
      <div className="max-w-screen-xl mx-auto my-12 md:mt-18 lg:mt-20">
        <h1
          data-agility-field={"title"}
          className="font-display text-secondary-500 text-4xl font-black tracking-wide"
        >
          {fields.title}
        </h1>
      </div>
    </div>
  )
}

export default Heading
