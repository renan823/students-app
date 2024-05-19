import { IpcMainEvent } from "electron";
import { Student } from "../interfaces";
import StudentService from "../services/StudentService";

class StudentController {

    constructor () {};

    async addStudent (event: IpcMainEvent, student: Student) {
        try {
            const studentService = new StudentService();

            const createdStudent = await studentService.addStudent(student);

            return event.reply("add-student-success", { student: createdStudent });
        } catch (error: any) {
            return event.reply("add-student-error", { message: error.message || "Algo deu errado" });
        }
    }

    async updateStudent (event: IpcMainEvent, student: Student) {
        try {
            const studentService = new StudentService();

            const updatedStudent = await studentService.updateStudent(student);

            return event.reply("add-student-success", { student: updatedStudent });
        } catch (error: any) {
            return event.reply("add-student-error", { message: error.message || "Algo deu errado" });
        }
    }

    async findAllStudents (event: IpcMainEvent, currentPage: number, perPage: number) {
        try {
            const studentService = new StudentService();

            const result = await studentService.findAllStudents(currentPage, perPage);

            const students = await studentService.joinWithDebts(result);

            return event.reply("find-all-students-success", { students });
        } catch (error: any) {
            return event.reply("find-all-students-error", { message: error.message || "Algo deu errado" });
        }
    }

    async findStudenstByName (event: IpcMainEvent, name: string) {
        try {
            const studentService = new StudentService();

            const result = await studentService.findStudentsByName(name);

            const students = await studentService.joinWithDebts(result);

            return event.reply("find-students-by-name-success", { students });
        } catch (error: any) {
            return event.reply("find-students-by-name-error", { message: error.message || "Algo deu errado" });
        }
    }

    async findStudenstByMotherName (event: IpcMainEvent, name: string) {
        try {
            const studentService = new StudentService();

            const result = await studentService.findStudentsByMotherName(name);

            const students = await studentService.joinWithDebts(result);

            return event.reply("find-students-by-mothername-success", { students });
        } catch (error: any) {
            return event.reply("find-students-by-mothername-error", { message: error.message || "Algo deu errado" });
        }
    }

    async findStudentsInDebt (event: IpcMainEvent) {
        try {
            const studentService = new StudentService();

            const students = await studentService.findStudentsInDebt();

            return event.reply("find-students-in-debt-success", { students });
        } catch (error: any) {
            return event.reply("find-students-in-debt-error", { message: error.message || "Algo deu errado" });
        }
    }

    async countStudents (event: IpcMainEvent) {
        try {
            const studentService = new StudentService();

            const students = await studentService.countStudents();

            return event.reply("count-students-success", { total: students });
        } catch (error: any) {
            return event.reply("count-students-error", { message: error.message || "Algo deu errado" });
        }
    }
}

export default StudentController;