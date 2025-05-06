import { createAsyncThunk } from '@reduxjs/toolkit';

export const loadUsers = createAsyncThunk('users/loadUsers', async () => {
	const users = await window.api.getUsers();
	return users;
});

//fetching tasks by user
export const fetchTasksById = createAsyncThunk(
	'tasks/fetchTasksById',
	async (id, { rejectWithValue }) => {
		let res;
		const completed = [];
		const current = [];
		const overdue = [];

		try {
			res = await window.api.getTasks(id);

			const resObj = res[id];

			//iterate through tasks and add to respective arrays
			for (const task in resObj) {
				const ct = resObj[task];

				if (ct.completed === true) {
					completed.push(task);
					continue;
				}

				//since overdue tasks would also be current, they will go into both arrays
				if (new Date(`${ct.dueDate}T10:00:00Z`) < new Date()) {
					overdue.push(task);
				}
				current.push(task);
			}
		} catch (error) {
			return rejectWithValue(error);
		}

		return { id, tasks: res[id], completed, current, overdue };
	}
);

export const createTask = createAsyncThunk(
	'tasks/createTask',
	async (taskData, { rejectWithValue }) => {
		const res = await window.api.saveTasks(taskData.username, taskData);
		return res;
	}
);

export const selectUser = (id) => {
	return { type: 'SELECT_USER', payload: id };
};
