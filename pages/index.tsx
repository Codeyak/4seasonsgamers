import type { NextPage } from 'next'
import Head from 'next/head'
import Image from 'next/image'
import styles from '../styles/Home.module.css'
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
		<div className={styles.container}>
			<Head>
				<title>4 Seasons Gamers</title>
				<meta name="description" content="Gaming for All Seasons" />
				<link rel="icon" href="/favicon.ico" />
			</Head>

			<main className={styles.main}>
				<h1 className={styles.title}>Welcome to 4 Seasons Gamers!</h1>
			</main>

			<footer className={styles.footer}>
				<a
					href="https://vercel.com?utm_source=create-next-app&utm_medium=default-template&utm_campaign=create-next-app"
					target="_blank"
					rel="noopener noreferrer"
				>
					Powered by{' '}
					<span className={styles.logo}>
						<Image src="/vercel.svg" alt="Vercel Logo" width={72} height={16} />
					</span>
				</a>
			</footer>
		</div>
	)
}

export default Home
