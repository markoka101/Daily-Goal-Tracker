import { app } from 'electron';
let Store;

//class for users
export class User {
	constructor(name, settings, taskAmt, taskCompleted) {
		this.name = name;
		this.settings = settings;
		this.taskAmt = 0;
		this.taskCompleted = 0;
	}
}

//class for tasks
export class Task {
	constructor(name, username, description, status, dateCreated, dueDate) {
		this.name = name;
		this.usernamme = username;
		this.description = description;
		this.status = status;
		this.dateCreated = dateCreated;
		this.dueDate = dueDate;
	}
}

//class to handle storage
//probably going to create classes which extend instead of having the million functions in here
//since depending on file location we will only use some of the total functions
export class StoreManager {
	//constructor with param of location so we know the file to save to
	constructor(location) {
		this.store = new Store({ name: location, cwd: app.getPath('userData') });
	}

	//dynamically import the store module since won't work with commonjs
	static async init() {
		const module = await import('electron-store');
		Store = module.default;
	}

	/*
		Functions for users
	*/

	//save user
	saveUser(user) {
		this.store.set(`users.${user.name}`, user);
	}

	//get user by name
	getUser(name) {
		const userData = this.store.get(`users.${name}`);
		return userData ? new User(userData.name, userData.settings) : null;
	}

	//edit user settings
	editSettings(name, settings) {
		this.store.set(`users.${name}.settings`, settings);
	}

	//get user's task amt
	getTaskAmt(name) {
		return this.store.get(`users.${name}.taskAmt`);
	}

	//increase the task amount for this user
	incTaskAmt(user) {
		const num = this.store.get(`users.${user}.taskAmt`) + 1;
		this.store.set(`users.${user}.taskAmt`, num);
		return num;
	}
	//get all users
	getUsers() {
		return this.store.store.users;
	}

	/*
	Functions for tasks
	*/

	//save tasks that were created by this user
	saveTasks(user, task, userStore) {
		this.store.set(`${user}.${userStore.getTaskAmt(user)}`, task);
	}

	//edit task will just be saving new instance since that is easier
	//worse performance, but easier
	editTask(user, taskNum, task) {
		this.store.set(`${user}.${taskNum}`, task);
	}

	//find all tasks that were created by this user
	getTasks(user) {
		const tasksData = this.store.store;
		return Object.fromEntries(
			Object.entries(tasksData).filter((key) => {
				return key === user;
			})
		);
	}
}
