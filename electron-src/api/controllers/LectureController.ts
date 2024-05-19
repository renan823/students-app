import { IpcMainEvent } from "electron";
import LectureService from "../services/LectureService";
import { Lecture } from "../interfaces";
import StudentService from "../services/StudentService";
import EventService from "../services/EventService";

class LectureController {

    constructor () {};

    async addLecture (event: IpcMainEvent, lecture: Lecture) {
        try {
            const lectureService = new LectureService();
            const eventService = new EventService();

            const createdLecture = await lectureService.addLecture(lecture);

            if (lecture.event && lecture.event.repeat.includes(true)) {
                await eventService.addEvent(lecture.event);
            }

            return event.reply("add-lecture-success", { lecture: createdLecture });
        } catch (error: any) {
            return event.reply("add-student-error", { message: error.message || "Algo deu errado" });
        }
    }

    async updateLecture (event: IpcMainEvent, lecture: Lecture) {
        try {
            const lectureService = new LectureService();
            const eventService = new EventService();

            const upadtedLecture = await lectureService.updateLecture(lecture);

            if (lecture.event) {
                await eventService.updateEvent(lecture.event);
            }

            return event.reply("update-lecture-success", { lecture: upadtedLecture });
        } catch (error: any) {
            return event.reply("update-lecture-error", { message: error.message || "Algo deu errado" });
        }
    }

    async findAllLectures (event: IpcMainEvent, currentPage: number, perPage: number) {
        try {
            const lectureService = new LectureService();

            const result = await lectureService.findAllLectures(currentPage, perPage);

            const lectures = await lectureService.joinWithStudents(result);

            return event.reply("find-all-lectures-success", { lectures });
        } catch (error: any) {
            return event.reply("find-all-lectures-error", { message: error.message || "Algo deu errado" });
        }
    }

    async findLecturesByWeek (event: IpcMainEvent, day: string) {
        try {
            const lectureService = new LectureService();

            const result = await lectureService.findLecturesByWeek(day);

            const lectures = await lectureService.joinWithStudents(result);

            return event.reply("find-lectures-by-week-success", { lectures });
        } catch (error: any) {
            return event.reply("find-lectures-by-week-error", { message: error.message || "Algo deu errado" });
        }
    }

    async findLecturesByDay (event: IpcMainEvent, day: string) {
        try {
            const lectureService = new LectureService();

            const result = await lectureService.findLecturesByDay(day);

            const lectures = await lectureService.joinWithStudents(result);

            return event.reply("find-lectures-by-week-success", { lectures });
        } catch (error: any) {
            return event.reply("find-lectures-by-week-error", { message: error.message || "Algo deu errado" });
        }
    }

    async findLecturesByMonthsAgo (event: IpcMainEvent, months: number) {
        try {
            const lectureService = new LectureService();

            const result = await lectureService.findLecturesByMonthsAgo(months);

            const lectures = await lectureService.joinWithStudents(result);

            return event.reply("find-lectures-by-week-success", { lectures });
        } catch (error: any) {
            return event.reply("find-lectures-by-week-error", { message: error.message || "Algo deu errado" });
        }
    }

    async findLecturesByStudentName (event: IpcMainEvent, name: string) {
        try {
            const lectureService = new LectureService();
            const studentService = new StudentService();

            const students = await studentService.findStudentsByName(name);

            const lectures = await lectureService.findLecturesByStudents(students);

            return event.reply("find-lectures-by-week-success", { lectures });
        } catch (error: any) {
            return event.reply("find-lectures-by-week-error", { message: error.message || "Algo deu errado" });
        }
    }
}

export default LectureController;