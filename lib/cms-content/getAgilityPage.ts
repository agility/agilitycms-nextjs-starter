import "server-only";
import { AgilityPageProps } from "@agility/nextjs";
import { getAgilityPageProps } from "@agility/nextjs/node";
import { cache } from "react";
import { getAgilityContext } from "./useAgilityContext";


export interface PageProps {
	params: { slug: string[] }
	searchParams?: { [key: string]: string | string[] | undefined }
}


export const getAgilityPage = async ({ params }: PageProps) => {

	const { isPreview, locale, sitemap } = getAgilityContext()

	const preview = isPreview

	if (!params.slug) params.slug = [""]

	const agilityPage = await getAgilityPageProps({ params, preview, getModule })
	return agilityPage
}



const getModule = (name: string) => {
	return null
}