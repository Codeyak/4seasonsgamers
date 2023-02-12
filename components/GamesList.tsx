import { Alert, Pagination, Typography } from '@mui/material'
import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { AppDispatch, RootState } from '~/store'
import { fetchGames, selectedGames } from '~/store/gamesSlice'
import { updatePage } from '~/store/filtersSlice'
import GameCard from './GameCard'

const GamesList = (): JSX.Element => {
	const dispatch = useDispatch<AppDispatch>()
	const games = useSelector( selectedGames )
	const numResults = useSelector( ( state: RootState ) => state.games.numResults )
	const numPages = Math.ceil( numResults / 5 )
	const gamesStatus = useSelector( ( state: RootState ) => state.games.status )
	const error = useSelector( ( state: RootState ) => state.games.error )
	const page = useSelector( ( state: RootState ) => state.filters.page ) as number
	const filters = useSelector( ( state: RootState ) => state.filters )

	useEffect( () => {
		if ( gamesStatus === 'succeeded' || gamesStatus === 'idle' ) {
			dispatch( fetchGames( page || 1 ) )
		}
	}, [ filters ] )

	const _handlePageClick = (page:number) => {
		dispatch(updatePage(page))
	}

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
		content = <Alert severity='error'>{error}</Alert>
	}

	return (
		<>
			<div>
				{content}
			</div>
			<Pagination
				count={numPages}
				size="large"
				showFirstButton
				showLastButton
				onChange={( event, page ) => _handlePageClick( page )}
				page={page}
			></Pagination>
		</>

	)
}

export default GamesList
