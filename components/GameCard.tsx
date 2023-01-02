import { Box, CardMedia, Grid, Paper, Typography, useMediaQuery } from '@mui/material'
import { Theme } from '@mui/material/styles'
import { Game } from '@prisma/client'

interface IProps {
	game: Game
}

/**
 * name: string;
 * publisher: string | null;
 * yearPublished: number | null;
 * minPlayers: number | null;
 * maxPlayers: number | null;
 * playingTime: number | null;
 * minPlayingTime: number | null;
 * maxPlayingTime: number | null;
 * description: string | null;
 * thumbnail: string | null;
 * image: string | null;
 */

const GameCard = (props: IProps): JSX.Element => {
	const { game } = props
	const isMobileOrTablet = useMediaQuery( ( theme: Theme ) => theme.breakpoints.down( 'md' ) )

	const containsWordAboveCharacterLimit = (text: string | null, length: number):boolean => {
		if (!text) { return false }
		const words = text.split(' ')
		const maxLength = Math.max(...words.map((word) => word.length))
		return maxLength >= length
	}

	const isTitleTooLong = containsWordAboveCharacterLimit( game.name, 35 )
	const cleanDescription = game.description?.replace(/(<([^>]+)>)/gi, " ") || null;
	const maybeTruncateDescription = ( text: string | null, length: number ) => {
		const words = text?.split( " " )
		const numWords = words?.length || 0
		if (numWords > length) {
			return words?.splice(0, length).join(" ") + "..."
		}
		return text
	}
	const description = maybeTruncateDescription(cleanDescription, 60)

	const GameCardThumbnail = (): JSX.Element => {
		return (
			<Box
				sx={ {
					position: 'relative',
					width: '7rem',
					height: '7rem',
					float: {
						xs: 'right',
						lg: 'left',
					},
					marginRight: {
						xs: 0,
						lg: 2,
					},
					marginLeft: {
						xs: 2,
						lg: 0,
					},
					backgroundColor: 'grey.500',
				} }
			>
				<CardMedia
					sx={ {
						width: '7rem',
						height: '7rem',
						objectFit: 'contain'
					} }
					component="img"
					alt={ game.name }
					src={ game.thumbnail || '/default-image.png' }
				/>
			</Box>
		)
	}

	const GameCardDetails = (): JSX.Element => {
		return (
			<div style={ { maxWidth: '100%', display: isTitleTooLong ? 'grid' : '' } }>
				<Typography
					noWrap={ isTitleTooLong }
					sx={ {
						lineHeight: 1.3,
						fontWeight: 600,
						marginBottom: '0.5rem',
						fontSize: {
							xs: '1.1rem',
							lg: '1.25rem'
						},
						color: 'grey.800'
					} }
					variant="h6"
					title={ game.name }
				>
					{ game.name }
				</Typography>
				<Typography
					sx={ {
						display: {
							xs: 'none',
							lg: 'block'
						},
						marginBottom: {
							lg: '0.5rem'
						},
						color: 'grey.800'
					} }
					variant="body2"
					gutterBottom
				>
					<div dangerouslySetInnerHTML={{ __html: description }}></div>
				</Typography>
				<Typography
					variant="caption"
					sx={ {
						fontSize: {
							xs: '0.875rem',
							lg: '0.75rem'
						},
						fontWeight: {
							lg: 'bold'
						},
						color: 'grey.800'
					} }
					noWrap={ isMobileOrTablet }
				>
					Published: { game.yearPublished }
					Publisher: { game.publisher }
					# Players: { game.minPlayers } - {game.maxPlayers}
				</Typography>
			</div>
		)
	}

	return (
		<Box
			sx={ {
				flexGrow: 1,
				display: 'flex',
				flexDirection: 'row'
			} }
		>
			<Grid
				sx={ {
					backgroundColor:'grey.300',
					paddingTop: 3,
					paddingBottom: 3,
					paddingLeft: 2,
					PaddingRight: 2,
					margin: 'auto',
					marginTop: 1,
					'&>.MuiGrid-item': {
						padding: '8px'
					}
				} }
				component={ Paper }
				container
				elevation={ 2 }
				spacing={ 2 }
			>
				<Grid
					item
					xs={ 12 }
					lg={ 8 }
				>
					<GameCardThumbnail />
					<GameCardDetails />
				</Grid>
			</Grid>
		</Box>
	)
}

export default GameCard
