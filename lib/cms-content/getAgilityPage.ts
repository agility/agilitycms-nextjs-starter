import "server-only";
import { AgilityPageProps } from "@agility/nextjs";
import { getAgilityPageProps } from "@agility/nextjs/node";
import { cache } from "react";


export interface PageProps {
	params: { slug: string[] }
	searchParams?: { [key: string]: string | string[] | undefined }
}


export const getAgilityPage = async ({ params }: PageProps) => {

	//TODO: get the preview data
	const preview = false

	if (!params.slug) params.slug = [""]

	const agilityPage = await getAgilityPageProps({ params, preview, getModule })
	return agilityPage
}



const getModule = (name: string) => {
	return null
}