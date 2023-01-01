import type { NextPage } from 'next'
import Head from 'next/head'
import Image from 'next/image'
import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { fetchGames, selectedGames } from '~/store/gamesSlice'
import { AppDispatch, RootState } from '~/store'

const Home: NextPage = () => {
	const dispatch = useDispatch<AppDispatch>()
	const gamesStatus = useSelector( (state:RootState) => state.games.status )
	const games = useSelector( selectedGames )
	console.log( 'GAMES', games )

	const importGames = async () => {
		const gamesObj = await (await fetch('/api/importGames')).json()
		console.log('GAMES', gamesObj)
	}

	const addGamers = async () => {
		const newGamers = await (await fetch('/api/addGamers')).json()
		console.log('GAMERS', newGamers)
	}

	const getGames = async () => {
		const { games } = await ( await fetch( '/api/getGames' ) ).json()
		console.log('GAMES', games)
	}

	useEffect(() => {
		if (gamesStatus === 'idle') {
			dispatch( fetchGames() )
		}
	}, [gamesStatus, dispatch] )




	return (
		<div>
			<main>
				<h1>Welcome to 4 Seasons Gamers!</h1>
			</main>


		</div>
	)
}

export default Home
