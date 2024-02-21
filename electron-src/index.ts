// Native
import { join } from "path";
import { format } from "url";

// Packages
import { BrowserWindow, app, ipcMain } from "electron";
import isDev from "electron-is-dev";
import prepareNext from "electron-next";

//Controllers
import UserDAO from "../api/repositories/UserDAO";
import LessonDAO from "../api/repositories/LessonDAO";
import LectureDAO from "../api/repositories/LectureDAO";

// Prepare the renderer once the app is ready
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
	mainWindow.removeMenu();
  	mainWindow.loadURL(url);
});

// Quit the app once all windows are closed
app.on("window-all-closed", app.quit);

//user events 
const userDAO = new UserDAO();

const lessonDAO = new LessonDAO();

const lectureDAO = new LectureDAO();

// Manipuladores de eventos para operações de usuário
ipcMain.on("create-user", (event, data) => {
    userDAO.create(event, data).catch(error => console.error(error));
});

ipcMain.on("update-user", (event, cpf, newData) => {
    userDAO.update(event, cpf, newData).catch(error => console.error(error));
});

ipcMain.on("find-users-by-name", (event, name) => {
	userDAO.findUserByName(event, name).catch(error => console.error(error));
});

ipcMain.on("find-users-by-mother-name", (event, motherName) => {
	userDAO.findUserByMotherName(event, motherName).catch(error => console.error(error));
});

ipcMain.on("find-all-students-with-phones-and-debt", (event) => {
	userDAO.findAllStudentsWithPhonesAndDebt(event).catch(error => console.error(error));
});

// Manipuladores de eventos para operações de telefone
ipcMain.on("create-many-phones", (event, data) => {
	userDAO.createManyPhones(event, data).catch(error => console.error(error));
});

ipcMain.on("update-many-phones", (event, data) => {
	userDAO.updateManyPhones(event, data).catch(error => console.error(error));
});

// Manipuladores de eventos para operações de lições
ipcMain.on("create-lesson", (event, data) => {
	lessonDAO.create(event, data).catch(error => console.error(error));
});

ipcMain.on("update-lesson", (event, id, newData) => {
	lessonDAO.update(event, id, newData).catch(error => console.error(error));
});

//Manipuladores de eventos para operações de aulas
ipcMain.on("create-lecture", (event, data) => {
	lectureDAO.create(event, data).catch(error => console.error(error));
});

ipcMain.on("update-lecture", (event, id, newData) => {
	lectureDAO.update(event, id, newData).catch(error => console.error(error));
});

ipcMain.on("find-lectures-by-week", (event) => {
	lectureDAO.findLecturesByWeek(event).catch(error => console.error(error));
});

ipcMain.on("find-all-lectures-sorted-by-date", (event, skip, take) => {
	lectureDAO.findAllLecturesSortedByDate(event, skip, take).catch(error => console.error(error));
});

ipcMain.on("find-lectures-last-ten-months", (event) => {
	lectureDAO.findLecturesLastTenMonths(event).catch(error => console.error(error));
});

ipcMain.on("find-lectures-by-student-name", (event, name) => {
	lectureDAO.findLecturesByStudentName(event, name).catch(error => console.error(error));
});
