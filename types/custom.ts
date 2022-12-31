import { Category, Game, Mechanic } from '@prisma/client';

export interface IFullGame extends Game {
	mechanics: Mechanic[]
	categories: Category[]
	gamer: number
}

export interface IBggGameName {
	_: string
	$: {
		sortindex: string
		primary?: string
	}
}

interface IValueObj {
	$: {
		value?: string
	}
}

interface IBggRating {
	$: {
		value?: string
	}
	average: IValueObj[]
	bayesaverage: IValueObj[]
	median: IValueObj[]
	stddev: IValueObj[]
	usersrated: IValueObj[]
}

interface IBggStatus {
	$: {
		fortrade?: string
		lastmodified?: string
		own?: string
		preordered?: string
		prevowned?: string
		want?: string
		wanttobuy?: string
		wanttoplay?: string
		wishlist?: string
	}
}

interface IBggStats {
	$: {
		maxplayers?: string
		maxplaytime?: string
		minplayers?: string
		minplaytime?: string
		numowned?: string
		playingtime?: string
	}
	rating: IBggRating[]
}

export interface IOwnerGame {
	$: {
		callid?: string
		objectid: string
		objecttype?: string
		subtype?: string
	}
	image: string[]
	name: IBggGameName[]
	numplays: string[]
	stats: IBggStats[]
	status: IBggStatus[]
	thumbnail: string[]
	yearpublished: string[]
}

export interface IBggOwnerGames {
	items: {
		$: {
			pubdate?: string
			termsofuse?: string
			totalitems?: string
		}
		item: IOwnerGame[] | []
	}
}

export interface IBggAttribute {
	_: string
	$: {
		objectid: string
	}
}

interface IBggPoll {
	$: {
		name: string
		title: string
		totalvotes: string
	}
	results: []
}

export interface IBggFullGame {
	boardgames: {
		$: {
			termsofuse?: string
		}
		boardgame: [
			{
				$: {
					objectid: string
				}
				age?: string[]
				boardgameaccessory?: IBggAttribute[]
				boardgameartist?: IBggAttribute[]
				boardgamecategory?: IBggAttribute[]
				boardgamedesigner?: IBggAttribute[]
				boardgameeditor?: IBggAttribute[]
				boardgameexpansion?: IBggAttribute[]
				boardgamefamily?: IBggAttribute[]
				boardgamehonor?: IBggAttribute[]
				boardgameimplementation?: IBggAttribute[]
				boardgamemechanic?: IBggAttribute[]
				boardgamepodcastepisode?: IBggAttribute[]
				boardgamepublisher: IBggAttribute[]
				boardgamesubdomain?: IBggAttribute[]
				boardgameversion?: IBggAttribute[]
				commerceweblink?: IBggAttribute[]
				description: string[]
				image: string[]
				maxplayers: string[]
				maxplaytime: string[]
				minplayers: string[]
				minplaytime: string[]
				name: IBggGameName[]
				playingtime: string[]
				poll?: IBggPoll[]
				thumbnail: string[]
				yearpublished: string[]
			}
		]
	}
}

export interface gamesState {
	items: Game[]
	status: string
	error: string | unknown
	page: number | unknown
}
