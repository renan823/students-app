import { PrismaClient } from "@prisma/client";
import {
  ICreatePhone,
  ICreateStudent,
  IPhone,
  IStudent,
  ILecture,
  IStudentWithPhonesAndDebt
} from "../domain/interfaces";

class UserDAO {
  prisma: PrismaClient;

  constructor() {
    this.prisma = new PrismaClient();
  }

  async create(event: any, data: ICreateStudent) {
    try {
      const result = await this.prisma.user.create({ data });
      return event.reply("create-user-success", result);
    } catch (error: any) {
      return event.reply("create-user-error", error.message);
    }
  }

  async update(event: any, cpf: string, newData: object | any) {
    try {
      const result: IStudent = await this.prisma.user.update({
        where: { cpf },
        data: newData,
      });
      return event.reply("update-user-success", result);
    } catch (error: any) {
      return event.reply("update-user-error", error.message);
    }
  }

  async createManyPhones(event: any, phoneDataList: ICreatePhone[]) {
    try {
        const createdPhones: IPhone[] = [];
        for (const phoneData of phoneDataList) {
            const createdPhone: IPhone = await this.prisma.phone.create({
                data: phoneData,
            });
            createdPhones.push(createdPhone);
        }
        return event.reply("create-many-phones-success", createdPhones);
    } catch (error: any) {
        return event.reply("create-many-phones-error", error.message);
    }
  }

  async updateManyPhones(event: any, phoneDataList: IPhone[]) {
    try {
        const updatedPhones: IPhone[] = [];
        for (const phoneData of phoneDataList) {
            const updatedPhone: IPhone = await this.prisma.phone.update({
                where: { id: phoneData.id },
                data: phoneData,
            });
            updatedPhones.push(updatedPhone);
        }
        return event.reply("update-many-phones-success", updatedPhones);
    } catch (error: any) {
        return event.reply("update-many-phones-error", error.message);
    }
  }

  async findUserByName(event: any, name: string) {
    try {
      const students: IStudent[] = await this.prisma.user.findMany({
        where: { name: { contains: name } },
        orderBy: { name: "asc" }
      });

      const studentsWithPhonesAndDebt: IStudentWithPhonesAndDebt[] = [];

      for (const student of students) {
        const phones: IPhone[] = await this.prisma.phone.findMany({
          where: { user_cpf: student.cpf },
        });

        const unpaidLectures: ILecture[] = await this.prisma.lecture.findMany({
          where: { user_cpf: student.cpf, payed: false },
            include: { lesson: true },
        });

        let debtAmount: number = 0;

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
    } catch (error: any) {
      return event.reply("find-users-by-name-error", error.message);
    }
  }

  async findUserByMotherName(event: any, motherName: string) {
    try {
      const students: IStudent[] = await this.prisma.user.findMany({
        where: { motherName: { contains: motherName } },
        orderBy: { name: "asc" }
      });

      const studentsWithPhonesAndDebt: IStudentWithPhonesAndDebt[] = [];

      for (const student of students) {
        const phones: IPhone[] = await this.prisma.phone.findMany({
          where: { user_cpf: student.cpf },
        });

        const unpaidLectures: ILecture[] = await this.prisma.lecture.findMany({
          where: { user_cpf: student.cpf, payed: false },
          include: { lesson: true },
        });

        let debtAmount: number = 0;

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
    } catch (error: any) {
      return event.reply("find-users-by-mother-name-error", error.message);
    }
  }

  async findAllStudentsWithPhonesAndDebt(event: any) {
    try {
        const students: IStudent[] = await this.prisma.user.findMany({orderBy: { name: "asc" }});
        const studentsWithPhonesAndDebt: IStudentWithPhonesAndDebt[] = [];

        for (const student of students) {
            const phones: IPhone[] = await this.prisma.phone.findMany({
                where: { user_cpf: student.cpf },
                
            });

            const unpaidLectures: ILecture[] = await this.prisma.lecture.findMany({
                where: { user_cpf: student.cpf, payed: false },
                include: { lesson: true },
            });

            let debtAmount: number = 0;

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
    } catch (error: any) {
        return event.reply("find-all-students-with-phones-and-debt-error", error.message);
    }
  }
}

export default UserDAO;
