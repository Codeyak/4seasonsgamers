import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import { gamesState } from '~/types/custom';
import { RootState } from '.';

const initialState:gamesState = {
	items: [],
	status: 'idle',
	error: null,
	page: 1
}

const gamesSlice = createSlice( {
	name: 'games',
	initialState,
	reducers: {
		pageUpdated: ( state, action:PayloadAction<number> ) => {
				state.page = action.payload
		}
	},
	extraReducers ( builder ) {
		builder
			.addCase( fetchGames.pending, ( state, action ) => {
				state.status = 'loading'
			} )
			.addCase( fetchGames.fulfilled, ( state, action ) => {
				state.status = 'succeeded'
				state.items = action.payload
			} )
			.addCase( fetchGames.rejected, ( state, action ) => {
				state.status = 'failed'
				state.error = action.error.message
			})
	}
} )

export const { pageUpdated } = gamesSlice.actions

export const selectedGames = (state:RootState) => state.games.items

export default gamesSlice.reducer

export const fetchGames = createAsyncThunk(
	'games/fetchGames',
	async () => {
		const { games } = await ( await fetch( '/api/getGames' ) ).json()
		return games
	}
)
