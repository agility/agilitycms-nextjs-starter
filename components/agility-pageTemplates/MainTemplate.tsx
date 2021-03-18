import React from 'react';
import { ContentZone } from '@agility/nextjs'

import { getModule } from "components/agility-modules"

const MainTemplate = (props) => {

	return (
	<div className="max-w-screen-xl mx-auto p-4 sm:p-6 lg:p-6 lg:p-">
		<ContentZone name='MainContentZone' {...props} getModule={getModule}  />
	</div>
	);

}

export default MainTemplate;