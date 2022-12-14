import { grey } from '@mui/material/colors';
import { createTheme } from '@mui/material';

const theme = createTheme( {
	palette: {
		mode: 'dark'
	},
	components: {
		MuiAutocomplete: {
			styleOverrides: {
				listbox: {
					'& .MuiAutocomplete-option[aria-selected="true"]': {
						backgroundColor: 'transparent',
					},
					'& .MuiAutocomplete-option': {
						paddingTop: 12,
						paddingLeft: 24,
						paddingRight: 24,
						paddingBottom: 12,
						minHeight: 'auto',
						alignItems: 'flex-start',
					}
				}
			}
		}
	}
})

export default theme
