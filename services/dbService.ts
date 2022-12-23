import { Category, Game, Gamer, Mechanic, PrismaClient } from '@prisma/client';
import omit from 'lodash/omit'
import { IFullGame, IRelationalCategory, IRelationalMechanic } from '~/types/custom';

const prisma = new PrismaClient()

export interface IdbService {
	addGamer: ( gamer: Gamer ) => Promise<Gamer>
	getGamers: () => Promise<Gamer[]>
	addGame: ( bggGame ) => Promise<Game>
	upsertC
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

	addGame = async (fullGame:IFullGame): Promise<Game> => {
		const game = omit( fullGame, [ 'categories', 'mechanics', 'gamer' ] ) as Game
		const categories = fullGame.categories.map( ( category: Category ) => {
			return { categoryId: category.id }
		}) as []
		const mechanics = fullGame.mechanics.map( ( mechanic: Mechanic ) => {
			return { mechanicId: mechanic.id }
		}) as []
		const gamerId = fullGame.gamer as number
		console.log( 'GAME', game )

		const data = {
			...game,
			categories: {
				createMany: {
					data: categories,
					skipDuplicates: true
				}
			},
			mechanics: {
				createMany: {
					data: mechanics,
					skipDuplicates: true
				}
			},
			gamers: {
				createMany: {
					data: [ { gamerId } ],
					skipDuplicates: true
				}
			}
		}
		const insertedGame = await prisma.game.upsert( {
			where: { id: game.id },
			update: data,
			create: data,
			include: {
				categories: true,
				mechanics: true,
				gamers: true
			}
		} )
		return insertedGame
	}

	addCategoies = async ( categories: Category[] ) => {
		const insertedCategories = await prisma.category.createMany( {
			data: categories,
			skipDuplicates: true
		} )
		return insertedCategories
	}

	addMechanics = async ( mechanics: Mechanic[] ) => {
		const insesrtedMechanics = await prisma.mechanic.createMany( {
			data: mechanics,
			skipDuplicates: true
		} )
		return insesrtedMechanics
	}
}
