import React from "react"
import {ContentZone} from "@agility/nextjs"
import {getModule} from "../agility-components"

const MainTemplate = (props: any) => {
	return <ContentZone name="MainContentZone" {...props} getModule={getModule} />
}

export default MainTemplate
