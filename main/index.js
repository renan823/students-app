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
const StudentController_1 = __importDefault(require("./api/controllers/StudentController"));
const LectureController_1 = __importDefault(require("./api/controllers/LectureController"));
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
const studentController = new StudentController_1.default();
electron_1.ipcMain.on("add-student", studentController.addStudent);
electron_1.ipcMain.on("update-student", studentController.updateStudent);
electron_1.ipcMain.on("find-all-students", studentController.findAllStudents);
electron_1.ipcMain.on("find-students-by-name", studentController.findStudentsByName);
electron_1.ipcMain.on("find-students-by-mothername", studentController.findStudentsByMotherName);
electron_1.ipcMain.on("find-students-in-debt", studentController.findStudentsInDebt);
electron_1.ipcMain.on("count-students", studentController.countStudents);
const lectureController = new LectureController_1.default();
electron_1.ipcMain.on("add-lecture", lectureController.addLecture);
electron_1.ipcMain.on("update-lecture", lectureController.updateLecture);
electron_1.ipcMain.on("find-lectures-by-week", lectureController.findLecturesByWeek);
electron_1.ipcMain.on("find-all-lectures", lectureController.findAllLectures);
electron_1.ipcMain.on("find-lectures-by-day", lectureController.findLecturesByDay);
electron_1.ipcMain.on("find-lectures-by-student-name", lectureController.findLecturesByStudentName);
