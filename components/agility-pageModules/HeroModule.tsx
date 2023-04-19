import React from "react"
import { AgilityImage, ContentItem, Module, ModuleWithInit} from "@agility/nextjs"
import Link from "next/link"
import { IHeroItem } from "../../lib/types/IHeroItem"

interface IHeroList {
	heroContent?: ContentItem<IHeroItem>[]
}

const Hero: Module<IHeroList> = ({module}) => {
	// get module fields

	const {fields} = module
	const imagePosition = "right"

	//TODO: select the hero card based on the current Audience
	const heroItem: IHeroItem | null =  fields.heroContent ? fields.heroContent[0].fields || null : null

	const isUrlAbsolute = (url: string) => url.indexOf("://") > 0 || url.indexOf("//") === 0

	// function to generate proper link
	const generateLink = (url: string, target: string, text: string, className?: string) => {
		if (!className) {
			className =
				"inline-block mt-8 md:mt-8 px-8 py-3 border border-transparent text-base leading-6 font-medium rounded-md text-white bg-primary-500 hover:bg-primary-700 focus:outline-none focus:border-primary-700 focus:shadow-outline-indigo active:bg-indigo-700 transition ease-in-out duration-150"
		}

		// if relative link, use next/link
		if (isUrlAbsolute(url) === false) {
			return (
				<Link href={url} title={text} target={target} className={className}>
					{text}
				</Link>
			)
		} else {
			// else use anchor tag
			return (
				<a href={url} title={text} target={target} className={className}>
					{text}
				</a>
			)
		}
	}

	if (!heroItem) return <div></div>

	return (
		<div className="relative px-8">
			<div className="flex flex-col md:flex-row justify-between max-w-screen-xl mx-auto py-20 md:py-24 items-center">
				<div className="md:w-6/12 flex-shrink-0 relative ">
					{heroItem.primaryCTA && heroItem.image ? (
						<Link href={heroItem.primaryCTA.href} className="relative">
							<AgilityImage
								src={heroItem.image.url}
								alt={heroItem.image.label || "Hero Image"}
								width="768"
								height="512"
								className="rounded-lg object-cover object-center cursor-pointer aspect-[6/4]"
								priority
							/>
						</Link>
					) : heroItem.image ? (
						<AgilityImage
							src={heroItem.image.url}
							alt={heroItem.image.label || "Hero Image"}
							width="768"
							height="512"
							className="rounded-lg object-cover object-center"
							priority
						/>
					) : (
						""
					)}
				</div>
				<div
					className={`md:w-6/12 mt-16 md:mt-0 ${
						imagePosition != "right" ? `md:ml-12 lg:ml-16 md:order-last` : `md:mr-12 lg:mr-16 md:order-first`
					}`}
				>
					<div className="g:py-8 text-center md:text-left">
						{heroItem.preHeading && (
							<span className="font-bold text-primary-500 text-sm text-center md:text-left uppercase">
								{heroItem.preHeading}
							</span>
						)}
						<h2 className="font-display text-4xl font-black text-secondary-500 md:text-3xl lg:text-5xl tracking-wide text-center mt-4 lg:leading-tight md:text-left">
							{heroItem.heading}
						</h2>
						<p className="mt-4 text-center md:text-left text-sm md:text-base lg:text-lg font-medium leading-relaxed text-secondary-200">
							{heroItem.description}
						</p>
						<div className="flex gap-2">
							{heroItem.primaryCTA &&
								generateLink(heroItem.primaryCTA.href, heroItem.primaryCTA.target, heroItem.primaryCTA.text)}

							{heroItem.secondaryCTA &&
								generateLink(
									heroItem.secondaryCTA.href,
									heroItem.secondaryCTA.target,
									heroItem.secondaryCTA.text,
									"inline-block mt-8 md:mt-8 px-8 py-3 border border-transparent text-base leading-6 font-medium rounded-md border-2 text-darkgray bg-white hover:bg-darkgray hover:text-white focus:outline-none border-darkgray focus:shadow-outline-darkgray active:bg-darkgray transition ease-in-out duration-150"
								)}
						</div>
					</div>
				</div>
			</div>
		</div>
	)
}

export default Hero
