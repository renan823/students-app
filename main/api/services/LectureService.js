"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const pouchdb_1 = __importDefault(require("pouchdb"));
const dayjs_1 = __importDefault(require("dayjs"));
const StudentService_1 = __importDefault(require("./StudentService"));
pouchdb_1.default.plugin(require('pouchdb-find'));
class LectureService {
    database;
    constructor() {
        this.database = new pouchdb_1.default("lectures");
    }
    ;
    sortLecturesByDate(lectures) {
        return lectures.docs.sort((l1, l2) => (0, dayjs_1.default)(l2.lesson.startAt).unix() - (0, dayjs_1.default)(l1.lesson.startAt).unix());
    }
    async addLecture(lecture) {
        try {
            const exists = await this.database.find({
                selector: {
                    studentId: lecture.studentId,
                    lesson: {
                        startAt: lecture.lesson.startAt
                    },
                    event: {
                        _id: lecture.event?._id
                    }
                }
            });
            if (exists.docs.length === 0) {
                const result = await this.database.put(lecture);
                return result;
            }
        }
        catch (error) {
            throw new Error("Erro ao cadastrar aula");
        }
    }
    async updateLecture(lecture) {
        try {
            const doc = await this.database.get(lecture._id);
            const result = await this.database.put({
                _rev: doc._rev,
                ...lecture
            });
            return result;
        }
        catch (error) {
            throw new Error("Erro ao atualizar dados da aula");
        }
    }
    async findAllLectures(currentPage, perPage) {
        try {
            const skip = (currentPage - 1) * perPage;
            const lectures = await this.database.find({
                selector: {
                    _id: undefined
                },
                skip,
                limit: perPage,
            });
            return this.sortLecturesByDate(lectures);
        }
        catch (error) {
            throw new Error("Erro ao buscar aulas");
        }
    }
    async findLecturesByWeek(day) {
        try {
            const weekStart = (0, dayjs_1.default)(day).startOf("week").startOf("day");
            const weekEnd = (0, dayjs_1.default)(day).endOf("week").endOf("day");
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
        }
        catch (error) {
            throw new Error("Erro ao buscar aulas");
        }
    }
    async findLecturesByDay(day) {
        try {
            const startOfDay = (0, dayjs_1.default)(day).startOf("day");
            const endOfDay = (0, dayjs_1.default)(day).endOf("day");
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
            });
            return this.sortLecturesByDate(lectures);
        }
        catch (error) {
            throw new Error("Erro ao buscar aulas");
        }
    }
    async findLecturesByMonthsAgo(months) {
        try {
            const currentMonth = (0, dayjs_1.default)().endOf("month").endOf("day");
            const monthsAgo = (0, dayjs_1.default)().startOf("month").startOf("day").set("month", -months);
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
            });
            return this.sortLecturesByDate(lectures);
        }
        catch (error) {
            throw new Error("Erro ao buscar aulas");
        }
    }
    async findLecturesByDebt() {
        try {
            const lectures = await this.database.find({
                selector: {
                    payed: false
                }
            });
            return this.sortLecturesByDate(lectures);
        }
        catch (error) {
            throw new Error("Erro ao buscar aulas");
        }
    }
    async findLecturesByStudentId(studentId) {
        try {
            const lectures = await this.database.find({
                selector: {
                    studentId,
                }
            });
            return this.sortLecturesByDate(lectures);
        }
        catch (error) {
            throw new Error("Erro ao buscar aulas");
        }
    }
    async findLecturesByStudents(students) {
        try {
            const lectures = [];
            for (const student of students) {
                const lecture = await this.findLecturesByStudentId(student._id);
                lecture.forEach(item => lectures.push({ lecture: item, student }));
            }
            return lectures.sort((l1, l2) => (0, dayjs_1.default)(l2.lecture.lesson.startAt).unix() - (0, dayjs_1.default)(l1.lecture.lesson.startAt).unix());
        }
        catch (error) {
            throw new Error("Erro ao buscar aulas");
        }
    }
    async findLecturesByEventId(id) {
        try {
            if (id) {
                const lectures = await this.database.find({
                    selector: {
                        event: {
                            _id: id
                        }
                    }
                });
                return this.sortLecturesByDate(lectures);
            }
            else {
                return [];
            }
        }
        catch (error) {
            throw new Error("Erro ao buscar aulas");
        }
    }
    async countLectures() {
        try {
            const { doc_count } = await this.database.info();
            return doc_count;
        }
        catch (error) {
            throw new Error("Erro ao contar aulas");
        }
    }
    async joinWithStudents(result) {
        try {
            const lectures = [];
            const studentService = new StudentService_1.default();
            for (const lecture of result) {
                const student = await studentService.findStudentById(lecture.studentId);
                lectures.push({ student, lecture });
            }
            return lectures;
        }
        catch (error) {
            throw new Error("Erro ao buscar aulas");
        }
    }
}
exports.default = LectureService;
