import { createAsyncThunk } from '@reduxjs/toolkit';

export const loadUsers = createAsyncThunk('users/loadUsers', async () => {
	const users = await window.api.getUsers();
	return users;
});

export const fetchTasksById = createAsyncThunk(
	'tasks/fetchTasksById',
	async (id, { rejectWithValue }) => {
		const res = await window.api.getTasks(id);
		return { id, res };
	}
);

export const selectUser = (id) => {
	return { type: 'SELECT_USER', payload: id };
};
