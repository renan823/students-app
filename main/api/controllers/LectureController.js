"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const LectureService_1 = __importDefault(require("../services/LectureService"));
const StudentService_1 = __importDefault(require("../services/StudentService"));
class LectureController {
    constructor() { }
    ;
    async addLecture(event, lecture) {
        try {
            const lectureService = new LectureService_1.default();
            const createdLecture = await lectureService.addLecture(lecture);
            return event.reply("add-lecture-success", { lecture: createdLecture });
        }
        catch (error) {
            return event.reply("add-student-error", { message: error.message || "Algo deu errado" });
        }
    }
    async updateLecture(event, lecture) {
        try {
            const lectureService = new LectureService_1.default();
            const upadtedLecture = await lectureService.updateLecture(lecture);
            return event.reply("update-lecture-success", { lecture: upadtedLecture });
        }
        catch (error) {
            return event.reply("update-lecture-error", { message: error.message || "Algo deu errado" });
        }
    }
    async findAllLectures(event, currentPage, perPage) {
        try {
            const lectureService = new LectureService_1.default();
            const result = await lectureService.findAllLectures(currentPage, perPage);
            const lectures = await lectureService.joinWithStudents(result);
            return event.reply("find-all-lectures-success", { lectures });
        }
        catch (error) {
            return event.reply("find-all-lectures-error", { message: error.message || "Algo deu errado" });
        }
    }
    async findLecturesByWeek(event, day) {
        try {
            const lectureService = new LectureService_1.default();
            const result = await lectureService.findLecturesByWeek(day);
            const lectures = await lectureService.joinWithStudents(result);
            return event.reply("find-lectures-by-week-success", { lectures });
        }
        catch (error) {
            return event.reply("find-lectures-by-week-error", { message: error.message || "Algo deu errado" });
        }
    }
    async findLecturesByDay(event, day) {
        try {
            const lectureService = new LectureService_1.default();
            const result = await lectureService.findLecturesByDay(day);
            const lectures = await lectureService.joinWithStudents(result);
            return event.reply("find-lectures-by-week-success", { lectures });
        }
        catch (error) {
            return event.reply("find-lectures-by-week-error", { message: error.message || "Algo deu errado" });
        }
    }
    async findLecturesByMonthsAgo(event, months) {
        try {
            const lectureService = new LectureService_1.default();
            const result = await lectureService.findLecturesByMonthsAgo(months);
            const lectures = await lectureService.joinWithStudents(result);
            return event.reply("find-lectures-by-week-success", { lectures });
        }
        catch (error) {
            return event.reply("find-lectures-by-week-error", { message: error.message || "Algo deu errado" });
        }
    }
    async findLecturesByStudentName(event, name) {
        try {
            const lectureService = new LectureService_1.default();
            const studentService = new StudentService_1.default();
            const students = await studentService.findStudentsByName(name);
            const lectures = await lectureService.findLecturesByStudents(students);
            return event.reply("find-lectures-by-week-success", { lectures });
        }
        catch (error) {
            return event.reply("find-lectures-by-week-error", { message: error.message || "Algo deu errado" });
        }
    }
}
exports.default = LectureController;
