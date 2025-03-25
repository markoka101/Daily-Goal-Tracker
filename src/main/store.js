import { app } from 'electron';
let Store;

//class for users
export class User {
	constructor(name, settings) {
		this.name = name;
		this.settings = settings;
		this.taskAmt = 0;
		this.taskCompleted = 0;
	}

	setSetting(setting) {
		this.settings = setting;
	}

	setName(name) {
		this.name = name;
	}

	//increment the amount of tasks whenever we create a new one
	incAmt() {
		this.taskAmt++;
	}

	//increment when tasks are completed
	complete() {
		this.taskCompleted++;
	}
}

//class for tasks
export class Task {
	constructor(id, name, username, description, status, dateCreated, dueDate) {
		this.id = id;
		this.name = name;
		this.description = description;
		this.status = status;
		this.dateCreated = dateCreated;
		this.dueDate = dueDate;
		this.usernamme = username;
	}

	/*
	Editing specific fields for the task
	*/
	editDescription(description) {
		this.description = description;
	}
	editName(name) {
		this.name = name;
	}
	editStatus(status) {
		this.status = status;
	}
	editDueDate(dueDate) {
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

	//save user
	saveUser(user) {
		this.store.set(`users.${user.name}`, user);
	}

	//get user by name
	getUser(name) {
		const userData = this.store.get(`users.${name}`);
		return userData ? new User(userData.name, userData.settings) : null;
	}

	//get all users
	getUsers() {
		return this.store.store.users;
	}

	//save tasks that were created by this user
	saveTasks(user, task, userStore) {
		user.incAmt();
		userStore.saveUser(user);

		task.id = user.taskAmt;
		this.store.set(`${user.name}.${user.taskAmt}`, task);
	}

	//find tasks that were created by this user
	getTasks(user) {
		const tasksData = this.store.store;
		return Object.fromEntries(
			Object.entries(tasksData).filter(([key, value]) => {
				return key === user;
			})
		);
	}
}
