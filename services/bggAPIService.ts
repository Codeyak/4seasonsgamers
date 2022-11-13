import got, { RequestError } from 'got'
import { createRecords } from 'thin-backend'
import xlm2js from 'xml2js'

export interface IbggAPIService {
	getUserGamesOwned: (username: string) => Promise<unknown>
}

export const bggAPIService = ():IbggAPIService => {
	const baseUrl = 'https://api.geekdo.com/xmlapi'

	const getUserGamesOwned = async (username: string):Promise<unknown> => {
		const requestUrl = `${baseUrl}/collection/?username=${username}&own=1`

		return got.get(requestUrl)
			.then((result) => {
				const parser = new xlm2js.Parser()
				const body = result.body
				return parser.parseStringPromise(body)
					.then(async (result) => {
						const bggItems = result.items.item
						console.log(bggItems)
						const userGames = bggItems.map((bggGame) => {
							return {
								id: parseInt(bggGame['$'].objectid),
								name: bggGame.name[0]._,
								image: bggGame.image[0],
								thumbnail: bggGame.thumbnail[0]
							}
						})
						try {
							// const gamesCreated = await createRecords('games', userGames)
						} catch (error) {
							console.log('ERROR', error)
						}
						return true
				})
		})
	}

	const getGameData = async (id:number) => {
		//TODO get full data for a game
	}

	const _parseXML = async (body:string) => {
		const parser = new xlm2js.Parser()
		const json = await parser.parseString(body)
		return json
	}

	return {
		getUserGamesOwned
	}
}
