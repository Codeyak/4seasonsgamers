import { Game } from '@prisma/client';
import type { NextApiRequest, NextApiResponse } from 'next';
import { dbService } from '~/services/dbService';

const db = new dbService()

export default async function handler (
	req: NextApiRequest,
	res: NextApiResponse
) {
	const games = await db.getGames()
	res.status(200).json({ status: 'ok', games })
}
