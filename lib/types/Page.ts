import { SEOProperties } from "@agility/content-fetch/dist/types/SEO";
import { SitemapVisibility } from "@agility/content-fetch/dist/types/SitemapVisibility";
import { SystemProperties } from "@agility/content-fetch/dist/types/SystemProperties";
import { ContentZone } from "./ContentZone";
import { AgilitySitemapNode, ModuleWithInit } from "@agility/nextjs/types";


export interface AgilityPageProps {
    sitemapNode: AgilitySitemapNode;
    page?: Page;
    dynamicPageItem?: any;
    pageTemplateName?: string | null;
    languageCode?: string | null;
    channelName?: string | null;
    isPreview?: boolean;
    isDevelopmentMode?: boolean;
    notFound?: boolean;
    getComponent?(componentName: string): ModuleWithInit | null;
    globalData?: {
        [name: string]: any;
    };
}

export interface Page {
    pageID: number;
    name: string;
    path: string;
    title: string;
    menuText: string;
    pageType: "static" | "dynamic" | "dynamic_node" | "link" | "folder";
    templateName: string;
    securePage: boolean;
    properties: SystemProperties;
    zones: {
        [key: string]: ContentZone[];
    };
    redirectUrl?: string;
    dynamicItemContentID?: number;
    visible: SitemapVisibility;
    seo?: SEOProperties;
}