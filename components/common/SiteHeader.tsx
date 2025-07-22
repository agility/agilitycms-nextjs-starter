"use client"

import React, { useState, useEffect } from "react"
import Link from "next/link"
import { IHeaderData } from "lib/cms-content/getHeaderContent"
import { AgilityImage } from "@agility/nextjs"
import { Switch } from '@headlessui/react'
import { IconBrightnessDown, IconBrightnessUp } from "@tabler/icons-react"

interface Props {
	header: IHeaderData | null
}

const SiteHeader = ({ header }: Props) => {
	// open / close mobile nav
	const [open, setOpen] = useState(false)
	const [darkMode, setDarkMode] = useState(false)
	useEffect(() => {
		// set inital dark mode based on user preference
		const darkModePreference = window.matchMedia("(prefers-color-scheme: dark)");

		function handleDarkModeChange(event: any) {
			if (event.matches) {
				// User prefers dark mode
				setDarkMode(true)
			} else {
				// User prefers light mode
				setDarkMode(false)
			}
		}

		// Initial check for dark mode preference
		handleDarkModeChange(darkModePreference);

		// Listen for changes in dark mode preference
		darkModePreference.addEventListener("change", handleDarkModeChange);

		return () => {
			darkModePreference.removeEventListener("change", handleDarkModeChange);
		}

	}, [])

	useEffect(() => {
		//set the dark mode class on the html element
		document.documentElement.classList.toggle('dark', darkMode)

	}, [darkMode])

	if (!header) {
		return (
			<header className="relative p-8 text-center">
				<p className="text-gray-400 font-bold">No Header Available</p>
			</header>
		)
	}

	return (
		<header className="relative w-full mx-auto bg-white dark:bg-gray-900 px-8 transition-colors duration-300">
			<div className="max-w-(--breakpoint-xl) mx-auto">
				<div className="flex justify-between items-center py-6 md:justify-start md:space-x-10 w-full">
					<div className="md:w-0 md:flex-1">
						<Link href="/" className="flex items-center">
							<AgilityImage
								className="h-10 sm:h-12 w-auto"
								src={header.logo.url}
								alt={header.logo.label}
								width={header.logo.height}
								height={header.logo.width}
								fill={false}
							/>
							<p className="font-bold text-xl text-secondary-500 ml-3 mt-2 sr-only" >{header.siteName}</p>
						</Link>
					</div>
					<div className="flex items-center space-x-4">
						<Switch
							checked={darkMode}
							onChange={setDarkMode}
							title="Toggle dark mode"
							className="group relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent bg-gray-200 dark:bg-gray-700 transition-colors duration-200 ease-in-out focus:ring-2 focus:ring-indigo-600 focus:ring-offset-2 focus:outline-hidden data-checked:bg-indigo-600"
						>
							<span className="sr-only">Toggle dark mode</span>
							<span className="pointer-events-none relative inline-block size-5 transform rounded-full bg-white dark:bg-gray-900 shadow-xs ring-0 transition duration-200 ease-in-out group-data-checked:translate-x-5">
								<span
									aria-hidden="true"
									className="absolute inset-0 flex size-full items-center justify-center transition-opacity duration-200 ease-in group-data-checked:opacity-0 group-data-checked:duration-100 group-data-checked:ease-out"
								>
									<IconBrightnessDown />
								</span>
								<span
									aria-hidden="true"
									className="absolute inset-0 flex size-full items-center justify-center opacity-0 transition-opacity duration-100 ease-out group-data-checked:opacity-100 group-data-checked:duration-200 group-data-checked:ease-in"
								>
									<IconBrightnessUp className="text-slate-500" />
								</span>
							</span>
						</Switch>

						<div className="-mr-2 -my-2 md:hidden">
							<button
								onClick={() => setOpen(!open)}
								aria-label="Toggle Menu"
								type="button"
								className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-hidden focus:bg-gray-100 focus:text-gray-500 transition duration-150 ease-in-out"
							>
								{/* <!-- Heroicon name: menu --> */}
								<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
									<path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
								</svg>

							</button>
						</div>
					</div>
					<nav className="hidden md:flex space-x-10">
						{header.links.map((navitem, index) => {
							return (
								<Link
									href={navitem.path}
									key={`mobile-${index}`}
									className="text-base leading-6 font-medium text-secondary-500 dark:text-secondary-200 hover:text-primary-500 dark:hover:text-primary-400 border-transparent border-b-2 hover:border-primary-500 dark:hover:border-primary-400 hover:border-b-primary hover:border-b-2 focus:outline-hidden focus:text-primary-500 dark:focus:text-primary-400 transition duration-300"
								>
									{navitem.title}
								</Link>
							)
						})}
					</nav>
				</div>
			</div>

			<div
				className="absolute top-0 inset-x-0 p-2 transition transform origin-top-right md:hidden z-20"
				style={{ display: open ? "block" : "none" }}
			>
				<div className="rounded-lg shadow-lg">
					<div className="rounded-lg shadow-2xs bg-white dark:bg-gray-900 divide-y-2 divide-gray-50 dark:divide-gray-800">
						<div className="pt-5 pb-6 px-5 space-y-6">
							<div className="flex items-center justify-between ">
								<div>
									<Link href="/" className="flex items-center">
										<AgilityImage
											className="h-14 sm:h-20 w-auto"
											src={header.logo.url}
											alt={header.logo.label}
											width={header.logo.height}
											height={header.logo.width}
											fill={false}
										/>
										<p className="font-bold text-xl text-secondary-500 ml-3 mt-2">{header.siteName}</p>
									</Link>
								</div>
								<div className="">
									<button
										onClick={() => setOpen(!open)}
										aria-label="Toggle Menu"
										type="button"
										className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-hidden focus:bg-gray-100 focus:text-gray-500 transition duration-300"
									>
										{/* <!-- Heroicon name: x --> */}
										<svg
											className="h-6 w-6"
											xmlns="http://www.w3.org/2000/svg"
											fill="none"
											viewBox="0 0 24 24"
											stroke="currentColor"
										>
											<path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
										</svg>
									</button>
								</div>
							</div>
							<div>
								<nav className="grid gap-y-8 ">
									{header.links.map((navitem, index) => {
										return (
											<Link
												key={`nav-${index}`}
												href={navitem.path}
												onClick={() => setOpen(false)}
												className="-m-3 p-3 flex items-center space-x-3 rounded-md hover:bg-gray-50 transition duration-300"
											>
												{/* <!-- Heroicon name: view-grid --> */}
												<svg
													className="shrink-0 h-6 w-6 text-primary-600"
													xmlns="http://www.w3.org/2000/svg"
													fill="none"
													viewBox="0 0 24 24"
													stroke="currentColor"
												>
													<path
														strokeLinecap="round"
														strokeLinejoin="round"
														strokeWidth="2"
														d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"
													/>
												</svg>
												<div className="text-base leading-6 font-medium text-gray-900 dark:text-gray-100">{navitem.title}</div>
											</Link>
										)
									})}
								</nav>
							</div>
						</div>
					</div>
				</div>
			</div>
		</header>
	)
}

export default SiteHeader
