import { sendEvent } from "../../../../utils/api";
import { Lesson, User } from "../../../intefaces";

export async function addLesson (lesson: Lesson, student: User) {
    const user_cpf = student.cpf;

    lesson.startAt = new Date(lesson.startAt).toISOString();
    lesson.endAt = new Date(lesson.endAt).toISOString();

    try {
        const result: any = await sendEvent("create-lesson", lesson);
        if (result) {
            const lecture = { user_cpf, lesson_id: result.id, payed: false, presence: false };
            await sendEvent("create-lecture", lecture);

            return true;
        }
    } catch (error) {
        return false;
    }
}

/**
 
const handleEditLecture = async (data, setLessons, setLectures) => {
    let { newLesson, newLecture } = data;

    newLesson.startAt = new Date(newLesson.startAt).toISOString();
    newLesson.endAt = new Date(newLesson.endAt).toISOString();

    try {
        await sendEvent("update-lesson", newLesson.id, newLesson);
        try {
            await sendEvent("update-lecture", newLecture.id, newLecture);
            toast.success("Dados alterados");
            fetchData(null, null, setLessons, setLectures);
        } catch (error) {
            toast.error("Algo deu errado");
        }
    } catch (error) {
        toast.error("Algo deu errado");
    }
}
 */