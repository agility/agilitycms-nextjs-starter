import React, { Component, useState } from 'react';
import Link from 'next/link';

const GlobalHeader = (props) => {
	const [open, setOpen] = useState(false)

	const { globalHeaderProps, sitemapNode, page } = props;

	const globalHeader = globalHeaderProps.contentItem;
	const links = globalHeaderProps.links
	let siteName = globalHeader?.fields.siteName || "Agility Starter 2021"
	let logo = globalHeader?.fields.logo || null

	let href = "/pages/[...slug]"

	return (
		<header className="relative bg-white" >
			<div className="max-w-7xl mx-auto px-4 sm:px-6">
				<div className="flex justify-between items-center border-b-2 border-gray-100 py-6 md:justify-start md:space-x-10">
					<div className="lg:w-0 lg:flex-1">
						<Link href="/" as="/">
							<a className="flex">
								{logo &&
									<img className="h-8 w-auto sm:h-10" src={logo.url} alt={logo.label} title={siteName} />
								}
							</a>
						</Link>
					</div>
					<div className="-mr-2 -my-2 md:hidden">
						<button onClick={() => setOpen(!open)} aria-label="Toggle Menu" type="button" className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:bg-gray-100 focus:text-gray-500 transition duration-150 ease-in-out">
							{/* <!-- Heroicon name: menu --> */}
							<svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
								<path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
							</svg>
						</button>
					</div>
					<nav className="hidden md:flex space-x-10">

						{links.map((navitem, index) => {
							return (
								<Link href={href} key={`mobile-${index}`} as={navitem.path}>
									<a className="text-base leading-6 font-medium text-gray-500 hover:text-gray-900 focus:outline-none focus:text-gray-900 transition ease-in-out duration-150">
										{navitem.title}
									</a>
								</Link>
							)
						})}

					</nav>
					<div className="hidden md:flex items-center justify-end space-x-8 md:flex-1 lg:w-0">
						{globalHeader.fields.primaryCTA &&
							<span className="inline-flex rounded-md shadow-sm">
								<a href={globalHeader.fields.primaryCTA.href} target={globalHeader.fields.primaryCTA.target} className="whitespace-nowrap inline-flex items-center justify-center px-4 py-2 border border-transparent text-base leading-6 font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-500 focus:outline-none focus:border-indigo-700 focus:shadow-outline-indigo active:bg-indigo-700 transition ease-in-out duration-150">
									{globalHeader.fields.primaryCTA.text}
								</a>
							</span>
						}
					</div>
				</div>
			</div>

			{/* <!--
			Mobile menu, show / hide based on mobile menu state.

				Entering: "duration-200 ease-out"
			From: "opacity-0 scale-95"
			To: "opacity-100 scale-100"
			Leaving: "duration-100 ease-in"
			From: "opacity-100 scale-100"
			To: "opacity-0 scale-95"
			--> */}

			< div className="absolute top-0 inset-x-0 p-2 transition transform origin-top-right md:hidden z-20"
				style={{ display: open ? "block" : "none" }}>
				<div className="rounded-lg shadow-lg">
					<div className="rounded-lg shadow-xs bg-white divide-y-2 divide-gray-50">
						<div className="pt-5 pb-6 px-5 space-y-6">
							<div className="flex items-center justify-between">
								<div>
									{logo &&
										<img className="h-8 w-auto sm:h-10" src={logo.url} alt={logo.label} title={globalHeader.fields.siteName} />
									}
								</div>
								<div className="-mr-2">
									<button onClick={() => setOpen(!open)} aria-label="Toggle Menu" type="button" className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:bg-gray-100 focus:text-gray-500 transition duration-150 ease-in-out">
										{/* <!-- Heroicon name: x --> */}
										<svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
											<path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
										</svg>
									</button>
								</div>
							</div>
							<div>
								<nav className="grid gap-y-8">

									{links.map((navitem, index) => {
										return (
											<Link key={`nav-${index}`} href={href} as={navitem.path}>
												<a onClick={() => setOpen(false)} className="-m-3 p-3 flex items-center space-x-3 rounded-md hover:bg-gray-50 transition ease-in-out duration-150">
												{/* <!-- Heroicon name: view-grid --> */}
												<svg className="flex-shrink-0 h-6 w-6 text-indigo-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
													<path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
												</svg>
												<div className="text-base leading-6 font-medium text-gray-900">
													{navitem.title}
												</div>
												</a>
											</Link>
										)
									})}
								</nav>
							</div>
						</div>

						<div className="space-y-6 p-2">
							<span className="w-full flex rounded-md shadow-sm">

								{globalHeader.fields.primaryCTA &&
									<a href={globalHeader.fields.primaryCTA.path} target={globalHeader.fields.primaryCTA.target} className="w-full flex items-center justify-center px-4 py-2 border border-transparent text-base leading-6 font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-500 focus:outline-none focus:border-indigo-700 focus:shadow-outline-indigo active:bg-indigo-700 transition ease-in-out duration-150">
										{globalHeader.fields.primaryCTA.text}
									</a>
								}

							</span>
						</div>
					</div>
				</div >
			</div >
		</header >
	)

}

GlobalHeader.getCustomInitialProps = async function (props) {

	const api = props.agility;
	const languageCode = props.languageCode;
	const channelName = props.channelName;
	let contentItem = null;
	let links = [];

	try {
		//get the global header
		let contentItemList = await api.getContentList({
			referenceName: "globalheader",
			languageCode: languageCode
		});

		if (contentItemList && contentItemList.length) {
			contentItem = contentItemList[0];

		}
	} catch (error) {
		if (console) console.error("Could not load global header item.", error);
	}


	try {
		//get the nested sitemap
		let sitemap = await api.getSitemapNested({
			channelName: channelName,
			languageCode: languageCode,
		});

		//grab the top level links that are visible on menu
		links = sitemap
			.filter(node => node.visible.menu)
			.map(node => {
				return {
					title: node.menuText || node.title,
					path: node.path
				}
			})

	} catch (error) {
		if (console) console.error("Could not load nested sitemap.", error);
	}

	return {
		contentItem,
		links
	}
}


export default GlobalHeader