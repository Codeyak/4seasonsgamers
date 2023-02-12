import getConfig from 'next/config';
import { Category, Game, Gamer, Mechanic, Prisma, PrismaClient } from '@prisma/client';
import omit from 'lodash/omit'
import { IFullGame } from '~/types/custom';

const prisma = new PrismaClient()
export interface IdbService {
	addGamer: ( gamer: Gamer ) => Promise<Gamer>
	addGame: ( fullGame: IFullGame ) => Promise<Game>
	addCategories: ( categories: Category[] ) => Promise<Prisma.BatchPayload>
	addMechanics: ( mechanics: Mechanic[] ) => Promise<Prisma.BatchPayload>
	getGamers: () => Promise<Gamer[]>
	getGames: (page: number) => Promise<unknown>
}

export class dbService implements IdbService {
	addGamer = async ( gamer: Gamer ): Promise<Gamer> => {
		const data = { data: omit(gamer, ['id'])}
		return await prisma.gamer.create(data)
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

	addCategories = async ( categories: Category[] ):Promise<Prisma.BatchPayload> => {
		const insertedCategories = await prisma.category.createMany( {
			data: categories,
			skipDuplicates: true
		} )
		return insertedCategories
	}

	addMechanics = async ( mechanics: Mechanic[] ):Promise<Prisma.BatchPayload> => {
		const insesrtedMechanics = await prisma.mechanic.createMany( {
			data: mechanics,
			skipDuplicates: true
		} )
		return insesrtedMechanics
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

	getGames = async (page: number): Promise<unknown> => {
		const { publicRuntimeConfig } = getConfig()
		const { perPage } = publicRuntimeConfig
		const skip = (page - 1) * perPage
		try {
			const result = await prisma.$transaction( [
				prisma.game.count(),
				prisma.game.findMany( {
					skip,
					take: perPage,
					orderBy: [
						{
							name: 'asc'
						}
					],
					include: {
						gamers: {
							distinct: ['gamerId'],
							include: {
								gamers: {
									select: {
										firstName: true
									}
								}
							}
						}
					}
				})
			])
			const data = {
				numResults: result[ 0 ],
				games: result[1]
			}
			return data
		} catch (error) {
			return error
		}
	}
}
