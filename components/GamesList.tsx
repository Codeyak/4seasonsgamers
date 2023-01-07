import { Typography } from '@mui/material'
import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { AppDispatch, RootState } from '~/store'
import { fetchGames, selectedGames } from '~/store/gamesSlice'
import GameCard from './GameCard'

const GamesList = (): JSX.Element => {
	const dispatch = useDispatch<AppDispatch>()
	const games = useSelector( selectedGames )
	const gamesStatus = useSelector( ( state: RootState ) => state.games.status )
	const error = useSelector( ( state:RootState ) => state.games.error)

	useEffect( () => {
		console.log('STATUS', gamesStatus)
		if (gamesStatus === 'idle') {
			dispatch( fetchGames() )
		}
	}, [ gamesStatus ] )

	let content

	if (gamesStatus === 'loading') {
		content = <Typography>Loading...</Typography>
	} else if (gamesStatus === 'succeeded') {
		content = games.map( ( game ) => {
			return <GameCard
						key={game.id}
						game={game}
					/>
		})
	} else if ( gamesStatus === 'failed' ) {
		content = <Typography>{ error }</Typography>
	}

	return (
		<div>
			{content}
		</div>
	)
}

export default GamesList
