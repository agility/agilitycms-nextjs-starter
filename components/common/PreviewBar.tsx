import React, { useState} from 'react';

const PreviewBar = ({ isPreview, isDevelopmentMode }) => {

	const [open, setOpen] = useState(true)

	if (!isPreview && !isDevelopmentMode) return null

	return (
		<div className="bg-indigo-600"
			style={{display: open ? "auto" : "none"}} >
		<div className="max-w-screen-xl mx-auto py-3 px-3 sm:px-6 lg:px-8">
			<div className="flex items-center justify-between flex-wrap">
			<div className="w-0 flex-1 flex items-center">
				<span className="flex p-2 rounded-lg bg-indigo-800">
				<img src="https://static.agilitycms.com/brand/agility-triangle-yellow.svg" alt="" className="w-5 h-5" />
				</span>
				<p className="ml-3 font-medium text-white truncate">
				<span className="md:hidden">
					Agility CMS - { isPreview ? "Preview" : "Development" } Mode
				</span>
				<span className="hidden md:inline">
					Agility CMS - Y'all are in { isPreview ? "Preview" : "Development" } Mode
				</span>
				</p>
			</div>

			<div className="order-2 flex-shrink-0 sm:order-3 sm:ml-3">
				<button onClick={() => setOpen(false)} aria-label="Close Preview" type="button" className="-mr-1 flex p-2 rounded-md hover:bg-indigo-500 focus:outline-none focus:bg-indigo-500 sm:-mr-2 transition ease-in-out duration-150" aria-label="Dismiss">
				{/* <!-- Heroicon name: x --> */}
				<svg className="h-6 w-6 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
					<path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
				</svg>
				</button>
			</div>
			</div>
		</div>
		</div>

	)


	// if (isPreview && !isDevelopmentMode) {
	// 	return (
	// 		<div className="agility-preview-bar">
	// 			<img className="agility-preview-bar__logo" src="https://media.agilitycms.com/preview-bar/2018-11/agility-logo-preview-bar-1.png" alt="Powered by Agility CMS" />
	// 			<span className="agility-preview-bar__text">You are viewing the latest changes in <strong>Preview Mode</strong>.</span>
	// 			<div>
	// 				<button className="agility-preview-bar__btn agility-preview-bar__btn-share" title="Click to generate a share-able link" onClick={getPreviewLink}>Share</button>
	// 				<button className="agility-preview-bar__btn" title="Click to exit preview" onClick={exitPreview}>Exit Preview</button>
	// 			</div>
	// 		</div>
	// 	)
	// } else if(isDevelopmentMode) {
	// 	return (
	// 		<div className="agility-preview-bar">
	// 			<img className="agility-preview-bar__logo" src="https://media.agilitycms.com/preview-bar/2018-11/agility-logo-preview-bar-1.png" alt="Powered by Agility CMS" />
	// 			<span className="agility-preview-bar__text">You are viewing the latest changes in <strong>Development Mode</strong>.</span>
	// 			<div></div>
	// 		</div>
	// 	)
	// } else {
	// 	return null
	// }
}

const exitPreview = () => {
	const exit = confirm("Would you like to exit Preview Mode?");
	if (exit === true) {
		window.location = `/api/exitPreview?slug=${window.location.pathname}`;
	}
}

const getPreviewLink = () => {
	const xhr = new XMLHttpRequest();
	xhr.onload = function () {

		// Process our return data
		if (xhr.status >= 200 && xhr.status < 300) {
			// What do when the request is successful

			const previewKey = xhr.responseText;
			const previewLink = `${window.location.pathname}?agilitypreviewkey=${escape(previewKey)}`;

			prompt("To share this page in preview mode with others, copy the link below:", previewLink);

		} else {
			// What do when the request fails
			alert('Could not generate Preview Link. This indicates a problem with the API route that generates a Preview Link.')
		}
	};

	// Create and send a GET request
	xhr.open('GET', '/api/generatePreviewKey');
	xhr.send();
}

export default PreviewBar;