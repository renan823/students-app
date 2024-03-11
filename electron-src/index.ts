import { join } from "path";
import { format } from "url";

import { BrowserWindow, app, ipcMain } from "electron";
import isDev from "electron-is-dev";
import prepareNext from "electron-next";

import StudentDAO from "./api/repositories/StudentDAO";
import LectureDAO from "./api/repositories/LectureDAO";

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

const studentDAO = new StudentDAO();
const lectureDAO = new LectureDAO();

//Students
ipcMain.on("add-student", studentDAO.create);

ipcMain.on("update-student", studentDAO.update);

ipcMain.on("find-all-students", studentDAO.findAll);

ipcMain.on("find-students-by-name", studentDAO.findStudentsByName);

ipcMain.on("find-students-by-mothername", studentDAO.findStudentsByMotherName);

ipcMain.on("find-students-by-name-for-lectures", studentDAO.findByNameForLectures);

ipcMain.on("count-students", studentDAO.countStudents);

//Lectures
ipcMain.on("add-lecture", lectureDAO.create);

ipcMain.on("update-lecture", lectureDAO.update);

ipcMain.on("lectures-by-week", lectureDAO.findLecturesByWeek);

ipcMain.on("find-all-lectures", lectureDAO.findAll);

ipcMain.on("lectures-months-ago", lectureDAO.findLecturesByMonthsAgo);

ipcMain.on("find-lectures-by-student-name", lectureDAO.findLecturesByStudentName);

ipcMain.on("count-lectures", lectureDAO.countLectures);

ipcMain.on("sum-lectures-by-day", lectureDAO.sumPaymentsByDay);
