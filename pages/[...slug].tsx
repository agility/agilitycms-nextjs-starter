import type {
	GetStaticPathsContext,
	GetStaticPropsContext,
	InferGetStaticPropsType,

} from 'next'

import Layout from "components/common/Layout"

import { getAgilityPageProps, getAgilityPaths } from "@agility/nextjs/node"
import { handlePreview } from "@agility/nextjs"
import { getModule } from "components/agility-modules"
import GlobalHeader from "components/common/GlobalHeader"
import GlobalFooter from "components/common/GlobalFooter"
import LoadingWidget from "components/common/LoadingWidget"

export async function getStaticProps({ preview, params, locale, defaultLocale, locales }: GetStaticPropsContext<{ slug: string[] }>) {

	const globalComponents = {
		"header": GlobalHeader,
		"footer": GlobalFooter
	}

	const agilityProps = await getAgilityPageProps({ preview, params, locale, getModule, defaultLocale, globalComponents });

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

export async function getStaticPaths({ locales, defaultLocale }: GetStaticPathsContext) {

	//get the paths configured in agility
	let agilityPaths = await getAgilityPaths({ preview:false, locales, defaultLocale })

	return {
		paths: agilityPaths,
		fallback: true,
	}
}

const AgilityPage = (props:any) => {
	if (handlePreview()) {
		return <LoadingWidget message="Activating preview mode..."/>
	}

	return <Layout {...props} />;
}

export default AgilityPage

