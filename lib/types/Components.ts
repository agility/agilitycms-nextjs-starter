import { Page } from "@agility/content-fetch/dist/types/Page";
import { AgilitySitemapNode, ContentItem, ImageField, URLField } from "@agility/nextjs/types";

export interface UnloadedComponentProps {
    page: Page;
    component: {
        contentid: number;
    };
    languageCode: string;
    channelName: string;
    sitemapNode: AgilitySitemapNode;
    dynamicPageItem?: ContentItem<any>;
    isDevelopmentMode: boolean;
    isPreview: boolean;
    globalData?: {
        [name: string]: any;
    };
}

export interface ITextBlockWithImage {
  title: string
  content: string
  tagline?: string
  imagePosition: "left" | "right"
  image: ImageField
  primaryButton: URLField
  highPriority?: string
}

export interface IFeaturedPostModule {
    featuredPost?: {
      contentid: number
    }
}

export interface IHeading {
    title: string
}

export interface RichText {
	textblob: string
}