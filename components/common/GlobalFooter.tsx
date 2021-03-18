import React, { Component, useState } from 'react';
import Link from 'next/link';

import { ComponentWithInit, expandLinkedList } from "@agility/nextjs"

interface ICustomData {
	siteName: string
	siteDescription: string
	column2Title: string
	column3Title: string
	column4Title: string
	facebookURL: string
	twitterURL: string
	youTubeURL: string
	column2Links: any[]
	column3Links: any[]
	column4Links: any[]
}

const GlobalFooter:ComponentWithInit<ICustomData> = (props) => {
	const { globalData } = props;

	const globalFooterProps:ICustomData = globalData["footer"]

	if (globalFooterProps == null) {
		return (
			<footer>
				No footer
			</footer>
		)
	}

	return (

		<footer className="relative bg-gray-200">
			<div className="max-w-screen-xl mx-auto py-8 px-8 lg:py-20 flex flex-wrap justify-between">
				<div className="text-center md:text-left w-full md:w-2/5 mb-10 md:mb-0">
					{/* WIDE COLUMN 1  */}
					<div className="flex items-center justify-center md:justify-start">
						<div className="text-xl font-black text-primary-500">
							{globalFooterProps.siteName}
						</div>
					</div>
					<div className="mt-4 max-w-xs font-medium text-sm mx-auto md:mx-0 md:mr-4">
						{globalFooterProps.siteDescription}
					</div>
					<div className="mt-4">
						<a className="cursor-pointer inline-block p-2 rounded-full bg-gray-700 text-gray-100 hover:bg-gray-900 transition duration-300 mr-4"
							href={globalFooterProps.facebookURL} aria-label="Facebook">
							<svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24"><path d="M14 13.5h2.5l1-4H14v-2c0-1.03 0-2 2-2h1.5V2.14c-.326-.043-1.557-.14-2.857-.14C11.928 2 10 3.657 10 6.7v2.8H7v4h3V22h4v-8.5z"></path></svg>
						</a>
						<a className="cursor-pointer inline-block p-2 rounded-full bg-gray-700 text-gray-100 hover:bg-gray-900 transition duration-300 mr-4"
							href={globalFooterProps.twitterURL} aria-label="Twitter">
							<svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24"><path d="M22.162 5.656a8.384 8.384 0 01-2.402.658A4.196 4.196 0 0021.6 4c-.82.488-1.719.83-2.656 1.015a4.182 4.182 0 00-7.126 3.814 11.874 11.874 0 01-8.62-4.37 4.168 4.168 0 00-.566 2.103c0 1.45.738 2.731 1.86 3.481a4.168 4.168 0 01-1.894-.523v.052a4.185 4.185 0 003.355 4.101 4.21 4.21 0 01-1.89.072A4.185 4.185 0 007.97 16.65a8.394 8.394 0 01-6.191 1.732 11.83 11.83 0 006.41 1.88c7.693 0 11.9-6.373 11.9-11.9 0-.18-.005-.362-.013-.54a8.496 8.496 0 002.087-2.165z"></path></svg>
						</a>
						<a className="cursor-pointer inline-block p-2 rounded-full bg-gray-700 text-gray-100 hover:bg-gray-900 transition duration-300 mr-4"
							href={globalFooterProps.youTubeURL} aria-label="Youtube">
							<svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24"><path d="M21.543 6.498C22 8.28 22 12 22 12s0 3.72-.457 5.502c-.254.985-.997 1.76-1.938 2.022C17.896 20 12 20 12 20s-5.893 0-7.605-.476c-.945-.266-1.687-1.04-1.938-2.022C2 15.72 2 12 2 12s0-3.72.457-5.502c.254-.985.997-1.76 1.938-2.022C6.107 4 12 4 12 4s5.896 0 7.605.476c.945.266 1.687 1.04 1.938 2.022zM10 15.5l6-3.5-6-3.5v7z"></path></svg>
						</a>
						<a className="cursor-pointer inline-block p-2 rounded-full bg-gray-700 text-gray-100 hover:bg-gray-900 transition duration-300 mr-4"
							href="https://agilitycms.com" title="Powered by Agility CMS" aria-label="Agility CMS">
							<svg className="h-4 w-4" viewBox="0 0 74 74" fill="currentColor"><path d="M43.064 53.463H17.419l19.33-33.39 19.33 33.39 5.638 9.948h11.64L36.748.177.14 63.411h47.417z"></path></svg>
						</a>
					</div>
				</div>
				<div className="md:w-1/5">
					{/*  COLUMN 2  */}
					<div className="font-bold">{globalFooterProps.column2Title}</div>
					<ul className="mt-4 text-sm font-medium">
						{globalFooterProps.column2Links.map((flink, index) => {
							return (
								<li className="mt-3" key={`col2-${index}`}>
									<a href={flink.href} target={flink.target} rel="noreferrer" className="border-b-2 border-transparent hocus:text-primary-500 hocus:border-primary-500 pb-1 transition duration-300">{flink.text}</a>
								</li>
							)
						})}
					</ul>
				</div>
				<div className="md:w-1/5">
					{/* {# COLUMN 3 #} */}
					<div className="font-bold">{globalFooterProps.column3Title}</div>
					<ul className="mt-4 text-sm font-medium">
						{globalFooterProps.column3Links.map((flink, index) => {
							return (
								<li className="mt-3" key={`col3-${index}`}>
									<a href={flink.href} target={flink.target} rel="noreferrer" className="border-b-2 border-transparent hocus:text-primary-500 hocus:border-primary-500 pb-1 transition duration-300">{flink.text}</a>
								</li>
							)
						})}
					</ul>
				</div>
				<div className="md:w-1/5">
					{/* {# COLUMN 4 #} */}
					<div className="font-bold">{globalFooterProps.column4Title}</div>
					<ul className="mt-4 text-sm font-medium">
						{globalFooterProps.column4Links.map((flink, index) => {
							return (
								<li className="mt-3" key={`col4-${index}`}>
									<a href={flink.href} target={flink.target} rel="noreferrer" className="border-b-2 border-transparent hocus:text-primary-500 hocus:border-primary-500 pb-1 transition duration-300">{flink.text}</a>
								</li>
							)
						})}
					</ul>
				</div>
			</div>
		</footer>
	)

}

GlobalFooter.getCustomInitialProps = async function ({ agility, languageCode, channelName }) {

	const api = agility;

	let contentItem = null;

	try {
		//get the global footer
		let contentItemList = await api.getContentList({
			referenceName: "globalfooter",
			languageCode: languageCode
		});

		if (contentItemList?.length > 0) {
			contentItem = contentItemList[0];

			//resolve the links...
			contentItem = await expandLinkedList({
				agility, contentItem, languageCode,
				fieldName: "column2Links",
				sortIDField: "column2SortIDs"
			})

			contentItem = await expandLinkedList({
				agility, contentItem, languageCode,
				fieldName: "column3Links",
				sortIDField: "column3SortIDs"
			})

			contentItem = await expandLinkedList({
				agility, contentItem, languageCode,
				fieldName: "column4Links",
				sortIDField: "column4SortIDs"
			})

		} else {
			return null
		}


	} catch (error) {
		if (console) console.error("Could not load global footer item.", error);
	}

	//return a clean object...
	return {
		siteName: contentItem.fields.siteName,
		siteDescription: contentItem.fields.siteDescription,
		column2Title: contentItem.fields.column2Title,
		column3Title: contentItem.fields.column3Title,
		column4Title: contentItem.fields.column4Title,
		facebookURL: contentItem.fields.facebookURL,
		twitterURL: contentItem.fields.twitterURL,
		youTubeURL: contentItem.fields.youTubeURL,
		column2Links: contentItem.fields.column2Links.map(link => link.fields.link),
		column3Links: contentItem.fields.column3Links.map(link => link.fields.link),
		column4Links: contentItem.fields.column4Links.map(link => link.fields.link),

	}
}


export default GlobalFooter