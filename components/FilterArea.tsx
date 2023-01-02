import { Box, Container, Grid, Paper, Typography } from '@mui/material'

const FilterArea = (): JSX.Element => {
	return (
		<div>
			<Paper square>
				<Container
					sx={ {
						pt: {
							xs: '35px',
							md: '18px'
						},
						pb: '10px',
						mb: '15px'
					} }
					maxWidth="xl"
				>
					<Box sx={{ overflowX: 'auto' }}>
						<Grid
							key="dropdownContainer"
							container
							sx={ {
								flexWrap: 'nowrap',
								// Promote the list into his own layer on Chrome. This cost memory but helps keeping high FPS.
								transform: 'translateZ(0)'
							}}
						>
							<Typography variant="h5">This is where the filters go</Typography>
						</Grid>
					</Box>
				</Container>
			</Paper>
		</div>
	)
}

export default FilterArea
