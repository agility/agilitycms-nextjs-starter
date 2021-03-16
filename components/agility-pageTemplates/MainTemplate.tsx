import React, { Component } from 'react';
import ContentZone from 'components/agility-global/ContentZone'

const MainTemplate = (props:any) => {

	return (
	<div className="max-w-screen-xl mx-auto p-4 sm:p-6 lg:p-6 lg:p-">
		<ContentZone name='MainContentZone' {...props} />
	</div>
	);

}

export default MainTemplate;