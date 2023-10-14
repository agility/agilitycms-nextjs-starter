import {CgSpinner} from "react-icons/cg"
interface Props {
	message: string
}

const Widget = ({message}: Props) => {
	return (
		<section className="flex flex-col items-center justify-center h-screen">
			<CgSpinner className="animate-spin text-2xl mb-2" />
			<p>{message}</p>
		</section>
	)
}

export default Widget
