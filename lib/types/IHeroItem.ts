
import { URLField, ImageField } from "@agility/nextjs"

export interface IHeroItem {
	audienceText: string
	audienceID: string
	heading?: string
	preHeading?: string
	description?: string
	image?: ImageField
	primaryCTA?: URLField
	secondaryCTA?: URLField


}


