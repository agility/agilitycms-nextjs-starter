import { ContentReference } from "@agility/content-fetch";
// import { Page } from "@agility/content-fetch/dist/types/Page";
import { AgilitySitemapNode, ContentItem } from "@agility/nextjs/types";
import { Page } from "./Page";

export interface ContentZone {
  module: string;
  item: ContentItem | ContentReference;
  customData?: any;
}

export interface ContentZoneProps {
  name: string;
  page: Page;
  sitemapNode: AgilitySitemapNode;
  dynamicPageItem?: any;
  languageCode: string;
  channelName: string;
  getComponent(componentName: string): any;
  isDevelopmentMode: boolean;
  isPreview: boolean;
  globalData?: {
    [name: string]: any;
  };
}
