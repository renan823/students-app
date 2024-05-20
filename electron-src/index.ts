import { join } from "path";
import { format } from "url";

import { BrowserWindow, app, ipcMain } from "electron";
import isDev from "electron-is-dev";
import prepareNext from "electron-next";
import StudentController from "./api/controllers/StudentController";
import LectureController from "./api/controllers/LectureController";


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

const studentController = new StudentController();

ipcMain.on("add-student", studentController.addStudent);
ipcMain.on("update-student", studentController.updateStudent);
ipcMain.on("find-all-students", studentController.findAllStudents);
ipcMain.on("find-students-by-name", studentController.findStudentsByName);
ipcMain.on("find-students-by-mothername", studentController.findStudentsByMotherName);
ipcMain.on("find-students-in-debt", studentController.findStudentsInDebt);
ipcMain.on("count-students", studentController.countStudents);


const lectureController = new LectureController();

ipcMain.on("add-lecture", lectureController.addLecture);
ipcMain.on("update-lecture", lectureController.updateLecture);
ipcMain.on("find-lectures-by-week", lectureController.findLecturesByWeek);
ipcMain.on("find-all-lectures", lectureController.findAllLectures);
ipcMain.on("find-lectures-by-day", lectureController.findLecturesByDay);
ipcMain.on("find-lectures-by-student-name", lectureController.findLecturesByStudentName);
