import type { NextApiRequest, NextApiResponse } from "next";
import { bggAPIService } from "~/services/bggAPIService";

const bggAPIServiceInstance = bggAPIService()

export default async function handler(
	req: NextApiRequest,
	res: NextApiResponse
) {
	//TODO Define getCurrentUser
	await bggAPIServiceInstance.importGames()
		.then((result) => {
			//TODO add error handling
			res.status(200).json({ status: 'ok', data:  result })
		})
}
