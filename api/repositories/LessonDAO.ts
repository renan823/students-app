import { PrismaClient } from "@prisma/client";
import { ICreateLesson, ILesson } from "../domain/interfaces";

class LessonDAO{

    prisma: PrismaClient;

    constructor(){
        this.prisma = new PrismaClient();
    }

    async create(event: any, data: ICreateLesson) {
        try {
            const result = await this.prisma.lesson.create({ data });
            event.reply("create-lesson-success", result);
        } catch (error: any) {
            event.reply("create-lesson-error", error.message);
        }
    }

    async update(event: any, id: string, newData: object | any){
        try{
            const result: ILesson = await this.prisma.lesson.update({
                where: { id },
                data: newData
            });
            event.reply("update-lesson-success", result);
        }catch(error: any){
            event.reply("update-lesson-error", error.message);
        }
    }
}

export default LessonDAO;