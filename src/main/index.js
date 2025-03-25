import { app, shell, BrowserWindow, ipcMain } from 'electron';
import { join } from 'path';
import { electronApp, optimizer, is } from '@electron-toolkit/utils';
import icon from '../../resources/icon.png?asset';
import { StoreManager, Task, User } from './store.js';

let taskStore;
let userStore;

//Since I needed to use dynamic import for electron-store, I must make this an async function
async function initializeApp() {
	await StoreManager.init();
	taskStore = new StoreManager('tasks');
	userStore = new StoreManager('users');

	//Handle the saveUser and saveTasks events
	ipcMain.handle('saveUser', (user) => {
		if (userStore.getUser(user.name) !== null) {
			return;
		}
		userStore.saveUser(new User(user.name, user.settings));
	});
	ipcMain.handle('saveTasks', (userName, taskData) => {
		const task = new Task(
			taskData.name,
			taskData.username,
			taskData.description,
			taskData.status,
			taskData.dateCreated,
			taskData.dueDate
		);
		const user = userStore.getUser(userName);
		taskStore.saveTasks(user, task, userStore);
	});

	//get the user by name
	ipcMain.handle('getUser', (name) => {
		return userStore.getUser(name);
	});

	//get all users
	ipcMain.handle('getUsers', () => {
		return userStore.getUsers();
	});

	//get tasks by user
	ipcMain.handle('getTasks', (userName) => {
		const user = userStore.getUser(userName);
		return taskStore.getTasks(user);
	});
}

function createWindow() {
	// Create the browser window.
	const mainWindow = new BrowserWindow({
		width: 900,
		height: 670,
		show: false,
		autoHideMenuBar: true,
		...(process.platform === 'linux' ? { icon } : {}),
		webPreferences: {
			preload: join(__dirname, '../preload/index.js'),
			sandbox: false
		}
	});

	mainWindow.on('ready-to-show', () => {
		mainWindow.show();
	});

	mainWindow.webContents.setWindowOpenHandler((details) => {
		shell.openExternal(details.url);
		return { action: 'deny' };
	});

	// HMR for renderer base on electron-vite cli.
	// Load the remote URL for development or the local html file for production.
	if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
		mainWindow.loadURL(process.env['ELECTRON_RENDERER_URL']);
	} else {
		mainWindow.loadFile(join(__dirname, '../renderer/index.html'));
	}
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
	// Set app user model id for windows
	electronApp.setAppUserModelId('com.electron');

	// Default open or close DevTools by F12 in development
	// and ignore CommandOrControl + R in production.
	// see https://github.com/alex8088/electron-toolkit/tree/master/packages/utils
	app.on('browser-window-created', (_, window) => {
		optimizer.watchWindowShortcuts(window);
	});

	// IPC test
	ipcMain.on('ping', () => console.log('pong'));

	initializeApp();

	createWindow();

	app.on('activate', function () {
		// On macOS it's common to re-create a window in the app when the
		// dock icon is clicked and there are no other windows open.
		if (BrowserWindow.getAllWindows().length === 0) createWindow();
	});
});

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
	if (process.platform !== 'darwin') {
		app.quit();
	}
});

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.
