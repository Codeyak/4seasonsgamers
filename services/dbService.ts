import { Gamer, PrismaClient } from '@prisma/client';
import omit from 'lodash/omit'

const prisma = new PrismaClient()

export interface IdbService {
	addGamer: ( gamer: Gamer ) => Promise<Gamer>
	getGamers: () => Promise<Gamer[]>
}

export class dbService implements IdbService {
	addGamer = async ( gamer: Gamer ): Promise<Gamer> => {
		const data = { data: omit(gamer, ['id'])}
		return await prisma.gamer.create(data)
	}

	getGamers = async (): Promise<Gamer[]> => {
		const gamers = await prisma.gamer.findMany( {
			select: {
				id: true,
				firstName: true,
				lastName: true,
				bggUsername: true
			}
		} ) as Gamer[]
		return gamers
	}
}
