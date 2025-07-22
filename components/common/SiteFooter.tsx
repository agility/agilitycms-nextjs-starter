import Image from "next/image"
import React from "react"
import { FaXTwitter, FaInstagram, FaSlack, FaYoutube } from "react-icons/fa6"

/**
 * This footer is not part of the content in the CMS, feel free to remove this for production use.
 */

const SiteFooter = () => {
	// set up Agility CMS Socials
	const socials = [
		{
			title: "X (Twitter)",
			url: "https://www.twitter.com/agilitycms",
			icon: <FaXTwitter className="text-xl md:ml-8 text-primary-500 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 transition duration-300" />,
		},
		{
			title: "Instagram",
			url: "https://www.instagram.com/agilitycms",
			icon: <FaInstagram className="text-xl md:ml-8 text-primary-500 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 transition duration-300" />,
		},
		{
			title: "Slack",
			url: "https://agilitycms.com/join-slack",
			icon: <FaSlack className="text-xl md:ml-8 text-primary-500 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 transition duration-300" />,
		},
		{
			title: "YouTube",
			url: "https://www.youtube.com/@AgilityCMS",
			icon: <FaYoutube className="text-xl md:ml-8 text-primary-500 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 transition duration-300" />,
		},
	]

	return (
		<footer className="relative px-8 py-6 md:py-4 mt-8 bg-gray-100 dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700">
			<div className="max-w-(--breakpoint-xl) mx-auto md:flex md:items-center">
				<div className="text-center mb-4 md:mb-0 md:text-left shrink-0 relative">
					<a href="https://www.agilitycms.com" target="_blank" rel="noreferrer" title="Agility CMS">
						{/* We use the built-in nextjs Image component here since this is referencing an SVG */}
						<Image src="/assets/agility-logo.svg" alt="Agility CMS" width={90} height={24} />
					</a>
				</div>
				<div className="grow mb-4 md:mb-0">
					<p className="text-center md:text-left text-gray-600 dark:text-gray-300 text-xs md:ml-8 md:max-w-3xl">
						Powered by Agility. This website and materials found on it are for demo purposes. You can use this to
						preview the content you created on your Agility CMS account.{"\u00A0"}
						<a
							href="https://github.com/agility/agilitycms-nextjs-starter"
							title="View on GitHub"
							target="_blank"
							rel="noreferrer"
							className="text-gray-600 dark:text-gray-300 mr-2 border-b border-gray-600 dark:border-gray-300"
						>
							GitHub
						</a>
						<a
							href="https://agilitycms.com/docs"
							title="Agility Docs"
							target="_blank"
							rel="noreferrer"
							className="text-gray-600 dark:text-gray-300 mr-1 border-b border-gray-600 dark:border-gray-300"
						>
							Agility Docs
						</a>
						{"\u00A0"}
						<a
							href="https://agilitycms.com/contact-us/chat-sales"
							title="Contact Us"
							target="_blank"
							rel="noreferrer"
							className="text-gray-600 dark:text-gray-300 border-b border-gray-600 dark:border-gray-300"
						>
							Contact Us
						</a>
					</p>
				</div>
				<div className="flex-1-grow">
					<ul className="flex justify-center md:justify-start">
						{socials.map((social, index) => (
							<li key={index} className="mx-4 md:mx-0">
								<a href={social.url} title={`Follow Agility CMS on ${social.title}`} target="_blank" rel="noreferrer">
									{social.icon}
								</a>
							</li>
						))}
					</ul>
				</div>
			</div>
		</footer>
	)
}

export default SiteFooter
