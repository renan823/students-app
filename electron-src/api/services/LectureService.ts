import PouchDB from "pouchdb";
import { Lecture, Student } from "../interfaces";
import dayjs from "dayjs";
import StudentService from "./StudentService";
PouchDB.plugin(require('pouchdb-find'));

class LectureService {

    private readonly database: PouchDB.Database<Lecture>;

    constructor () {
        this.database = new PouchDB<Lecture>("lectures");
    };

    private sortLecturesByDate (lectures: PouchDB.Find.FindResponse<Lecture>): PouchDB.Core.ExistingDocument<Lecture>[] {
        return lectures.docs.sort((l1: Lecture, l2: Lecture) => dayjs(l2.lesson.startAt).unix() - dayjs(l1.lesson.startAt).unix());
    }

    async addLecture (lecture: Lecture) {
        try {
            const result = await this.database.put<Lecture>(lecture);

            return result;
        } catch (error: any) {
            throw new Error("Erro ao cadastrar aula");
        }
    }

    async updateLecture (lecture: Lecture) {
        try {
            const doc = await this.database.get<Lecture>(lecture._id);
            const result = await this.database.put<Lecture>({
                _rev: doc._rev,
                ...lecture
            });

            return result;
        } catch (error: any) {
            throw new Error("Erro ao atualizar dados da aula");
        }
    }

    async findAllLectures (currentPage: number, perPage: number) {
        try {
            const skip = (currentPage -1) * perPage;

            const lectures = await this.database.find({
                selector: {
                    _id: undefined
                },
                skip,
                limit: perPage,
            });

            return this.sortLecturesByDate(lectures);
        } catch (error: any) {
            throw new Error("Erro ao buscar aulas");
        }
    }

    async findLecturesByWeek (day: string) {
        try {
            const weekStart = dayjs(day).startOf("week").startOf("day");
            const weekEnd = dayjs(day).endOf("week").endOf("day");

            const lectures = await this.database.find({
                selector: { 
                    lesson: {
                        startAt: {
                            $gte: weekStart.toISOString(),
                            $lte: weekEnd.toISOString()
                        }
                    }
                },
            });

            return this.sortLecturesByDate(lectures);
        } catch (error: any) {
            throw new Error("Erro ao buscar aulas");
        }
    }

    async findLecturesByDay (day: string) {
        try {
            const startOfDay = dayjs(day).startOf("day");
            const endOfDay = dayjs(day).endOf("day");

            const lectures = await this.database.find({
                selector: { 
                    lesson: {
                        startAt: {
                            $gte: startOfDay.toISOString(),
                            $lte: endOfDay.toISOString()
                        }
                    },
                    payed: true
                },
            })

            return this.sortLecturesByDate(lectures);
        } catch (error: any) {
            throw new Error("Erro ao buscar aulas");
        }
    }

    async findLecturesByMonthsAgo (months: number) {
        try {
            const currentMonth = dayjs().endOf("month").endOf("day");
            const monthsAgo = dayjs().startOf("month").startOf("day").set("month", -months);

            const lectures = await this.database.find({
                selector: { 
                    lesson: {
                        startAt: {
                            $gte: monthsAgo.toISOString(),
                            $lte: currentMonth.toISOString()
                        }
                    },
                    payed: true
                },
            })

            return this.sortLecturesByDate(lectures);
        } catch (error: any) {
            throw new Error("Erro ao buscar aulas");
        }
    }

    async findLecturesByDebt () {
        try {
            const lectures = await this.database.find({
                selector: {
                    payed: false
                }
            })

            return this.sortLecturesByDate(lectures);
        } catch (error: any) {
            throw new Error("Erro ao buscar aulas");
        }
    }

    async findLecturesByStudentId (studentId: string) {
        try {
            const lectures = await this.database.find({
                selector: {
                    studentId,
                }
            })

            return this.sortLecturesByDate(lectures);
        } catch (error: any) {
            throw new Error("Erro ao buscar aulas");
        }
    }

    async findLecturesByStudents (students: PouchDB.Core.ExistingDocument<Student>[]) {
        try {
            const lectures: { lecture: Lecture, student: Student }[] = [];

            for (const student of students) {
                const lecture = await this.findLecturesByStudentId(student._id);
                
                lecture.forEach(item => lectures.push({ lecture: item, student }));
            }

            return lectures.sort((l1, l2) => dayjs(l2.lecture.lesson.startAt).unix() - dayjs(l1.lecture.lesson.startAt).unix());
        } catch (error: any) {
            throw new Error("Erro ao buscar aulas");
        }
    }

    async countLectures () {
        try {
            const { doc_count } = await this.database.info();

            return doc_count;
        } catch (error: any) {
            throw new Error("Erro ao contar aulas");
        }
    }

    async joinWithStudents (result: PouchDB.Core.ExistingDocument<Lecture>[]) {
        try {
            const lectures: { student: Student, lecture: Lecture }[] = [];
            const studentService = new StudentService();

            for (const lecture of result) {
                const student = await studentService.findStudentById(lecture.studentId);

                lectures.push({ student, lecture });
            }

            return lectures;
        } catch (error: any) {
            throw new Error("Erro ao buscar aulas");
        }
    }
}

export default LectureService;