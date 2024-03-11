"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const pouchdb_1 = __importDefault(require("pouchdb"));
pouchdb_1.default.plugin(require('pouchdb-find'));
const LectureDAO_1 = __importDefault(require("./LectureDAO"));
class StudentDAO {
    database;
    constructor() {
        this.database = new pouchdb_1.default("students");
    }
    async create(event, student) {
        this.database = new pouchdb_1.default("students");
        try {
            const result = await this.database.put(student);
            return event.reply("add-student-success", result);
        }
        catch (error) {
            return event.reply("add-student-error", error.message);
        }
    }
    async update(event, student) {
        this.database = new pouchdb_1.default("students");
        try {
            const doc = await this.database.get(student._id);
            const result = await this.database.put({
                _rev: doc._rev,
                ...student
            });
            return event.reply("update-student-success", result);
        }
        catch (error) {
            return event.reply("update-student-error", error.message);
        }
    }
    async findAll(event, currentPage, perPage) {
        this.database = new pouchdb_1.default("students");
        try {
            let skip = (currentPage - 1) * perPage;
            let result = await this.database.find({
                selector: {
                    _id: undefined
                },
                skip,
                limit: perPage,
            });
            result.docs.sort((a, b) => a.name.localeCompare(b.name));
            let students = [];
            let dao = new LectureDAO_1.default();
            for (const doc of result.docs) {
                let student = doc;
                let debtAmount = 0;
                const lectures = await dao.findLectureByStudentId(student._id);
                if (lectures) {
                    lectures.map((lecture) => { debtAmount += lecture.lesson.value; });
                    students.push({ student, debtAmount });
                }
            }
            return event.reply("find-all-students-success", { students });
        }
        catch (error) {
            return event.reply("find-all-students-error", error.message);
        }
    }
    async findStudentsByName(event, name) {
        this.database = new pouchdb_1.default("students");
        try {
            let result = await this.database.find({
                selector: {
                    name: {
                        $regex: `.*${name.charAt(0).toUpperCase() + name.slice(1)}.*`
                    }
                },
            });
            result.docs.sort((a, b) => a.name.localeCompare(b.name));
            let students = [];
            let dao = new LectureDAO_1.default();
            for (const row of result.docs) {
                let student = row;
                let debtAmount = 0;
                const lectures = await dao.findLectureByStudentId(student._id);
                if (lectures) {
                    lectures.map((lecture) => { debtAmount += lecture.lesson.value; });
                    students.push({ student, debtAmount });
                }
            }
            return event.reply("find-students-by-name-success", students);
        }
        catch (error) {
            return event.reply("find-students-by-name-error", error.message);
        }
    }
    async findStudentsByMotherName(event, name) {
        this.database = new pouchdb_1.default("students");
        try {
            let result = await this.database.find({
                selector: {
                    motherName: {
                        $regex: `.*${name.charAt(0).toUpperCase() + name.slice(1)}.*`
                    }
                },
            });
            result.docs.sort((a, b) => a.name.localeCompare(b.name));
            let students = [];
            let dao = new LectureDAO_1.default();
            for (const row of result.docs) {
                let student = row;
                let debtAmount = 0;
                const lectures = await dao.findLectureByStudentId(student._id);
                if (lectures) {
                    lectures.map((lecture) => { debtAmount += lecture.lesson.value; });
                    students.push({ student, debtAmount });
                }
            }
            return event.reply("find-students-by-mothername-success", students);
        }
        catch (error) {
            return event.reply("find-students-by-mothername-error", error.message);
        }
    }
    async findByNameForLectures(event, name) {
        this.database = new pouchdb_1.default("students");
        try {
            let result = await this.database.find({
                selector: {
                    name: {
                        $regex: `.*${name.charAt(0).toUpperCase() + name.slice(1)}.*`
                    }
                },
            });
            result.docs.sort((a, b) => a.name.localeCompare(b.name));
            return event.reply("find-students-by-name-for-lectures-success", result.docs);
        }
        catch (error) {
            return event.reply("find-students-by-name-for-lectures-error", error.message);
        }
    }
    async countStudents(event) {
        this.database = new pouchdb_1.default("students");
        try {
            const { doc_count } = await this.database.info();
            let total = doc_count;
            return event.reply("count-students-success", total);
        }
        catch (error) {
            return event.reply("count-students-error", error.message);
        }
    }
    async findStudentById(id) {
        this.database = new pouchdb_1.default("students");
        try {
            const student = await this.database.get(id);
            return student;
        }
        catch (error) {
            return null;
        }
    }
}
exports.default = StudentDAO;
