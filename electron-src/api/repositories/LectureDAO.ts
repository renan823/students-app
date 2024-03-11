import PouchDB from "pouchdb";
PouchDB.plugin(require('pouchdb-find'));

import { LectureInterface } from "../interfaces";
import dayjs from "dayjs";
import { IpcMainEvent } from "electron";
import StudentDAO from "./StudentDAO";

class LectureDAO {

    database: PouchDB.Database;

    constructor () {
        this.database = new PouchDB("lectures");
    }

    async create (event: IpcMainEvent, lecture: LectureInterface) {
        this.database = new PouchDB("lectures");
        try {
            const result = await this.database.put(lecture);
            return event.reply("add-lecture-success", result);
        } catch (error: any) {
            return event.reply("add-lecture-error", error.message);
        }
    }

    async update (event: IpcMainEvent, lecture: LectureInterface) {
        this.database = new PouchDB("lectures");
        try {
            const doc = await this.database.get(lecture._id);
            const result = await this.database.put({
                _rev: doc._rev,
                ...lecture
            })
            return event.reply("update-lecture-success", result);
        } catch (error: any) {
            return event.reply("update-lecture-error", error.message);
        }
    }

    async findAll (event: IpcMainEvent, currentPage: number, perPage: number) {
        this.database = new PouchDB("lectures");
        try {
            let skip = (currentPage -1) * perPage;

            let result = await this.database.find({
                selector: {
                    _id: undefined
                },
                skip,
                limit: perPage,
            });

            result.docs.sort((a: any, b: any): any => dayjs(b.lesson.startAt).unix() - dayjs(a.lesson.startAt).unix());

            let lectures: any[] = [];

            const dao = new StudentDAO();

            for (const doc of result.docs) {
                let lecture: any = doc;

                const student = await dao.findStudentById(lecture.studentId);

                if (student) {
                    lectures.push({...lecture, student});
                }
            }
            
            let debt = await this.database.find({
                selector: {
                    payed: false
                }
            })

            return event.reply("find-all-lectures-success", { lectures, debt: debt.docs.length });
        } catch (error: any) {
            console.log(error)
            return event.reply("find-all-lectures-error", error.message);
        }
    }

    async findLecturesByWeek (event: IpcMainEvent, day: string) {
        this.database = new PouchDB("lectures");
        try {
            const sunday = dayjs(day).startOf("week").startOf("day");
            const saturday = dayjs(sunday).endOf("week").endOf("day");

            const result =  await this.database.find({
                selector: { 
                    lesson: {
                        startAt: {
                            $gte: sunday.toISOString(),
                            $lte: saturday.toISOString()
                        }
                    }
                },
            })

            const dao = new StudentDAO();

            let lectures: any[] = [];

            for (const doc of result.docs) {
                let lecture: any = doc;

                const student = await dao.findStudentById(lecture.studentId);

                if (student) {
                    lectures.push({...lecture, student});
                }
            }

            return event.reply("lectures-by-week-success", lectures);
        } catch (error: any) {
            return event.reply("lectures-by-week-error", error.message);
        }
    }

    async findLecturesByMonthsAgo (event: IpcMainEvent, months: number) {
        this.database = new PouchDB("lectures");
        try {
            const currentMonth = dayjs().endOf("month").endOf("day");
            const monthsAgo = dayjs().startOf("month").startOf("day").set("month", -months);

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
            })

            const dao = new StudentDAO();

            let lectures: any[] = [];

            for (const doc of result.docs) {
                let lecture: any = doc;

                let student = await dao.findStudentById(lecture.studentId);

                if (student) {
                    lectures.push({...lecture, student});
                }
            }

            return event.reply("lectures-months-ago-success", lectures);
        } catch (error: any) {
            return event.reply("lectures-months-ago-error", error.message);
        }
    }
    
    async findLecturesByStudentName (event: IpcMainEvent, name: string) {
        this.database = new PouchDB("lectures");
        try {
            const students = new PouchDB("students");

            let result = await students.find({
                selector: {
                    name: {
                        $regex: `.*${name.charAt(0).toUpperCase() + name.slice(1)}.*`
                    }
                }
            })

            result.docs.sort((a: any, b: any): any => dayjs(b.lesson.startAt).unix() - dayjs(a.lesson.startAt).unix());

            const lectures: any[] = [];

            for (const doc of result.docs) {
                let student: any = doc
                let results = await this.database.find({
                    selector: {
                        studentCpf: {
                            $eq: student.cpf
                        }
                    }
                })

                for (const lecture of results.docs) {
                    lectures.push({ ...lecture, student: { name: student.name } });
                }
            }

            return event.reply("find-lectures-by-student-name-success", lectures);
        } catch (error: any) {
            return event.reply("find-lectures-by-student-name-error", error.message);
        }
    }

    async sumPaymentsByDay (event: IpcMainEvent, day: any) {
        this.database = new PouchDB("lectures");
        try {
            const startOfDay = dayjs(day).startOf("day");
            const endOfDay = dayjs(day).endOf("day");

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
            })

            console.log(result.docs)

            let total = 0;
            result.docs.forEach((doc: any) => {
                total+= doc.lesson.value;
            })

            return event.reply("sum-lectures-by-day-success", total);
        } catch (error: any) {
            return event.reply("sum-lectures-by-day-error", error.message);
        }
    }

    async countLectures (event: IpcMainEvent) {
        this.database = new PouchDB("lectures");
        try {
            const { doc_count } = await this.database.info();
            let total = doc_count;

            return event.reply("count-lectures-success", total);
        } catch (error: any) {
            return event.reply("count-lectures-error", error.message);
        }
    }

    async findLectureByStudentId (id: string) {
        this.database = new PouchDB("lectures");
        try {
            const lectures = await this.database.find({
                selector: {
                    $and: [
                        { studentId: id },
                        { payed: false }
                    ]
                }
            })
    
            return lectures.docs;
        } catch (error) {
            return null;
        }
    }
}

export default LectureDAO;