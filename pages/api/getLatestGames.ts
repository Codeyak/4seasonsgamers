import type { NextApiRequest, NextApiResponse } from "next";
import { getCurrentUser } from "thin-backend";
import { bggAPIService } from "~/services/bggAPIService";

const bggAPIServiceInstance = bggAPIService()

export default async function handler(
	req: NextApiRequest,
	res: NextApiResponse
) {
	const currentUser = await getCurrentUser()
	await bggAPIServiceInstance.getUserGamesOwned(currentUser?.bggUsername || 'baldgoat')
		.then((result) => {
			//TODO add error handling
			res.status(200).json({ status: 'ok', data:  result })
		})
}
