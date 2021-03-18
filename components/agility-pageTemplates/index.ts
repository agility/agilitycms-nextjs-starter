import MainTemplate from "./MainTemplate"

interface TemplateObj {
	name:string,
	template:any
}

/**
 * All the Agility Page Template components that are in use in this site.
 */
const allTemplates:[TemplateObj] =[
	{ name: "MainTemplate", template:MainTemplate }
]

export const getPageTemplate = (templateName:string):any => {
	if (! templateName) return null
	const obj = allTemplates.find(m => m.name.toLowerCase() === templateName.toLowerCase())
	if (! obj) return null
	return obj?.template
}
