import { generatePreviewKey } from "@agility/nextjs/node";

import { NextApiRequest, NextApiResponse } from "next"

const apiCall = async (req: NextApiRequest, res: NextApiResponse) => {
	//TODO: Only generate the preview link if you are already in Preview!
	const previewKey = generatePreviewKey();

	//Return a valid preview key
	res.end(previewKey);
};

export default apiCall