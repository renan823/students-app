import PouchDB from "pouchdb";
import { Student } from "../interfaces";
PouchDB.plugin(require('pouchdb-find'));

class StudentService {

    private database: PouchDB.Database;

    constructor () {
        this.database = new PouchDB("students");
    };

    private sortStudentByName (students: PouchDB.Find.FindResponse<{}>) {
        return students.docs.sort((a: any, b: any): any => a.name.localeCompare(b.name));
    }

    async addStudent (student: Student) {
        try {
            const result = await this.database.put(student);

            return result;
        } catch (error: any) {
            throw new Error("Erro ao cadastrar aluno");
        }
    }

    async updateStudent (student: Student) {
        try {
            const doc = await this.database.get(student._id);
            const result = await this.database.put({
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
            const student = await this.database.get(id);

            return student;
        } catch (error: any) {
            throw new Error("Erro ao buscar aluno");
        }
    }

    async findAllStudents (currentPage: number, perPage: number) {
        try {
            const skip = (currentPage -1) * perPage;

            const result = await this.database.find({
                selector: {
                    _id: undefined
                },
                skip,
                limit: perPage,
            });

            return this.sortStudentByName(result);
        } catch (error: any) {
            throw new Error("Erro ao buscar alunos");
        }
    }

    async findStudentByName (name: string) {
        try {
            const result = await this.database.find({
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
            const result = await this.database.find({
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
}

export default StudentService;