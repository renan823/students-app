"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const path_1 = require("path");
const url_1 = require("url");
const electron_1 = require("electron");
const electron_is_dev_1 = __importDefault(require("electron-is-dev"));
const electron_next_1 = __importDefault(require("electron-next"));
electron_1.app.on("ready", async () => {
    await (0, electron_next_1.default)("./renderer");
    const mainWindow = new electron_1.BrowserWindow({
        minHeight: 1080 * 0.7,
        minWidth: 1920 * 0.7,
        webPreferences: {
            nodeIntegration: false,
            contextIsolation: true,
            preload: (0, path_1.join)(__dirname, "preload.js"),
        },
    });
    const url = electron_is_dev_1.default
        ? "http://localhost:8000/"
        : (0, url_1.format)({
            pathname: (0, path_1.join)(__dirname, "../renderer/out/index.html"),
            protocol: "file:",
            slashes: true,
        });
    mainWindow.maximize();
    //mainWindow.removeMenu();
    mainWindow.loadURL(url);
});
electron_1.app.on("window-all-closed", electron_1.app.quit);
