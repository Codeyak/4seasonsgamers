import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { gamesState } from '~/types/custom';
import { RootState } from '.';

const initialState:gamesState = {
	items: [],
	numResults: 0,
	status: 'idle',
	error: null
}

const gamesSlice = createSlice( {
	name: 'games',
	initialState,
	reducers: {},
	extraReducers ( builder ) {
		builder
			.addCase( fetchGames.pending, ( state, action ) => {
				state.status = 'loading'
			} )
			.addCase( fetchGames.fulfilled, ( state, action ) => {
				state.status = 'succeeded'
				state.items = action.payload.games
				state.numResults = action.payload.numResults
			} )
			.addCase( fetchGames.rejected, ( state, action ) => {
				state.status = 'failed'
				state.error = action.error.message || ''
			})
	}
} )

export const selectedGames = (state:RootState) => state.games.items

export default gamesSlice.reducer

export const fetchGames = createAsyncThunk(
	'games/fetchGames',
	async ( page:number ) => {
		try {
			const result = await ( await fetch( `/api/getGames?page=${page}` ) ).json()
			if ( result.status === 'error' ) {
				throw new Error(result.error.message)
			}
			return result.data
		} catch (error) {
			throw error
		}
	}
)
