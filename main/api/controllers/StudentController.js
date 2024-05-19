"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const StudentService_1 = __importDefault(require("../services/StudentService"));
class StudentController {
    constructor() { }
    ;
    async addStudent(event, student) {
        try {
            const studentService = new StudentService_1.default();
            const createdStudent = await studentService.addStudent(student);
            return event.reply("add-student-success", { student: createdStudent });
        }
        catch (error) {
            return event.reply("add-student-error", { message: error.message || "Algo deu errado" });
        }
    }
    async updateStudent(event, student) {
        try {
            const studentService = new StudentService_1.default();
            const updatedStudent = await studentService.updateStudent(student);
            return event.reply("update-student-success", { student: updatedStudent });
        }
        catch (error) {
            return event.reply("update-student-error", { message: error.message || "Algo deu errado" });
        }
    }
    async findAllStudents(event, currentPage, perPage) {
        try {
            const studentService = new StudentService_1.default();
            const result = await studentService.findAllStudents(currentPage, perPage);
            const students = await studentService.joinWithDebts(result);
            return event.reply("find-all-students-success", { students });
        }
        catch (error) {
            return event.reply("find-all-students-error", { message: error.message || "Algo deu errado" });
        }
    }
    async findStudentsByName(event, name) {
        try {
            const studentService = new StudentService_1.default();
            const result = await studentService.findStudentsByName(name);
            const students = await studentService.joinWithDebts(result);
            return event.reply("find-students-by-name-success", { students });
        }
        catch (error) {
            return event.reply("find-students-by-name-error", { message: error.message || "Algo deu errado" });
        }
    }
    async findStudentsByMotherName(event, name) {
        try {
            const studentService = new StudentService_1.default();
            const result = await studentService.findStudentsByMotherName(name);
            const students = await studentService.joinWithDebts(result);
            return event.reply("find-students-by-mothername-success", { students });
        }
        catch (error) {
            return event.reply("find-students-by-mothername-error", { message: error.message || "Algo deu errado" });
        }
    }
    async findStudentsInDebt(event) {
        try {
            const studentService = new StudentService_1.default();
            const students = await studentService.findStudentsInDebt();
            return event.reply("find-students-in-debt-success", { students });
        }
        catch (error) {
            return event.reply("find-students-in-debt-error", { message: error.message || "Algo deu errado" });
        }
    }
    async countStudents(event) {
        try {
            const studentService = new StudentService_1.default();
            const students = await studentService.countStudents();
            return event.reply("count-students-success", { total: students });
        }
        catch (error) {
            return event.reply("count-students-error", { message: error.message || "Algo deu errado" });
        }
    }
}
exports.default = StudentController;
