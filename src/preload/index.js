import { contextBridge, ipcRenderer } from 'electron';
import { electronAPI } from '@electron-toolkit/preload';

// Custom APIs for renderer
const api = {
	createUser: (userData) => ipcRenderer.invoke('saveUser', userData),
	createTask: (user, taskData) => ipcRenderer.invoke('saveTasks', user, taskData),
	getUser: (name) => ipcRenderer.invoke('getUser', name),
	getUsers: () => ipcRenderer.invoke('getUsers'),
	getTasks: (user) => ipcRenderer.invoke('getTasks', user)
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
