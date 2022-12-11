import got, { RequestError } from 'got'
import xlm2js from 'xml2js'
import { dbService } from './dbService'
import { Category, Game, Gamer, Mechanic } from '@prisma/client'
import { IFullGame } from '~/types/custom'
import { filter } from 'lodash'

const db = new dbService()

export interface IbggAPIService {
	importGames: () => Promise<Game[]>
}

export const bggAPIService = ():IbggAPIService => {
	const baseUrl = 'https://api.geekdo.com/xmlapi'

	const importGames = async ():Promise<Game[]> => {
		const gamers:Array<Gamer> = await db.getGamers()
		const allGames:Array<Game> = []
		for (let i = 0; i < gamers.length; i++) {
			const games:Array<Game> = await _getUserGamesOwned(gamers[i].bggUsername, gamers[i].id)
			allGames.concat(games)
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
		const { items: { item: ownerGames } } = await _parseXML(body)

		const bggGames:IFullGame[] = []
		for ( let i = 0; i < ownerGames.length; i++ ) {
			const game:IFullGame = {}
			game.id = ownerGames[ i ].$.objectid
			const gameData = await _getGameData( game.id )
			const bggGame = gameData.boardgames.boardgame[0]
			game.name = _getGameName( bggGame.name )
			game.publisher = bggGame.boardgamepublisher[ 0 ]._ || null
			game.yearPublished = parseInt(bggGame.yearpublished[ 0 ]) || null
			game.minPlayers = parseInt(bggGame.minplayers[ 0 ]) || null
			game.maxPlayers = parseInt(bggGame.maxplayers[ 0 ]) || null
			//TODO game.suggestedNumPlayers = bggGame.
			game.playingTime = parseInt(bggGame.playingtime[ 0 ]) || null
			game.minPlayingTime = parseInt(bggGame.minplaytime[ 0 ]) || null
			game.maxPlayingTime = parseInt(bggGame.maxplaytime[ 0 ]) || null
			game.description = bggGame.description || null
			game.thumbnail = bggGame.thumbnail || null
			game.image = bggGame.image[ 0 ]
			game.categories = _getCategories( bggGame.boardgamecategory )
			game.mechanics = _getMechanics( bggGame.boardgamemechanic )
			game.gamer = userid
			bggGames.push(game)
		}

		return bggGames;
	}

	const _getGameName = ( names: [] ) => {
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

	const _getCategories = ( categories:[] ): Category[] => {
		return categories.map( ( category ) => {
			return {
				id: category.$.objectid,
				name: category._
			}
			//TODO add to game_categories using gameId
		} )
	}

	const _getMechanics = ( mechanics: [] ): Mechanic[] => {

		return mechanics.map( ( mechanic ) => {
			return {
				id: mechanic.$.objectid,
				name: mechanic._
			}
			//TODO add to game_mechanics
		} )
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
		importGames
	}
}
