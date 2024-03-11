import PouchDB from "pouchdb";
PouchDB.plugin(require('pouchdb-find'));

import { StudentInterface } from "../interfaces";
import { IpcMainEvent } from "electron";

import LectureDAO from "./LectureDAO";

class StudentDAO {

    database: PouchDB.Database;

    constructor () {
        this.database = new PouchDB("students");
    }

    async create (event: IpcMainEvent, student: StudentInterface) {
        this.database = new PouchDB("students");
        try {
            const result = await this.database.put(student);
            return event.reply("add-student-success", result);
        } catch (error: any) {
            return event.reply("add-student-error", error.message);
        }
    }

    async update (event: IpcMainEvent, student: StudentInterface) {
        this.database = new PouchDB("students");
        try {
            const doc = await this.database.get(student._id);
            const result = await this.database.put({
                _rev: doc._rev,
                ...student
            });

            return event.reply("update-student-success", result);
        } catch (error: any) {
            return event.reply("update-student-error", error.message);
        }
    }

    async findAll (event: IpcMainEvent, currentPage: number, perPage: number) {
        this.database = new PouchDB("students");
        try {
            let skip = (currentPage -1) * perPage;
            let result = await this.database.find({
                selector: {
                    _id: undefined
                },
                skip,
                limit: perPage,
            });

            result.docs.sort((a: any, b: any): any => a.name.localeCompare(b.name));

            let students: any[] = [];

            let dao = new LectureDAO();

            for (const doc of result.docs) {
                let student: any = doc;
                let debtAmount = 0;

                const lectures: any = await dao.findLectureByStudentId(student._id);

                if (lectures) {
                    lectures.map((lecture: any) => { debtAmount += lecture.lesson.value });

                    students.push({ student, debtAmount });
                }
            }

            return event.reply("find-all-students-success", { students });
        } catch (error: any) {
            return event.reply("find-all-students-error", error.message);
        }
    }

    async findStudentsByName (event: IpcMainEvent, name: string) {
        this.database = new PouchDB("students");
        try {
            let result = await this.database.find({
                selector: {
                    name: {
                        $regex: `.*${name.charAt(0).toUpperCase() + name.slice(1)}.*`
                    }
                },
            });

            result.docs.sort((a: any, b: any): any => a.name.localeCompare(b.name));

            let students: any[] = [];

            let dao = new LectureDAO();

            for (const row of result.docs) {
                let student: any = row;
                let debtAmount = 0;

                const lectures = await dao.findLectureByStudentId(student._id);

                if (lectures) {
                    lectures.map((lecture: any) => { debtAmount += lecture.lesson.value });

                    students.push({ student, debtAmount });
                }
            }

            return event.reply("find-students-by-name-success", students);
        } catch (error: any) {
            return event.reply("find-students-by-name-error", error.message);
        }
    }

    async findStudentsByMotherName (event: IpcMainEvent, name: string) {
        this.database = new PouchDB("students");
        try {
            let result = await this.database.find({
                selector: {
                    motherName: {
                        $regex: `.*${name.charAt(0).toUpperCase() + name.slice(1)}.*`
                    }
                },
            });

            result.docs.sort((a: any, b: any): any => a.name.localeCompare(b.name));

            let students: any[] = [];

            let dao = new LectureDAO();

            for (const row of result.docs) {
                let student: any = row;
                let debtAmount = 0;

                const lectures = await dao.findLectureByStudentId(student._id);

                if (lectures) {
                    lectures.map((lecture: any) => { debtAmount += lecture.lesson.value });

                    students.push({ student, debtAmount });
                }
            }

            return event.reply("find-students-by-mothername-success", students);
        } catch (error: any) {
            return event.reply("find-students-by-mothername-error", error.message);
        }
    }

    async findByNameForLectures (event: IpcMainEvent, name: string) {
        this.database = new PouchDB("students");
        try {
            let result = await this.database.find({
                selector: {
                    name: {
                        $regex: `.*${name.charAt(0).toUpperCase() + name.slice(1)}.*`
                    }
                },
            });

            result.docs.sort((a: any, b: any): any => a.name.localeCompare(b.name));

            return event.reply("find-students-by-name-for-lectures-success", result.docs);
        } catch (error: any) {
            return event.reply("find-students-by-name-for-lectures-error", error.message);
        }
    }

    async countStudents (event: IpcMainEvent) {
        this.database = new PouchDB("students");
        try {
            const { doc_count } = await this.database.info();
            let total = doc_count;

            return event.reply("count-students-success", total);
        } catch (error: any) {
            return event.reply("count-students-error", error.message);
        }
    }

    async findStudentById (id: string) {
        this.database = new PouchDB("students");
        try {
            const student = await this.database.get(id);
            return student;
        } catch (error) {
            return null;
        }
    }
}

export default StudentDAO;