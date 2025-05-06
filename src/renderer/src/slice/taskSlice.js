import { createSlice } from '@reduxjs/toolkit';
import { fetchTasksById } from '../utils/actions.js';

const initialState = {
	user: null,
	tasks: {},
	sort: 'added',
	completedTasks: [],
	currentTasks: [],
	overdueTasks: [],
	loading: false,
	error: null
};

const taskSlice = createSlice({
	name: 'tasks',
	initialState,
	reducers: {},
	extraReducers: (builder) => {
		builder
			.addCase(fetchTasksById.pending, (state) => {
				state.loading = true;
				state.error = null;
			})
			.addCase(fetchTasksById.fulfilled, (state, action) => {
				state.loading = false;
				state.tasks = action.payload.tasks;

				//classification of the tasks
				state.completedTasks = action.payload.completed;
				state.currentTasks = action.payload.current;
				state.overdueTasks = action.payload.overdue;
			})
			.addCase(fetchTasksById.rejected, (state, action) => {
				state.loading = false;
				state.error = action.error.message;
			});
	}
});

export default taskSlice.reducer;
