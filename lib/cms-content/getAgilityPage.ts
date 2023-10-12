import "server-only";
import { AgilityPageProps } from "@agility/nextjs";
import { getAgilityPageProps } from "@agility/nextjs/node";
import { cache } from "react";


export interface GetPageProps {
	params: { slug: string[] }
	searchParams?: { [key: string]: string | string[] | undefined }
}



export const getAgilityPage = async ({ params }: GetPageProps) => {



	//TODO: get the preview data
	const preview = false

	if (!params.slug) params.slug = [""]

	console.log("Fetching Page", params, preview)

	const agilityPage = await getAgilityPageProps({ params, preview, getModule })
	return agilityPage
}



const getModule = (name: string) => {
	return null
}