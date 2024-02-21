import { PrismaClient } from "@prisma/client";
import { ICreateLecture, ILecture } from "../domain/interfaces";

class LectureDAO {
  prisma: PrismaClient;

  constructor() {
    this.prisma = new PrismaClient();
  }

  async create(event: any, data: ICreateLecture) {
    try {
      const result = await this.prisma.lecture.create({ data });
      return event.reply("create-lecture-success", result);
    } catch (error: any) {
      return event.reply("create-lecture-error", error.message);
    }
  }

  async update(event: any, id: string, newData: object | any) {
    try {
      const result: ILecture = await this.prisma.lecture.update({
        where: { id },
        data: newData,
      });
      return event.reply("update-lecture-success", result);
    } catch (error: any) {
      return event.reply("update-lecture-error", error.message);
    }
  }

  async findLecturesByWeek(event: any) {
    try {
      const currentDate = new Date();
      const startDate = new Date(currentDate);
      startDate.setDate(startDate.getDate() - (startDate.getDay() + 6) % 7); 
      const endDate = new Date(startDate);
      endDate.setDate(endDate.getDate() + 6); 
  
      const lecturesByDay: Record<string, ILecture[]> = {};
  
      for (let i = 0; i < 7; i++) {
        const currentDate = new Date(startDate);
        currentDate.setDate(currentDate.getDate() + i);
        const lectures: ILecture[] = await this.prisma.lecture.findMany({
          where: {
            lesson: {
              startAt: {
                gte: new Date(currentDate.setHours(0, 0, 0, 0)),
                lte: new Date(currentDate.setHours(23, 59, 59, 999)),
              },
            },
          },
          orderBy: {
            lesson: {
              startAt: "desc"
            } ,
          },
          include: {
            user: true,
            lesson: true,
          },
        });
        lecturesByDay[currentDate.toISOString().split("T")[0]] = lectures;
      }
  
      return event.reply("find-lectures-by-week-success", lecturesByDay);
    } catch (error: any) {
      return event.reply("find-lectures-by-week-error", error.message);
    }
  }

  async findAllLecturesSortedByDate(event: any, skip: number, take: number) {
    try {
      const lectures: ILecture[] = await this.prisma.lecture.findMany({
        orderBy: {
          lesson: {
            startAt: "desc"
          } ,
        },
        include: {
          lesson: true,
          user: true
        },
        skip,
        take,
      });

      return event.reply("find-all-lectures-sorted-by-date-success", lectures);
    } catch (error: any) {
      return event.reply("find-all-lectures-sorted-by-date-error", error.message);
    }
  }

  
  async findLecturesLastTenMonths(event: any): Promise<void> {
    try {
      const currentDate = new Date();

      const currentMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0, 20, 59, 59, 999)
      const tenMonthsAgo = new Date(currentMonth);
      tenMonthsAgo.setMonth(tenMonthsAgo.getMonth() - 10);

      const lectures: ILecture[] = await this.prisma.lecture.findMany({
        where: {
          AND: [
            {
              lesson: {
                startAt: {
                  gte: tenMonthsAgo,
                  lte: currentMonth,
                },
              },
            },
            {
              payed: true
            }
          ]
        },
        include: {
          user: true,
          lesson: true
        }
      });
      
      return event.reply("find-lectures-last-ten-months-success", lectures);
    } catch (error: any) {
      return event.reply(
        "find-lectures-last-ten-months-error",
        error.message
      );
    }
  }

  async findLecturesByStudentName(event: any, studentName: string): Promise<void> {
    try {
      const lectures: ILecture[] = await this.prisma.lecture.findMany({
        where: {
          user: {
            name: {
              contains: studentName
            }
          }
        },
        include: {
          user: true,
          lesson: true
        }
      });

      return event.reply("find-lectures-by-student-name-success", lectures);
    } catch (error: any) {
      return event.reply("find-lectures-by-student-name-error", error.message);
    }
  }
}

export default LectureDAO;
