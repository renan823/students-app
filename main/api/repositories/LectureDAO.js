"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const pouchdb_1 = __importDefault(require("pouchdb"));
pouchdb_1.default.plugin(require('pouchdb-find'));
const dayjs_1 = __importDefault(require("dayjs"));
const StudentDAO_1 = __importDefault(require("./StudentDAO"));
class LectureDAO {
    database;
    constructor() {
        this.database = new pouchdb_1.default("lectures");
    }
    async create(event, lecture) {
        this.database = new pouchdb_1.default("lectures");
        try {
            const result = await this.database.put(lecture);
            return event.reply("add-lecture-success", result);
        }
        catch (error) {
            return event.reply("add-lecture-error", error.message);
        }
    }
    async update(event, lecture) {
        this.database = new pouchdb_1.default("lectures");
        try {
            const doc = await this.database.get(lecture._id);
            const result = await this.database.put({
                _rev: doc._rev,
                ...lecture
            });
            return event.reply("update-lecture-success", result);
        }
        catch (error) {
            return event.reply("update-lecture-error", error.message);
        }
    }
    async findAll(event, currentPage, perPage) {
        this.database = new pouchdb_1.default("lectures");
        try {
            let skip = (currentPage - 1) * perPage;
            let result = await this.database.find({
                selector: {
                    _id: undefined
                },
                skip,
                limit: perPage,
            });
            result.docs.sort((a, b) => (0, dayjs_1.default)(b.lesson.startAt).unix() - (0, dayjs_1.default)(a.lesson.startAt).unix());
            let lectures = [];
            const dao = new StudentDAO_1.default();
            for (const doc of result.docs) {
                let lecture = doc;
                const student = await dao.findStudentById(lecture.studentId);
                if (student) {
                    lectures.push({ ...lecture, student });
                }
            }
            let debt = await this.database.find({
                selector: {
                    payed: false
                }
            });
            return event.reply("find-all-lectures-success", { lectures, debt: debt.docs.length });
        }
        catch (error) {
            console.log(error);
            return event.reply("find-all-lectures-error", error.message);
        }
    }
    async findLecturesByWeek(event, day) {
        this.database = new pouchdb_1.default("lectures");
        try {
            const sunday = (0, dayjs_1.default)(day).startOf("week").startOf("day");
            const saturday = (0, dayjs_1.default)(sunday).endOf("week").endOf("day");
            const result = await this.database.find({
                selector: {
                    lesson: {
                        startAt: {
                            $gte: sunday.toISOString(),
                            $lte: saturday.toISOString()
                        }
                    }
                },
            });
            const dao = new StudentDAO_1.default();
            let lectures = [];
            for (const doc of result.docs) {
                let lecture = doc;
                const student = await dao.findStudentById(lecture.studentId);
                if (student) {
                    lectures.push({ ...lecture, student });
                }
            }
            return event.reply("lectures-by-week-success", lectures);
        }
        catch (error) {
            return event.reply("lectures-by-week-error", error.message);
        }
    }
    async findLecturesByMonthsAgo(event, months) {
        this.database = new pouchdb_1.default("lectures");
        try {
            const currentMonth = (0, dayjs_1.default)().endOf("month").endOf("day");
            const monthsAgo = (0, dayjs_1.default)().startOf("month").startOf("day").set("month", -months);
            const result = await this.database.find({
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
            const dao = new StudentDAO_1.default();
            let lectures = [];
            for (const doc of result.docs) {
                let lecture = doc;
                let student = await dao.findStudentById(lecture.studentId);
                if (student) {
                    lectures.push({ ...lecture, student });
                }
            }
            return event.reply("lectures-months-ago-success", lectures);
        }
        catch (error) {
            return event.reply("lectures-months-ago-error", error.message);
        }
    }
    async findLecturesByStudentName(event, name) {
        this.database = new pouchdb_1.default("lectures");
        try {
            const students = new pouchdb_1.default("students");
            let result = await students.find({
                selector: {
                    name: {
                        $regex: `.*${name.charAt(0).toUpperCase() + name.slice(1)}.*`
                    }
                }
            });
            result.docs.sort((a, b) => (0, dayjs_1.default)(b.lesson.startAt).unix() - (0, dayjs_1.default)(a.lesson.startAt).unix());
            const lectures = [];
            for (const doc of result.docs) {
                let student = doc;
                let results = await this.database.find({
                    selector: {
                        studentCpf: {
                            $eq: student.cpf
                        }
                    }
                });
                for (const lecture of results.docs) {
                    lectures.push({ ...lecture, student: { name: student.name } });
                }
            }
            return event.reply("find-lectures-by-student-name-success", lectures);
        }
        catch (error) {
            return event.reply("find-lectures-by-student-name-error", error.message);
        }
    }
    async sumPaymentsByDay(event, day) {
        this.database = new pouchdb_1.default("lectures");
        try {
            const startOfDay = (0, dayjs_1.default)(day).startOf("day");
            const endOfDay = (0, dayjs_1.default)(day).endOf("day");
            console.log(startOfDay.toISOString());
            const result = await this.database.find({
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
            console.log(result.docs);
            let total = 0;
            result.docs.forEach((doc) => {
                total += doc.lesson.value;
            });
            return event.reply("sum-lectures-by-day-success", total);
        }
        catch (error) {
            return event.reply("sum-lectures-by-day-error", error.message);
        }
    }
    async countLectures(event) {
        this.database = new pouchdb_1.default("lectures");
        try {
            const { doc_count } = await this.database.info();
            let total = doc_count;
            return event.reply("count-lectures-success", total);
        }
        catch (error) {
            return event.reply("count-lectures-error", error.message);
        }
    }
    async findLectureByStudentId(id) {
        this.database = new pouchdb_1.default("lectures");
        try {
            const lectures = await this.database.find({
                selector: {
                    $and: [
                        { studentId: id },
                        { payed: false }
                    ]
                }
            });
            return lectures.docs;
        }
        catch (error) {
            return null;
        }
    }
}
exports.default = LectureDAO;
