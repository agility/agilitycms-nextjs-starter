import React from "react";
import { ContentZone } from "@agility/nextjs";

import { getModule } from "components/agility-modules";

const MainTemplate = (props) => {
  return (
    <div className="">
      <ContentZone name="MainContentZone" {...props} getModule={getModule} />
    </div>
  );
};

export default MainTemplate;
