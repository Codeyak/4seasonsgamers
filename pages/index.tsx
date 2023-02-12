import type { NextPage, NextPageContext } from 'next'
import { GetServerSidePropsResult as IGetServerSidePropsResult } from 'next'
import { useEffect } from 'react'
import { Container } from '@mui/material'
import GamesList from '~/components/GamesList'
import FilterArea from '~/components/FilterArea'
import Image from 'next/image'
import { useDispatch, useSelector } from 'react-redux'
import { AppDispatch, RootState } from '~/store'
import { useRouter } from 'next/router'
import { updatePage } from '~/store/filtersSlice'
import { filtersState } from '~/types/custom'
import getConfig from 'next/config'

interface IProps {
	queryStringfilters: filtersState
}

const Home = ( props: IProps ) => {
	const {queryStringfilters} = props
	const dispatch = useDispatch<AppDispatch>()
	const filters = useSelector( ( state: RootState ) => state.filters )
	const router = useRouter()

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
		void router.push( {
			pathname: router.pathname,
			query: {
				...router.query,
				page: filters.page as number
			}
		})
	}, [ filters ] )

	useEffect( () => {
		dispatch(updatePage(queryStringfilters.page))
	}, [])

	return (
		<main>
			<FilterArea />
			<Container maxWidth="xl">
				<GamesList />
			</Container>
			<Container maxWidth="xl">
				<footer>
					<a
						href="https://vercel.com?utm_source=create-next-app&utm_medium=default-template&utm_campaign=create-next-app"
						target="_blank"
						rel="noopener noreferrer"
					>
						Powered by{' '}
						<span>
							<Image src="/vercel.svg" alt="Vercel Logo" width={72} height={16} />
						</span>
					</a>
				</footer>
			</Container>
		</main>
	)
}

export const getServerSideProps = async (context:NextPageContext):Promise<IGetServerSidePropsResult<IProps>> => {
	const page = Number(context.query.page || 1)
	return {
		props: {
			queryStringfilters: {
				page
			}
		}
	}
}

export default Home
