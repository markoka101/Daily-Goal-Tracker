import { contextBridge, ipcRenderer } from 'electron';
import { electronAPI } from '@electron-toolkit/preload';

// Custom APIs for renderer
const api = {
	createUser: (event, username, settings) =>
		ipcRenderer.invoke('saveUser', event, username, settings),
	createTask: (event, user, taskData) => ipcRenderer.invoke('saveTasks', event, user, taskData),
	getUser: (event, name) => ipcRenderer.invoke('getUser', event, name),
	getUsers: () => ipcRenderer.invoke('getUsers'),
	getTasks: (event, user) => ipcRenderer.invoke('getTasks', event, user)
};

// Use `contextBridge` APIs to expose Electron APIs to
// renderer only if context isolation is enabled, otherwise
// just add to the DOM global.
if (process.contextIsolated) {
	try {
		contextBridge.exposeInMainWorld('electron', electronAPI);
		contextBridge.exposeInMainWorld('api', api);
	} catch (error) {
		console.error(error);
	}
} else {
	window.electron = electronAPI;
	window.api = api;
}
