import { contextBridge, ipcRenderer } from "electron";

contextBridge.exposeInMainWorld("main", {
	send: (channel: string, ...args: any) => {
		ipcRenderer.setMaxListeners(10);
		ipcRenderer.send(channel, ...args);
	},

	receive: (channel: string, func: Function) => {
		ipcRenderer.setMaxListeners(10);
		ipcRenderer.on(channel, (_, ...args) => func(...args));
	},

	stop: (channel: string) => {
		ipcRenderer.setMaxListeners(10);
		ipcRenderer.removeAllListeners(channel);
	}
})