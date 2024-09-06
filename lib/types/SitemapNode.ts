export interface SitemapNode {

	title: string
	name: string
	pageID: number
	contentID?: number
	menuText: number
	visible: { menu: boolean, sitemap: boolean },
	path: string,
	redirect: string | null,
	isFolder: boolean

}