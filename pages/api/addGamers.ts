import type { NextApiRequest, NextApiResponse } from 'next';
import { dbService } from '~/services/dbService';
import { Gamer } from '@prisma/client';
import getConfig from 'next/config';

const { serverRuntimeConfig } = getConfig()

const db = new dbService()

const gamers = serverRuntimeConfig.gamers

export default async function handler (
	req: NextApiRequest,
	res: NextApiResponse
) {
	const newGamers:Array<Gamer> = []
	gamers.forEach( async ( gamer:Gamer ) => {
		const newGamer = await db.addGamer(gamer)
		newGamers.push(newGamer)
		console.log('New Gamer', newGamer)
	} )
	return newGamers
}
