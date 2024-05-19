import dayjs from "dayjs";
import { sendEvent } from "../../../utils/event";
import { v4 as uuidv4 } from "uuid";

export const grades = [{ value: "E.F.", text: "E.F." }, { value: "E.M.", text: "E.M." }];

export const years = Array.from({ length: 9 }, (_, i) => ({ value: `${i+1}°`, text: `${i+1}°` }));

function joinGrades (year: string, type: string) {
    return `${year} Ano ${type}`;
}

export function splitGrades (grade: string) {
    const [gradeYear, gradeType] = grade.split(" Ano ");

    return { gradeType, gradeYear };
}


function createStudentPayload (student: any) {
    Object.entries(student).forEach(([key, value]) => {
        if (!value) {
            student[key] = "";
        }
    })

    let { name, lastName, motherName, bornDate, cpf, observation, gradeYear, gradeType } = student;

    name = name.charAt(0).toUpperCase() + name.slice(1);
    lastName = lastName.charAt(0).toUpperCase() + lastName.slice(1);

    const birthday = dayjs(bornDate).unix();

    const grade = joinGrades(gradeYear, gradeType);

    return { name, lastName, motherName, bornDate: birthday, cpf, grade, observation, phones: [student.phone1, student.phone2], _id: student._id ?? "" };
}


export async function addStudent (student: any) {
    let payload = createStudentPayload(student);
    
    if (student._id) {
        payload._id = student._id;
    } else {
        payload._id = uuidv4();
    }

    try {
        await sendEvent("add-student", payload);
        return true;
    } catch (error) {
        return false;
    }
}

export async function updateStudent (student: any) {
    const data = createStudentPayload(student);

    const payload = {...data, _rev: student._rev}

    try {
        await sendEvent("update-student", payload);
        return true;
    } catch {
        return false;
    }
}