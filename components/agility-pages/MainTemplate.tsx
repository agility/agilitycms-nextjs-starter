import React from "react"
// import {ContentZone} from "@agility/nextjs"
import { ContentZone } from "components/agility-components/ContentZone"
import {getComponent} from "../agility-components"

const MainTemplate = (props: any) => {
	return (
		<div>
			<ContentZone name="MainContentZone" {...props} getComponent={getComponent} />
		</div>
	)
}

export default MainTemplate
