import React from "react"
import {ContentZone} from "@agility/nextjs"
import {getModule} from "../agility-components"

const MainTemplate = (props: any) => {
	return (
		<div>
			<ContentZone name="MainContentZone" {...props} getModule={getModule} />
		</div>
	)
}

export default MainTemplate
