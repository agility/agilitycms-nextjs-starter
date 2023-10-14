import {Module} from "@agility/nextjs"
import InlineError from "components/common/InlineError"
import OutputContentItem from "components/common/output-content-item/OutputContentItem"

const NoComponentFound: Module<any> = ({module, isDevelopmentMode, isPreview}) => {
	if (isDevelopmentMode || isPreview) {
		//in development mode, show the error
		return <OutputContentItem contentItem={module} />
	} else {
		//in production mode, just keep on truckin' after throwing a warning in the log
		console.warn("Agility: No Component form for: ", module.properties.definitionName)
		return null
	}
}

export default NoComponentFound
