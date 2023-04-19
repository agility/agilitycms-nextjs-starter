import React, {useState} from "react"
import Link from "next/link"
import head from "next/head"
import Image from "next/image"
import {AgilityImage, ComponentWithInit, ContentItem, CustomInitPropsArg, ImageField} from "@agility/nextjs"


interface ILink {
	title: string
	path: string
}

interface ICustomData {
	siteName: string
	logo: ImageField
	links: ILink[]
}

const SiteHeader: ComponentWithInit<ICustomData | null> = ({globalData, sitemapNode, page}) => {
	// open / close mobile nav
	const [open, setOpen] = useState(false)

	// get header data
	const header: ICustomData = globalData ? globalData["header"] : null


	return (
		<header className="sticky w-full mx-auto bg-white px-8">
			<div className="max-w-screen-xl mx-auto">
				<div className="hidden lg:flex justify-between items-center py-6 gap-7 text-base">
					<nav className="flex gap-7  items-center">
						<Link href="/" className="flex items-center flex-shrink-0">
							<img src="/assets/intuit-qb-logo.svg" alt="Intuit Quickbooks Logo" className="h-7 w-auto" />
						</Link>
						<a href="#">Products</a>
						<a href="#">Plans &amp; Pricing</a>
						<a href="#">Learn &amp; Support</a>
					</nav>
					<div className="flex gap-2">
						<a href="#" className="flex gap-2 items-center">
							<img
								src="data:image/svg+xml,%3c%3fxml version='1.0' encoding='UTF-8'%3f%3e%3csvg xmlns='http://www.w3.org/2000/svg' xmlns:xlink='http://www.w3.org/1999/xlink' width='16' height='16' viewBox='0 0 16 16'%3e %3cdefs%3e %3cpath id='f1gmbhd0aa' d='M11.565 9.05c.282-.282.726-.319 1.05-.087l2.693 1.923c.41.292.459.884.102 1.24l-1.627 1.627c-1.911 1.91-5.009 1.91-6.922 0L2.247 9.138c-1.91-1.911-1.91-5.01 0-6.922L3.874.59c.356-.357.947-.307 1.24.103l1.923 2.692c.232.324.195.77-.087 1.05l-.665.666c-.637.637-.637 1.669 0 2.306l2.308 2.308c.637.637 1.67.637 2.306 0l.666-.665z'/%3e %3c/defs%3e %3cg fill='none' fill-rule='evenodd'%3e %3cmask id='b50uu7k40b' fill='white'%3e %3cuse xlink:href='%23f1gmbhd0aa'/%3e %3c/mask%3e %3cpath fill='%2353B700' d='M-7 23L27 23 27 -11 -7 -11z' mask='url(%23b50uu7k40b)'/%3e %3c/g%3e%3c/svg%3e"
								alt="PhoneIcon"
							></img>
							For Sales: 1-888-870-5848
						</a>
						<div>|</div>
						<a href="#">FR</a>
						<div>|</div>
						<a href="#">Sign In</a>
					</div>
				</div>
				<div className="lg:hidden py-6">
					<Link href="/" className="flex items-center">
						<img src="/assets/intuit-qb-logo.svg" alt="Intuit Quickbooks Logo" className="h-7 w-auto" />
					</Link>
				</div>
			</div>
		</header>
	)
}


export default SiteHeader
