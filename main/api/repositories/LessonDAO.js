"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
class LessonDAO {
    prisma;
    constructor() {
        this.prisma = new client_1.PrismaClient();
    }
    async create(event, data) {
        try {
            const result = await this.prisma.lesson.create({ data });
            event.reply("create-lesson-success", result);
        }
        catch (error) {
            event.reply("create-lesson-error", error.message);
        }
    }
    async update(event, id, newData) {
        try {
            const result = await this.prisma.lesson.update({
                where: { id },
                data: newData
            });
            event.reply("update-lesson-success", result);
        }
        catch (error) {
            event.reply("update-lesson-error", error.message);
        }
    }
}
exports.default = LessonDAO;
