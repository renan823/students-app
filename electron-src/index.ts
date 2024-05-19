import { join } from "path";
import { format } from "url";

import { BrowserWindow, app } from "electron";
import isDev from "electron-is-dev";
import prepareNext from "electron-next";


app.on("ready", async () => {
  	await prepareNext("./renderer");

	const mainWindow = new BrowserWindow({
		minHeight: 1080 * 0.7,
			minWidth: 1920 * 0.7,
			webPreferences: {
			nodeIntegration: false,
			contextIsolation: true,
			preload: join(__dirname, "preload.js"),
		},
	});

	const url = isDev
		? "http://localhost:8000/"
		: format({
			pathname: join(__dirname, "../renderer/out/index.html"),
			protocol: "file:",
			slashes: true,
		});

	mainWindow.maximize();
	//mainWindow.removeMenu();
  	mainWindow.loadURL(url);
});

app.on("window-all-closed", app.quit);