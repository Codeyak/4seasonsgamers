import got, { RequestError } from 'got'
import xlm2js from 'xml2js'

export interface IbggAPIService {
	getUserGamesOwned: (username: string) => Promise<unknown>
}

export const bggAPIService = ():IbggAPIService => {
	const baseUrl = 'https://api.geekdo.com/xmlapi'

	const getUserGamesOwned = async (username: string):Promise<unknown> => {
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
		getUserGamesOwned
	}
}
