"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const pouchdb_1 = __importDefault(require("pouchdb"));
const LectureService_1 = __importDefault(require("./LectureService"));
pouchdb_1.default.plugin(require('pouchdb-find'));
class StudentService {
    database;
    constructor() {
        this.database = new pouchdb_1.default("students");
    }
    ;
    sortStudentByName(students) {
        return students.docs.sort((s1, s2) => s1.name.localeCompare(s2.name));
    }
    async addStudent(student) {
        try {
            const result = await this.database.put(student);
            return result;
        }
        catch (error) {
            throw new Error("Erro ao cadastrar aluno");
        }
    }
    async updateStudent(student) {
        try {
            const doc = await this.database.get(student._id);
            const result = await this.database.put({
                _rev: doc._rev,
                ...student
            });
            return result;
        }
        catch (error) {
            throw new Error("Erro ao atualizar dados do aluno");
        }
    }
    async findStudentById(id) {
        try {
            const student = await this.database.get(id);
            return student;
        }
        catch (error) {
            throw new Error("Erro ao buscar aluno");
        }
    }
    async findAllStudents(currentPage, perPage) {
        try {
            const skip = (currentPage - 1) * perPage;
            const students = await this.database.find({
                selector: {
                    _id: undefined
                },
                skip,
                limit: perPage,
            });
            return this.sortStudentByName(students);
        }
        catch (error) {
            throw new Error("Erro ao buscar alunos");
        }
    }
    async findStudentsByName(name) {
        try {
            const result = await this.database.find({
                selector: {
                    name: {
                        $regex: `.*${name.charAt(0).toUpperCase() + name.slice(1)}.*`
                    }
                },
            });
            return this.sortStudentByName(result);
        }
        catch (error) {
            throw new Error("Erro ao buscar alunos");
        }
    }
    async findStudentsByMotherName(name) {
        try {
            const result = await this.database.find({
                selector: {
                    motherName: {
                        $regex: `.*${name.charAt(0).toUpperCase() + name.slice(1)}.*`
                    }
                },
            });
            return this.sortStudentByName(result);
        }
        catch (error) {
            throw new Error("Erro ao buscar alunos");
        }
    }
    async findStudentsInDebt() {
        try {
            const students = new Map;
            const lectureService = new LectureService_1.default();
            const lectures = await lectureService.findLecturesByDebt();
            if (lectures && lectures.length !== 0) {
                for (const lecture of lectures) {
                    const student = await this.findStudentById(lecture.studentId);
                    const debt = students.get(lecture.studentId)?.debtAmount || 0;
                    students.set(lecture.studentId, { student, debtAmount: debt + lecture.lesson.value });
                }
                const result = [];
                students.forEach((value) => result.push(value));
                return result;
            }
            return [];
        }
        catch (error) {
            throw new Error("Erro ao buscar alunos");
        }
    }
    async countStudents() {
        try {
            const { doc_count } = await this.database.info();
            return doc_count;
        }
        catch (error) {
            throw new Error("Erro ao contar alunos");
        }
    }
    async joinWithDebts(result) {
        try {
            const students = [];
            const lectureService = new LectureService_1.default();
            for (const student of result) {
                const lectures = await lectureService.findLecturesByStudentId(student._id);
                const debtAmount = lectures.map((lecture) => lecture.payed ? 0 : lecture.lesson.value).reduce((total, debt) => total + debt);
                students.push({ student, debtAmount });
            }
            return students;
        }
        catch (error) {
            throw new Error("Erro ao buscar alunos");
        }
    }
}
exports.default = StudentService;
