import { createSlice } from '@reduxjs/toolkit';
import { fetchTasksById, loadUsers } from '../utils/actions.js';

const initialState = {
	users: [],
	loading: true,
	selectedUser: null,
	error: null,
	tasks: {}
};

const userSlice = createSlice({
	name: 'user',
	initialState,
	reducers: {
		selectUser: (state, action) => {
			state.selectedUser = action.payload;
		}
	},
	extraReducers: (builder) => {
		builder
			.addCase(loadUsers.pending, (state) => {
				state.loading = true;
				state.error = null;
			})
			.addCase(loadUsers.rejected, (state, action) => {
				state.loading = false;
				state.error = action.error.message;
			})
			.addCase(loadUsers.fulfilled, (state, action) => {
				state.users = action.payload;
				state.loading = false;
			})
			.addCase(fetchTasksById.fulfilled, (state, action) => {
				state.tasks[action.payload.id] = action.payload.res;
			});
	}
});
export const { selectUser } = userSlice.actions;
export default userSlice.reducer;
