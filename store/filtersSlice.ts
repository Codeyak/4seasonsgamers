import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import { filtersState } from '~/types/custom';

const initialState:filtersState = {
	page: 1
}

const filtersSlice = createSlice( {
	name: 'filters',
	initialState,
	reducers: {
		updatePage: ( state, action: PayloadAction<number> ) => {
			state.page = action.payload
		}
	}
})

export const { updatePage } = filtersSlice.actions
export default filtersSlice.reducer
