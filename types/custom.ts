import { Category, Game, Mechanic } from '@prisma/client';

export interface IFullGame extends Game {
	mechanics: Mechanic[]
	categories: Category[]
	gamer: number
}

interface IBggGameName {
	_: string
	$: {
		sortindex: string
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
		objectid?: string
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

export interface IBggGames {
	items: {
		$: {
			pubdate?: string
			termsofuse?: string
			totalitems?: string
		}
		item: IOwnerGame[] | []
	}
}
