"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const LectureService_1 = __importDefault(require("../services/LectureService"));
const StudentService_1 = __importDefault(require("../services/StudentService"));
const EventService_1 = __importDefault(require("../services/EventService"));
const dayjs_1 = __importDefault(require("dayjs"));
class LectureController {
    constructor() { }
    ;
    async addLecture(event, lecture) {
        try {
            const lectureService = new LectureService_1.default();
            const eventService = new EventService_1.default();
            const createdLecture = await lectureService.addLecture(lecture);
            if (lecture.event && lecture.event.repeat.includes(true)) {
                await eventService.addEvent(lecture.event);
            }
            return event.reply("add-lecture-success", { lecture: createdLecture });
        }
        catch (error) {
            return event.reply("add-lecture-error", { message: error.message || "Algo deu errado" });
        }
    }
    async updateLecture(event, lecture) {
        try {
            const lectureService = new LectureService_1.default();
            const eventService = new EventService_1.default();
            const upadtedLecture = await lectureService.updateLecture(lecture);
            if (lecture.event) {
                await eventService.updateEvent(lecture.event);
            }
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
            const eventService = new EventService_1.default();
            const events = await eventService.findAllEvents();
            const eventsToShow = [];
            for (const event of events.docs) {
                const lectures = await eventService.createLecturesFromEvent(event, day);
                for (const lecture of lectures) {
                    if (lecture) {
                        if ((0, dayjs_1.default)(lecture.lesson.startAt).isAfter((0, dayjs_1.default)(lecture.event?.initialDate))) {
                            if ((0, dayjs_1.default)(lecture.lesson.startAt).isBefore((0, dayjs_1.default)())) {
                                await lectureService.addLecture(lecture);
                            }
                            else {
                                const studentService = new StudentService_1.default();
                                const student = await studentService.findStudentById(lecture.studentId);
                                eventsToShow.push({ lecture, student });
                            }
                        }
                    }
                }
            }
            const result = await lectureService.findLecturesByWeek(day);
            const lectures = await lectureService.joinWithStudents(result);
            return event.reply("find-lectures-by-week-success", { lectures: [...lectures, ...eventsToShow] });
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
            return event.reply("find-lectures-by-day-success", { lectures });
        }
        catch (error) {
            return event.reply("find-lectures-by-day-error", { message: error.message || "Algo deu errado" });
        }
    }
    async findLecturesByMonthsAgo(event, months) {
        try {
            const lectureService = new LectureService_1.default();
            const result = await lectureService.findLecturesByMonthsAgo(months);
            const lectures = await lectureService.joinWithStudents(result);
            return event.reply("find-lectures-by-months-ago-success", { lectures });
        }
        catch (error) {
            return event.reply("find-lectures-by-months-ago-error", { message: error.message || "Algo deu errado" });
        }
    }
    async findLecturesByStudentName(event, name) {
        try {
            const lectureService = new LectureService_1.default();
            const studentService = new StudentService_1.default();
            const students = await studentService.findStudentsByName(name);
            const lectures = await lectureService.findLecturesByStudents(students);
            return event.reply("find-lectures-by-student-name-success", { lectures });
        }
        catch (error) {
            return event.reply("find-lectures-by-student-name-error", { message: error.message || "Algo deu errado" });
        }
    }
    async countLectures(event) {
        try {
            const lectureService = new LectureService_1.default();
            const lectures = await lectureService.countLectures();
            return event.reply("count-lectures-success", { total: lectures });
        }
        catch (error) {
            return event.reply("count-lectures-error", { message: error.message || "Algo deu errado" });
        }
    }
}
exports.default = LectureController;
