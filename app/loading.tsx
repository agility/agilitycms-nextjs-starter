"use client"

import LoadingWidget from "components/common/LoadingWidget"
import {useEffect, useId, useState} from "react"

export default function Loading() {
	const [showMessage, setShowMessage] = useState(false)

	useEffect(() => {
		setTimeout(() => {
			setShowMessage(true)
		}, 500)
	}, [])

	if (!showMessage) return <section className="flex flex-col items-center justify-center h-screen"></section>

	// Or a custom loading skeleton component
	return <LoadingWidget message="Loading..." />
}
