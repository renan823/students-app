"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
class UserDAO {
    prisma;
    constructor() {
        this.prisma = new client_1.PrismaClient();
    }
    async create(event, data) {
        try {
            const result = await this.prisma.user.create({ data });
            return event.reply("create-user-success", result);
        }
        catch (error) {
            return event.reply("create-user-error", error.message);
        }
    }
    async update(event, cpf, newData) {
        try {
            const result = await this.prisma.user.update({
                where: { cpf },
                data: newData,
            });
            return event.reply("update-user-success", result);
        }
        catch (error) {
            return event.reply("update-user-error", error.message);
        }
    }
    async createManyPhones(event, phoneDataList) {
        try {
            const createdPhones = [];
            for (const phoneData of phoneDataList) {
                const createdPhone = await this.prisma.phone.create({
                    data: phoneData,
                });
                createdPhones.push(createdPhone);
            }
            return event.reply("create-many-phones-success", createdPhones);
        }
        catch (error) {
            return event.reply("create-many-phones-error", error.message);
        }
    }
    async updateManyPhones(event, phoneDataList) {
        try {
            const updatedPhones = [];
            for (const phoneData of phoneDataList) {
                const updatedPhone = await this.prisma.phone.update({
                    where: { id: phoneData.id },
                    data: phoneData,
                });
                updatedPhones.push(updatedPhone);
            }
            return event.reply("update-many-phones-success", updatedPhones);
        }
        catch (error) {
            return event.reply("update-many-phones-error", error.message);
        }
    }
    async findUserByName(event, name) {
        try {
            const students = await this.prisma.user.findMany({
                where: { name: { contains: name } },
                orderBy: { name: "asc" }
            });
            const studentsWithPhonesAndDebt = [];
            for (const student of students) {
                const phones = await this.prisma.phone.findMany({
                    where: { user_cpf: student.cpf },
                });
                const unpaidLectures = await this.prisma.lecture.findMany({
                    where: { user_cpf: student.cpf, payed: false },
                    include: { lesson: true },
                });
                let debtAmount = 0;
                for (const lecture of unpaidLectures) {
                    const lesson = await this.prisma.lesson.findUnique({
                        where: { id: lecture.lesson_id },
                    });
                    if (lesson) {
                        debtAmount += lesson.value;
                    }
                }
                studentsWithPhonesAndDebt.push({
                    student,
                    phones,
                    debtAmount,
                });
            }
            return event.reply("find-users-by-name-success", studentsWithPhonesAndDebt);
        }
        catch (error) {
            return event.reply("find-users-by-name-error", error.message);
        }
    }
    async findUserByMotherName(event, motherName) {
        try {
            const students = await this.prisma.user.findMany({
                where: { motherName: { contains: motherName } },
                orderBy: { name: "asc" }
            });
            const studentsWithPhonesAndDebt = [];
            for (const student of students) {
                const phones = await this.prisma.phone.findMany({
                    where: { user_cpf: student.cpf },
                });
                const unpaidLectures = await this.prisma.lecture.findMany({
                    where: { user_cpf: student.cpf, payed: false },
                    include: { lesson: true },
                });
                let debtAmount = 0;
                for (const lecture of unpaidLectures) {
                    const lesson = await this.prisma.lesson.findUnique({
                        where: { id: lecture.lesson_id },
                    });
                    if (lesson) {
                        debtAmount += lesson.value;
                    }
                }
                studentsWithPhonesAndDebt.push({
                    student,
                    phones,
                    debtAmount,
                });
            }
            return event.reply("find-users-by-mother-name-success", studentsWithPhonesAndDebt);
        }
        catch (error) {
            return event.reply("find-users-by-mother-name-error", error.message);
        }
    }
    async findAllStudentsWithPhonesAndDebt(event) {
        try {
            const students = await this.prisma.user.findMany({ orderBy: { name: "asc" } });
            const studentsWithPhonesAndDebt = [];
            for (const student of students) {
                const phones = await this.prisma.phone.findMany({
                    where: { user_cpf: student.cpf },
                });
                const unpaidLectures = await this.prisma.lecture.findMany({
                    where: { user_cpf: student.cpf, payed: false },
                    include: { lesson: true },
                });
                let debtAmount = 0;
                for (const lecture of unpaidLectures) {
                    const lesson = await this.prisma.lesson.findUnique({
                        where: { id: lecture.lesson_id },
                    });
                    if (lesson) {
                        debtAmount += lesson.value;
                    }
                }
                studentsWithPhonesAndDebt.push({
                    student,
                    phones,
                    debtAmount,
                });
            }
            return event.reply("find-all-students-with-phones-and-debt-success", studentsWithPhonesAndDebt);
        }
        catch (error) {
            return event.reply("find-all-students-with-phones-and-debt-error", error.message);
        }
    }
}
exports.default = UserDAO;
