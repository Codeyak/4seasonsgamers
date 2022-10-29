import got, { RequestError } from 'got'
import { parseString } from 'xml2js'

export interface IbggAPIService {
	getUserGamesOwned: (username: string) => Promise<unknown>
}

export const bggAPIService = ():IbggAPIService => {
	const baseUrl = 'https://api.geekdo.com/xmlapi'

	const getUserGamesOwned = async (username: string):Promise<unknown> => {
		const requestUrl = `${baseUrl}/collection/?username=${username}&own=1`

		return got.get(requestUrl)
			.then((result) => {
				const body = result.body
				const collection = parseString(body, (err, result) => {
					console.log('Collection', result.items.item)
					return result
				})
				return collection
		})
	}

	return {
		getUserGamesOwned
	}
}
