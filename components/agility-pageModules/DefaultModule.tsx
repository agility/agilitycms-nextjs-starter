import React from "react";

import {Module} from "@agility/nextjs"


const DefaultModule: Module<any> = (props) => {
	console.log(props)
	const {module} = props
	const {fields} = module
	return (
		<div className="px-8 bg-red-50">
			<div className="max-w-screen-xl mx-auto ">
				<h1 className="font-display text-secondary-500 text-4xl font-black tracking-wide">
					module {module.properties.definitionName} not found
				</h1>
			</div>
		</div>
	)
}

export default DefaultModule
