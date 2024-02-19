import { contextBridge, ipcRenderer } from "electron";

contextBridge.exposeInMainWorld("main", {
	send: (channel: string, ...args: any) => {
		ipcRenderer.send(channel, ...args);
	},

	receive: (channel: string, func: Function) => {
		ipcRenderer.on(channel, (_, ...args) => func(...args));
	},

	stop: (channel: string) => {
		ipcRenderer.removeAllListeners(channel);
	}
})