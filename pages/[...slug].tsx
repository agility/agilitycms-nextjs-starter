import type {
	GetStaticPathsContext,
	GetStaticPropsContext,
	InferGetStaticPropsType,

} from 'next'

import Layout from "components/common/Layout"
import { getAgilityPageProps, getAgilityPaths } from "agility/agility.node";


export async function getStaticProps({ preview, params, locale }: GetStaticPropsContext<{ slug: string[] }>) {

	const agilityProps = await getAgilityPageProps({ preview, params, locale });

	let rebuildFrequency = 10

	if (!agilityProps) {
		// We throw to make sure this fails at build time as this is never expected to happen
		throw new Error(`Page not found`)
	}

	return {
		props: agilityProps,
		revalidate: rebuildFrequency
	}
}

export async function getStaticPaths({ locales }: GetStaticPathsContext) {
	//get the paths configured in agility
	let agilityPaths = await getAgilityPaths(false)

	return {
		paths: agilityPaths,
		fallback: true,
	}
}

const AgilityPage = (props:any) => {
	return <Layout {...props} />;
}

export default AgilityPage

