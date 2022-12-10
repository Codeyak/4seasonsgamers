import got, { RequestError } from 'got'
import xlm2js from 'xml2js'
import { dbService } from './dbService'
import { Game, Gamer } from '@prisma/client'

const db = new dbService()

export interface IbggAPIService {
	getAllGames: ( username: string ) => Promise<Game[]>
}

export const bggAPIService = ():IbggAPIService => {
	const baseUrl = 'https://api.geekdo.com/xmlapi'

	const getAllGames = async ():Promise<Game[]> => {
		const gamers:Array<Gamer> = await db.getGamers()
		const allGames:Array<Game> = []
		for (let i = 0; i < gamers.length; i++) {
			const games:Array<Game> = await _getUserGamesOwned(gamers[i].bggUsername)
			allGames.concat(games)
		}
		//TODO do the db writes see nested writes -- https://www.prisma.io/docs/concepts/components/prisma-client/relation-queries#nested-writes
		//SEE Connect or Create for relationals https://www.prisma.io/docs/concepts/components/prisma-client/relation-queries#connect-or-create-a-record
		return allGames
	}

	const _getUserGamesOwned = async ( username: string ): [] => {

		const requestUrl = `${baseUrl}/collection/?username=${username}&own=1`
		const body = await got.get(requestUrl,
			{
				responseType: 'text',
				resolveBodyOnly: true
			}
		)
		const { items: { item: ownerGames } } = await _parseXML(body)

		const bggGames = [] as []
		for ( let i = 0; i < ownerGames.length; i++ ) {
			const gameId = ownerGames[ i ].$.objectid
			const gameData = await _getGameData( gameId )
			const categories = gameData?.boardgames.boardgame[ 0 ].boardgamecategory
			const mechanics = gameData?.boardgames.boardgame[0].boardgamemechanic
			_setCategories( categories, gameId )
			_setMechanics(mechanics, gameId)
		}

		return bggGames;
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

	const _setCategories = (categories:[], gameId:number) => {
		//TODO add to categories, if not exists
		const categoriesParsed = categories.map( ( category ) => {
			return {
				id: category.$.objectid,
				name: category._
			}
			//TODO add to game_categories using gameId
		} )
		console.log('PARSED CATEGORIES', categoriesParsed)
	}

	const _setMechanics = ( mechanics: [], gameId: number ) => {
		//TODO add to mechanics, if not exists
		const mechanicsParsed = mechanics.map( ( mechanic ) => {
			return {
				id: mechanic.$.objectid,
				name: mechanic._
			}
			//TODO add to game_mechanics
		} )
		console.log('MECHANICS PARSED', mechanicsParsed)
	}

	const _parseXML = async (body:string) => {
		const parser = new xlm2js.Parser()
		let bggJson;
		await parser.parseString(body, (err, result) => {
			bggJson = result
		})
		return bggJson
	}

	return {
		getAllGames
	}
}
