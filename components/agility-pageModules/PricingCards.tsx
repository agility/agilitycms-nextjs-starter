import {useState} from "react"
import {RadioGroup} from "@headlessui/react"
import {CheckIcon} from "@heroicons/react/20/solid"
import Link from "next/link"
import {DateTime} from "luxon"
import {stripHtml} from "string-strip-html"
import {Module, AgilityImage, ContentItem, renderHTML, ModuleWithInit, URLField} from "@agility/nextjs"
import {IPost} from "../../lib/types/IPost"
import Image from "next/image"
import {IPricingCard} from "lib/types/IPricingCard"
import classNames from "lib/classNames"

const frequencies = [
	{value: "monthly", label: "Monthly", priceSuffix: "/month"},
	{value: "annually", label: "Annually", priceSuffix: "/year"},
]
const tiers = [
	{
		name: "Freelancer",
		id: "tier-freelancer",
		href: "#",
		price: {monthly: "$15", annually: "$144"},
		description: "The essentials to provide your best work for clients.",
		features: ["5 products", "Up to 1,000 subscribers", "Basic analytics", "48-hour support response time"],
		mostPopular: false,
	},
	{
		name: "Startup",
		id: "tier-startup",
		href: "#",
		price: {monthly: "$30", annually: "$288"},
		description: "A plan that scales with your rapidly growing business.",
		features: [
			"25 products",
			"Up to 10,000 subscribers",
			"Advanced analytics",
			"24-hour support response time",
			"Marketing automations",
		],
		mostPopular: true,
	},
	{
		name: "Enterprise",
		id: "tier-enterprise",
		href: "#",
		price: {monthly: "$60", annually: "$576"},
		description: "Dedicated support and infrastructure for your company.",
		features: [
			"Unlimited products",
			"Unlimited subscribers",
			"Advanced analytics",
			"1-hour, dedicated support response time",
			"Marketing automations",
			"Custom reporting tools",
		],
		mostPopular: false,
	},
]

interface IModule {
	cTA?: URLField
	heading?: string
}

const PricingCards: ModuleWithInit<IModule, IPricingCard[]> = ({module, customData}) => {
	// get module fields
	const {fields} = module

	console.log("pricing cards", fields, customData)

	const [frequency, setFrequency] = useState("monthly")

	return (
		<div className="bg-stone-100 py-24 sm:py-32">
			<div className="mx-auto max-w-7xl px-6 lg:px-8">
				<div className="mx-auto max-w-4xl text-center">
					<p className="mt-2 text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl">{fields.heading}</p>
				</div>

				<div className="isolate mx-auto mt-16 grid max-w-md grid-cols-1 gap-4 lg:mx-0 lg:max-w-none lg:grid-cols-4">
					{customData.map((tier) => (
						<div
							key={tier.title}
							className={classNames(
								tier.mostPopular ? "ring-2 ring-darkgray" : "ring-2 ring-white",
								"bg-white rounded-md p-8 xl:p-10 shadow"
							)}
						>
							<div className="flex items-center justify-between gap-x-4">
								<h3
									className={classNames(
										tier.mostPopular ? "text-primary-600" : "text-gray-900",
										"text-lg font-semibold leading-8"
									)}
								>
									{tier.title}
								</h3>
								{tier.mostPopular ? (
									<p className="rounded-full bg-primary-600/10 px-2.5 py-1 text-xs font-semibold leading-5 text-primary-600">
										Most popular
									</p>
								) : null}
							</div>
							<p className="mt-4 text-sm leading-6 text-gray-600 h-24">{tier.description}</p>
							<p className="mt-6 flex items-baseline gap-x-1">
								<span className="text-4xl font-bold tracking-tight text-gray-900 line-through">
									{tier.crossedOutPrice}
								</span>
							</p>
							<p className="mt-6 flex items-baseline gap-x-1">
								<span className="text-4xl font-bold tracking-tight text-gray-900">{tier.price}</span>
								<span className="text-sm font-semibold leading-6 text-gray-600">/mth</span>
							</p>
							{tier.buyNowLink && (
								<a
									href={tier.buyNowLink.href}
									className={classNames(
										tier.mostPopular
											? "bg-primary-600 text-white shadow-sm hover:bg-primary-500"
											: "text-primary-600 ring-1 ring-inset ring-primary-200 hover:ring-primary-300",
										"mt-6 block rounded-md py-2 px-3 text-center text-sm font-semibold leading-6 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-600"
									)}
									target={tier.buyNowLink.target}
								>
									{tier.buyNowLink.text}
								</a>
							)}
							<div
								className="mt-8 space-y-3 text-sm leading-6 text-gray-600 xl:mt-10"
								dangerouslySetInnerHTML={{__html: (tier.features || "").replaceAll("\n", "<br/>")}}
							></div>
						</div>
					))}
				</div>

				<div className="flex justify-center">
					{fields.cTA && (
						<a
							href={fields.cTA.href}
							className="mt-12 block p-3 px-5 rounded text-center text-base font-semibold text-white hover:bg-black bg-darkgray transition-all"
						>
							{fields.cTA.text}
						</a>
					)}
				</div>
			</div>
		</div>
	)
}

PricingCards.getCustomInitialProps = async ({agility, languageCode, channelName, item}) => {
	const {items} = await agility.getContentList({
		referenceName: "pricing",
		languageCode,
		channelName,
		depth: 1,
	})

	const pricing = items.map((item: ContentItem<IPricingCard>) => {
		return item.fields
	}) as IPricingCard[]

	return pricing
}

export default PricingCards
