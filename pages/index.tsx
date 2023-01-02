import type { NextPage } from 'next'
import { useEffect } from 'react'
import { Container } from '@mui/material'
import GamesList from '~/components/GamesList'
import FilterArea from '~/components/FilterArea'

const Home: NextPage = () => {

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
		//TODO
	}, [] )




	return (
		<main>
			<FilterArea />
			<Container maxWidth="xl">
				<GamesList />
			</Container>
		</main>
	)
}

export default Home
