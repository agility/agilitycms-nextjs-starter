"use client"

// 'use client' marks this page as a Client Component
// https://beta.nextjs.org/docs/rendering/server-and-client-components

import {useEffect} from "react"

export default function Error({error, reset}: {error: Error; reset: () => void}) {
	useEffect(() => {
		// Log the error to an error reporting service
		console.error(error)
	}, [error])

	let message = `An unexpected error has occurred.`
	let title = `Error`
	if (error.message === "404") {
		message = `The page you were looking for could not be found.`
		title = `Page not found`
	}

	return (
		<section className="relative px-8">
			<div className="max-w-2xl mx-auto my-12 md:mt-18 lg:mt-20 prose prose-sm lg:prose-lg xl:prose-xl">
				<h1>{title}</h1>
				<p>{message}</p>
			</div>
		</section>
	)
}
