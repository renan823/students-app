import { IpcMainEvent } from "electron";
import LectureService from "../services/LectureService";
import { Lecture } from "../interfaces";
import StudentService from "../services/StudentService";
import EventService from "../services/EventService";
import dayjs from "dayjs";

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
            console.log(error)
            return event.reply("add-lecture-error", { message: error.message || "Algo deu errado" });
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
            const eventService = new EventService();

            const events = await eventService.findAllEvents();

            for (const event of events.docs) {
                const lecture = await eventService.createLectureFromEvent(event);

                console.log(lecture, dayjs().toISOString())
                
                if (lecture) {
                    if (dayjs(lecture.lesson.startAt).isBefore(dayjs()) && dayjs(lecture.lesson.startAt).isAfter(dayjs(lecture.event?.initialDate))) {
                        await lectureService.addLecture(lecture);
                    }
                }
            }

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

            return event.reply("find-lectures-by-day-success", { lectures });
        } catch (error: any) {
            return event.reply("find-lectures-by-day-error", { message: error.message || "Algo deu errado" });
        }
    }

    async findLecturesByMonthsAgo (event: IpcMainEvent, months: number) {
        try {
            const lectureService = new LectureService();

            const result = await lectureService.findLecturesByMonthsAgo(months);

            const lectures = await lectureService.joinWithStudents(result);

            return event.reply("find-lectures-by-months-ago-success", { lectures });
        } catch (error: any) {
            return event.reply("find-lectures-by-months-ago-error", { message: error.message || "Algo deu errado" });
        }
    }

    async findLecturesByStudentName (event: IpcMainEvent, name: string) {
        try {
            const lectureService = new LectureService();
            const studentService = new StudentService();

            const students = await studentService.findStudentsByName(name);

            const lectures = await lectureService.findLecturesByStudents(students);

            return event.reply("find-lectures-by-student-name-success", { lectures });
        } catch (error: any) {
            return event.reply("find-lectures-by-student-name-error", { message: error.message || "Algo deu errado" });
        }
    }
}

export default LectureController;