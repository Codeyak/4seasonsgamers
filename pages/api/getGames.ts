import { Game } from '@prisma/client';
import type { NextApiRequest, NextApiResponse } from 'next';
import { stringFromParameter } from '~/services/apiHelper';
import { dbService } from '~/services/dbService';

const db = new dbService()

export default async (req: NextApiRequest, res: NextApiResponse):Promise<void> => {
	const data = await db.getGames( Number(stringFromParameter( req, 'page' ) ) )
	if ( data instanceof Error ) {
		console.error( 'Error getting games', data )
		const error = {
			message: data.message
		}
		res.status(500).json({status: 'error', error })
	} else {
		res.status(200).json({ status: 'ok', data: data })
	}
}
