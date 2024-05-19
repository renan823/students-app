import PouchDB from "pouchdb";
import { Lecture, Student } from "../interfaces";
import LectureService from "./LectureService";
PouchDB.plugin(require('pouchdb-find'));

class StudentService {

    private readonly database: PouchDB.Database<Student>;
   
    constructor () {
        this.database = new PouchDB<Student>("students");
    };

    private sortStudentByName (students: PouchDB.Find.FindResponse<Student>): PouchDB.Core.ExistingDocument<Student>[] {
        return students.docs.sort((s1: Student, s2: Student) => s1.name.localeCompare(s2.name));
    }

    async addStudent (student: Student) {
        try {
            const result = await this.database.put<Student>(student);

            return result;
        } catch (error: any) {
            throw new Error("Erro ao cadastrar aluno");
        }
    }

    async updateStudent (student: Student) {
        try {
            const doc = await this.database.get<Student>(student._id);
            const result = await this.database.put<Student>({
                _rev: doc._rev,
                ...student
            });

            return result;
        } catch (error: any) {
            throw new Error("Erro ao atualizar dados do aluno");
        }
    }

    async findStudentById (id: string) {
        try {
            const student: Student = await this.database.get<Student>(id);

            return student;
        } catch (error: any) {
            throw new Error("Erro ao buscar aluno");
        }
    }

    async findAllStudents (currentPage: number, perPage: number) {
        try {
            const skip = (currentPage -1) * perPage;

            const students: PouchDB.Find.FindResponse<Student> = await this.database.find({
                selector: {
                    _id: undefined
                },
                skip,
                limit: perPage,
            });

            return this.sortStudentByName(students);
        } catch (error: any) {
            throw new Error("Erro ao buscar alunos");
        }
    }

    async findStudentsByName (name: string) {
        try {
            const result: PouchDB.Find.FindResponse<Student> = await this.database.find({
                selector: {
                    name: {
                        $regex: `.*${name.charAt(0).toUpperCase() + name.slice(1)}.*`
                    }
                },
            });

            return this.sortStudentByName(result); 
        } catch (error: any) {
            throw new Error("Erro ao buscar alunos");
        }
    }

    async findStudentsByMotherName (name: string) {
        try {
            const result: PouchDB.Find.FindResponse<Student> = await this.database.find({
                selector: {
                    motherName: {
                        $regex: `.*${name.charAt(0).toUpperCase() + name.slice(1)}.*`
                    }
                },
            });

            return this.sortStudentByName(result); 
        } catch (error: any) {
            throw new Error("Erro ao buscar alunos");
        }
    }

    async findStudentsInDebt () {
        try {
            const students = new Map<string, { student: Student, debtAmount: number }>;
            const lectureService = new LectureService();

            const lectures = await lectureService.findLecturesByDebt();

            if (lectures && lectures.length !== 0) {
                for (const lecture of lectures) {
                    const student = await this.findStudentById(lecture.studentId);

                    const debt = students.get(lecture.studentId)?.debtAmount || 0;

                    students.set(lecture.studentId, { student, debtAmount: debt + lecture.lesson.value });
                }

                const result: { student: Student, debtAmount: number }[] = [];
                students.forEach((value) => result.push(value));

                return result;
            }

            return [];
        } catch (error: any) {
            throw new Error("Erro ao buscar alunos");
        }
    }

    async countStudents () {
        try {
            const { doc_count } = await this.database.info();

            return doc_count;
        } catch (error: any) {
            throw new Error("Erro ao contar alunos");
        }
    }

    async joinWithDebts (result: PouchDB.Core.ExistingDocument<Student>[]) {
        try {
            const students: { student: Student, debtAmount: number }[] = [];
            const lectureService = new LectureService();

            for (const student of result) {
                const lectures = await lectureService.findLecturesByStudentId(student._id);

                let debtAmount = 0;

                if (lectures.length !== 0) {
                    debtAmount = lectures.map((lecture: Lecture) => lecture.payed ? 0 : lecture.lesson.value).reduce((total, debt) => total + debt);
                }

                students.push({ student, debtAmount });
            }

            return students;
        } catch (error: any) {
            throw new Error("Erro ao buscar alunos");
        }
    }
}

export default StudentService;