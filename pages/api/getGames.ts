import { Game } from '@prisma/client';
import type { NextApiRequest, NextApiResponse } from 'next';
import { dbService } from '~/services/dbService';

const db = new dbService()

export default async function handler (
	req: NextApiRequest,
	res: NextApiResponse
) {
	const data = await db.getGames()
	if ( data instanceof Error ) {
		console.error( 'Error getting games', data )
		const error = {
			message: data.message
		}
		res.status(500).json({status: 'error', error })
	} else {
		res.status(200).json({ status: 'ok', games: data })
	}
}
