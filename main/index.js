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
const StudentDAO_1 = __importDefault(require("./api/repositories/StudentDAO"));
const LectureDAO_1 = __importDefault(require("./api/repositories/LectureDAO"));
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
const studentDAO = new StudentDAO_1.default();
const lectureDAO = new LectureDAO_1.default();
//Students
electron_1.ipcMain.on("add-student", studentDAO.create);
electron_1.ipcMain.on("update-student", studentDAO.update);
electron_1.ipcMain.on("find-all-students", studentDAO.findAll);
electron_1.ipcMain.on("find-students-by-name", studentDAO.findStudentsByName);
electron_1.ipcMain.on("find-students-by-mothername", studentDAO.findStudentsByMotherName);
electron_1.ipcMain.on("find-students-by-name-for-lectures", studentDAO.findByNameForLectures);
electron_1.ipcMain.on("count-students", studentDAO.countStudents);
//Lectures
electron_1.ipcMain.on("add-lecture", lectureDAO.create);
electron_1.ipcMain.on("update-lecture", lectureDAO.update);
electron_1.ipcMain.on("lectures-by-week", lectureDAO.findLecturesByWeek);
electron_1.ipcMain.on("find-all-lectures", lectureDAO.findAll);
electron_1.ipcMain.on("lectures-months-ago", lectureDAO.findLecturesByMonthsAgo);
electron_1.ipcMain.on("find-lectures-by-student-name", lectureDAO.findLecturesByStudentName);
electron_1.ipcMain.on("count-lectures", lectureDAO.countLectures);
electron_1.ipcMain.on("sum-lectures-by-day", lectureDAO.sumPaymentsByDay);
