"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// Native
const path_1 = require("path");
const url_1 = require("url");
// Packages
const electron_1 = require("electron");
const electron_is_dev_1 = __importDefault(require("electron-is-dev"));
const electron_next_1 = __importDefault(require("electron-next"));
//Controllers
const UserDAO_1 = __importDefault(require("../api/repositories/UserDAO"));
const LessonDAO_1 = __importDefault(require("../api/repositories/LessonDAO"));
const LectureDAO_1 = __importDefault(require("../api/repositories/LectureDAO"));
// Prepare the renderer once the app is ready
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
    mainWindow.removeMenu();
    mainWindow.loadURL(url);
});
// Quit the app once all windows are closed
electron_1.app.on("window-all-closed", electron_1.app.quit);
//user events 
const userDAO = new UserDAO_1.default();
const lessonDAO = new LessonDAO_1.default();
const lectureDAO = new LectureDAO_1.default();
// Manipuladores de eventos para operações de usuário
electron_1.ipcMain.on("create-user", (event, data) => {
    userDAO.create(event, data).catch(error => console.error(error));
});
electron_1.ipcMain.on("update-user", (event, cpf, newData) => {
    userDAO.update(event, cpf, newData).catch(error => console.error(error));
});
electron_1.ipcMain.on("find-users-by-name", (event, name) => {
    userDAO.findUserByName(event, name).catch(error => console.error(error));
});
electron_1.ipcMain.on("find-users-by-mother-name", (event, motherName) => {
    userDAO.findUserByMotherName(event, motherName).catch(error => console.error(error));
});
electron_1.ipcMain.on("find-all-students-with-phones-and-debt", (event) => {
    userDAO.findAllStudentsWithPhonesAndDebt(event).catch(error => console.error(error));
});
// Manipuladores de eventos para operações de telefone
electron_1.ipcMain.on("create-many-phones", (event, data) => {
    userDAO.createManyPhones(event, data).catch(error => console.error(error));
});
electron_1.ipcMain.on("update-many-phones", (event, data) => {
    userDAO.updateManyPhones(event, data).catch(error => console.error(error));
});
// Manipuladores de eventos para operações de lições
electron_1.ipcMain.on("create-lesson", (event, data) => {
    lessonDAO.create(event, data).catch(error => console.error(error));
});
electron_1.ipcMain.on("update-lesson", (event, id, newData) => {
    lessonDAO.update(event, id, newData).catch(error => console.error(error));
});
//Manipuladores de eventos para operações de aulas
electron_1.ipcMain.on("create-lecture", (event, data) => {
    lectureDAO.create(event, data).catch(error => console.error(error));
});
electron_1.ipcMain.on("update-lecture", (event, id, newData) => {
    lectureDAO.update(event, id, newData).catch(error => console.error(error));
});
electron_1.ipcMain.on("find-lectures-by-week", (event) => {
    lectureDAO.findLecturesByWeek(event).catch(error => console.error(error));
});
electron_1.ipcMain.on("find-all-lectures-sorted-by-date", (event, skip, take) => {
    lectureDAO.findAllLecturesSortedByDate(event, skip, take).catch(error => console.error(error));
});
electron_1.ipcMain.on("find-lectures-last-ten-months", (event) => {
    lectureDAO.findLecturesLastTenMonths(event).catch(error => console.error(error));
});
electron_1.ipcMain.on("find-lectures-by-student-name", (event, name) => {
    lectureDAO.findLecturesByStudentName(event, name).catch(error => console.error(error));
});
