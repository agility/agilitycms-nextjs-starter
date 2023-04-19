import { URLField } from "@agility/nextjs"

export interface IPricingCard {
	title?: string
	description?: string
	crossedOutPrice?: string
	price?: string
	savingsDescription?: string
	buyNowLink?: URLField
	features?: string
	mostPopular?: boolean
}