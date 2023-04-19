import React, {useState} from "react"
import Link from "next/link"
import head from "next/head"
import Image from "next/image"
import {AgilityImage, ComponentWithInit, ContentItem, CustomInitPropsArg, ImageField} from "@agility/nextjs"
import { IBannerItem } from "lib/types/IBannerItem"



const StickyHeader: ComponentWithInit<IBannerItem | null> = ({ globalData, sitemapNode, page }) => {

	const banner: IBannerItem | null= globalData ? globalData["banner"] : null

	if (banner == null) return null

	return (
		<>
			<div className="fixed w-full top-0 h-96 z-[-1] bg-sky-950 text-white">
				<div className="text-3xl">{banner.heading1}</div>
				<div className="text-3xl">{banner.heading2}</div>
				<div className="text-3xl">{banner.heading3}</div>
				<div>
					<a href={banner.cTA?.href} target={banner.cTA?.target}>{banner.cTA?.text}</a>
				</div>
			</div>
			<div className="mt-96"></div>
		</>
	)
}



StickyHeader.getCustomInitialProps = async function ({agility, languageCode, channelName}: CustomInitPropsArg) {
	// set up api
	const api = agility

	// set up content item
	let contentItem: ContentItem<IBannerItem> | null = null

	// set up links
	let links = []

	try {
		// fetch the banner messages
		let lstBannerMessage = await api.getContentList({
			referenceName: "topbannermessage",
			languageCode: languageCode,
			contentLinkDepth: 2,
			take: 50,
		})

		//TODO: filter by audience


		// if we have a header, set as content item
		if (lstBannerMessage && lstBannerMessage.items && lstBannerMessage.items.length > 0) {
			contentItem = lstBannerMessage.items[0]
		}

		if (!contentItem) {
			return null
		}
	} catch (error) {
		if (console) console.error("Could not load banner item.", error)
		return null
	}

	// return clean object...
	return contentItem.fields
}

export default StickyHeader