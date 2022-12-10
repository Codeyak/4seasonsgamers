import type { NextApiRequest, NextApiResponse } from 'next';
import { dbService } from '~/services/dbService';
import { Gamer } from '@prisma/client';

const db = new dbService()

const gamers = [
	{
		id: 0,
		firstName: 'Pat',
		lastName: 'McCoy',
		bggUsername: 'baldgoat'
	}
]

export default async function handler (
	req: NextApiRequest,
	res: NextApiResponse
) {
	const newGamers:Array<Gamer> = []
	gamers.forEach( async ( gamer ) => {
		const newGamer = await db.addGamer(gamer)
		newGamers.push(newGamer)
		console.log('New Gamer', newGamer)
	} )
	return newGamers
}
