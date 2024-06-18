"use client"

import Image from "next/image"
import React, {useState} from "react"
import {FaInfoCircle, FaGithub, FaChevronDown, FaChevronUp, FaSpinner, FaSyncAlt} from "react-icons/fa"

interface Props {
	isPreview: boolean | undefined
	isDevelopmentMode: boolean | undefined
	startPreviewMode: (pathname: string) => Promise<void>
}

/**
 * This is a preview bar that is enabled by default to handle viewing content in preview & live mode, remove this for production use.
 **/
const PreviewBar = ({isPreview, isDevelopmentMode, startPreviewMode}: Props) => {
	const [open, setOpen] = useState(false)
	const [isPreviewRequested, setisPreviewRequested] = useState(false)

	// handle view function to determine preview / live mode
	const handleView = () => {
		if (isDevelopmentMode) {
			alert("You are currently in Development Mode, Live Mode is unavailable.")
		} else {
			if (!isDevelopmentMode && !isPreview) {
				setisPreviewRequested(true)

				// start preview mode
				startPreviewMode(window.location.pathname)
					.then(() => {
						console.log("Preview Mode Started")
					})
					.catch((error) => {
						console.error("Error generating preview key", error)
					})
					.finally(() => {
						setOpen(false)
						setisPreviewRequested(false)
					})
			} else {
				const exit = confirm("Would you like to exit Preview Mode?")
				if (exit === true) {
					window.location.href = `/api/preview/exit?slug=${encodeURIComponent(window.location.pathname)}`
				} else return
			}
		}
	}

	return (
		<div className="bg-agility relative px-8 text-gray-200" data-agility-previewbar>
			<div className="flex justify-between items-center max-w-screen-xl mx-auto">
				<div className="flex items-center">
					<span className="p-2 rounded-lg mr-4">
						<a href="https://app.agilitycms.com" target="_blank" rel="noreferrer" title="Agility CMS">
							{/* We use the built-in nextjs Image component here since this is referencing an SVG */}
							<Image
								src="/assets/agility-logo-triangle.svg"
								alt="Agility CMS"
								className="w-5 h-5 block md:hidden"
								width={20}
								height={20}
							/>
							<Image
								src="/assets/agility-preview-logo.svg"
								alt="Agility CMS"
								className="h-5 w-20 hidden md:block"
								width={80}
								height={20}
							/>
						</a>
					</span>
					<div className="mr-4">
						<a href="https://agilitycms.com/docs" target="_blank" rel="noreferrer" title="Help Center">
							<div className="flex items-center">
								<FaInfoCircle className="text-2xl mr-2" />
								<p className="hidden md:block text-sm">Agility Docs</p>
							</div>
						</a>
					</div>
					<div>
						<a
							href="https://github.com/agility/agilitycms-nextjs-starter"
							target="_blank"
							rel="noreferrer"
							title="View on GitHub"
							className="text-2xl"
						>
							<div className="flex items-center">
								<FaGithub className="mr-2" />
								<p className="hidden md:block text-sm">View on GitHub</p>
							</div>
						</a>
					</div>
				</div>
				<div className={`relative flex items-center ${open ? `bg-white ` : `bg-agility`} py-4`}>
					{isPreview ? (
						<p className={`hidden md:block text-sm px-2 ${open ? `text-agility` : `text-gray-200`}`}>
							Previewing <span className="font-bold">Latest</span> Changes
						</p>
					) : (
						<p className={`hidden md:block text-sm px-2 ${open ? `text-agility` : `text-gray-200`}`}>
							Viewing <span className="font-bold">Published</span> Content
						</p>
					)}
					<div className="p-2 text-gray-200 rounded-lg cursor-pointer z-20" onClick={() => setOpen(!open)}>
						{open ? <FaChevronUp className="text-agility" /> : <FaChevronDown className="text-gray-200" />}
					</div>
					<div
						className="absolute bg-white text-white text-sm py-4 px-4 w-15.1 -right-0 -bottom-28 md:-bottom-16 z-10 rounded-b-lg shadow-xl md:max-w-full"
						style={{display: open ? "block" : "none"}}
					>
						{isPreview ? (
							<p className="mb-4 text-center md:hidden text-agility z-20">
								Previewing <span className="font-bold">Latest</span> Changes
							</p>
						) : (
							<p className="mb-4 text-center md:hidden text-agility z-20">
								Viewing <span className="font-bold">Published</span> Content
							</p>
						)}
						<button
							className="text-gray-200 bg-agility p-2 w-full rounded-md text-sm disabled:bg-gray-700 flex gap-2 items-center justify-center"
							onClick={() => handleView()}
							aria-disabled={isPreviewRequested}
							disabled={isPreviewRequested}
						>
							{isPreviewRequested && <FaSpinner className="animate-spin" />}
							{`View ${isPreview ? `Live` : `Preview`} Mode`}
						</button>
					</div>
				</div>
			</div>
		</div>
	)
}

export default PreviewBar
