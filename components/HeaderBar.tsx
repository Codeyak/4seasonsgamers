import { AppBar, Box, Container, Toolbar, Typography, useMediaQuery } from '@mui/material';
import { Theme } from '@mui/material/styles';
import Head from 'next/head';

const HeaderBar = (): JSX.Element => {
	const isMobileOrTablet = useMediaQuery((theme: Theme) => theme.breakpoints.down('md'))
	const navHeight = isMobileOrTablet ? '85px' : '55px'

	return (
		<Box sx={{ flexGrow: 1 }}>
			<Head>
				<style>
					{ `body { margin-top: ${navHeight} }` }
				</style>
			</Head>
			<AppBar
				position='fixed'
			>
				<Toolbar
					sx={ {
						justifyContent: 'space-between',
						pb: {
							xs: 1,
							md: 0
						},
						flexWrap: {
							xs: 'wrap',
							md: 'nowrap'
						}
					} }
					component={ Container }
					maxWidth="xl"
				>
					<Typography
						sx={ { display: 'block' } }
						variant="h5"
					>
						4 Seasons Gamers
					</Typography>
				</Toolbar>
			</AppBar>
		</Box>
	)
}

export default HeaderBar
