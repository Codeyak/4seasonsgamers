import got, { RequestError } from 'got'
import xlm2js from 'xml2js'
import { dbService } from './dbService'
import { Category, Game, Gamer, Mechanic } from '@prisma/client'
import { IBggAttribute, IBggFullGame, IBggGameName, IBggOwnerGames, IFullGame } from '~/types/custom'
import { filter } from 'lodash'

const db = new dbService()

export interface IbggAPIService {
	importGames: () => Promise<Game[]>
}

export const bggAPIService = ():IbggAPIService => {
	const baseUrl = 'https://api.geekdo.com/xmlapi'

	const importGames = async ():Promise<IFullGame[]> => {
		const gamers:Array<Gamer> = await db.getGamers()
		let allGames:Array<IFullGame> = []
		for (let i = 0; i < gamers.length; i++) {
			const games:Array<IFullGame> = await _getUserGamesOwned(gamers[i].bggUsername, gamers[i].id)
			allGames = [ ...allGames, ...games ]
		}
		for (let n = 0; n < allGames.length; n++) {
			const insertedGame = await db.addGame(allGames[n])
		}
		//TODO do the db writes see nested writes -- https://www.prisma.io/docs/concepts/components/prisma-client/relation-queries#nested-writes
		//SEE Connect or Create for relationals https://www.prisma.io/docs/concepts/components/prisma-client/relation-queries#connect-or-create-a-record
		return allGames
	}

	const _getUserGamesOwned = async ( username: string, userid: number ): Promise<IFullGame[]> => {

		const requestUrl = `${baseUrl}/collection/?username=${username}&own=1`
		const body = await got.get(requestUrl,
			{
				responseType: 'text',
				resolveBodyOnly: true
			}
		)
		const { items: { item: ownerGames } } = await _parseXML(body) as IBggOwnerGames

		const bggGames:IFullGame[] = []
		for ( let i = 0; i < ownerGames.length; i++ ) {
			const id = parseInt(ownerGames[ i ].$.objectid)
			const gameData = await _getGameData( id ) as IBggFullGame
			const bggGame = gameData?.boardgames.boardgame[ 0 ]
			const game: IFullGame = {
				id,
				name: _getGameName( bggGame.name ),
				publisher: bggGame.boardgamepublisher[ 0 ]._ || '',
				yearPublished: parseInt( bggGame.yearpublished[ 0 ] ) || null,
				minPlayers: parseInt( bggGame.minplayers[ 0 ] ) || null,
				maxPlayers: parseInt( bggGame.maxplayers[ 0 ] ) || null,
				playingTime: parseInt( bggGame.playingtime[ 0 ] ) || null,
				minPlayingTime: parseInt( bggGame.minplaytime[ 0 ] ) || null,
				maxPlayingTime: parseInt( bggGame.maxplaytime[ 0 ] ) || null,
				description: bggGame.description[ 0 ] || null,
				thumbnail: bggGame.thumbnail[ 0 ] || null,
				image: bggGame.image[ 0 ],
				categories: _getCategories( bggGame.boardgamecategory || [] ),
				mechanics: _getMechanics( bggGame.boardgamemechanic || [] ),
				gamer: userid
			}
			bggGames.push(game)
		}

		return bggGames
	}

	const _getGameName = ( names: IBggGameName[] ) => {
		const correctNames = filter( names, ( nameObj ) => {
			return nameObj.$.primary === 'true'
		} )
		return correctNames[0]._
	}

	const _getGameData = async (id: number) => {
		const requestUrl = `${baseUrl}/boardgame/${id}`
		const body = await got.get(requestUrl,
			{
				responseType: 'text',
				resolveBodyOnly: true
			}
		)
		const gameData = await _parseXML(body)
		return gameData
	}

	const _getCategories = ( categories:IBggAttribute[] ): Category[] => {
		const parsedCats = categories.map( ( category ) => {
			return {
				id: parseInt(category.$.objectid),
				name: category._
			}
		} )
		db.addCategories(parsedCats)
		return parsedCats
	}

	const _getMechanics = ( mechanics:IBggAttribute[] ): Mechanic[] => {
		const parsedMechanics = mechanics.map( ( mechanic ) => {
			return {
				id: parseInt(mechanic.$.objectid),
				name: mechanic._,
			}
		} )
		db.addMechanics( parsedMechanics )
		return parsedMechanics
	}

	const _parseXML = async (body:string):Promise<unknown> => {
		const parser = new xlm2js.Parser()
		let bggJson:unknown;
		await parser.parseString(body, (err, result) => {
			bggJson = result
		})
		return bggJson
	}

	return {
		importGames
	}
}
