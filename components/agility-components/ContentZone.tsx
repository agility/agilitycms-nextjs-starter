import React, {FC} from "react"
import { ContentZoneProps } from "lib/types/ContentZone"

export const ContentZone: FC<ContentZoneProps> = ({
	name,
	page,
	sitemapNode,
	dynamicPageItem,
	languageCode,
	channelName,
	getComponent,
	isDevelopmentMode,
	isPreview,
	globalData,
}) => {
	if (!page) return null

	const components = page.zones[name]
	if (!components) {
		console.warn(`Agility CMS => WARNING: No components found for zone called '${name}'`)
		return null
	}

	return (
		<>
			{components.map((c) => {
				let contentItemOrReference = c.item as any
				const componentName = c.module ?? contentItemOrReference.properties?.definitionName

				let AgilityComponent = null
				let props = {
					page,
					sitemapNode,
					dynamicPageItem,
					component: c.item,
					languageCode,
					channelName,
					customData: c.customData || null,
					isDevelopmentMode,
					isPreview,
					globalData: globalData,
				}

				if (componentName) {
					AgilityComponent = getComponent(componentName)
				}

				if (AgilityComponent) {
					return <AgilityComponent key={contentItemOrReference.contentID || contentItemOrReference.contentid} {...props} />
				} else {
					if (isPreview || isDevelopmentMode) {
						return (
							<div>
								The component for{" "}
								<em>
									<strong>{c.module}</strong>
								</em>{" "}
								was not found in the Agility Modules list.
							</div>
						)
					}

					throw new Error(`Component for ${c.module} was not found in the Agility Modules list.`)
				}
			})}
		</>
	)
}
