import { sendEvent } from "../../../../utils/api";

export async function setPresence (payload) {
    
    let { id, lesson_id, user_cpf, presence, payed } = payload;

    const lecture = { id, lesson_id, user_cpf, presence: !presence, payed };

    try {
        await sendEvent("update-lecture", lecture.id, lecture);
        return true;
    } catch (error) {
        return false;
    }
}

export async function setPayed (payload) {
    
    let { id, lesson_id, user_cpf, presence, payed } = payload;

    const lecture = { id, lesson_id, user_cpf, presence, payed: !payed };

    try {
        await sendEvent("update-lecture", lecture.id, lecture);
        return true;
    } catch (error) {
        return false;
    }
}

export async function updateLecture (lecture, lesson) {
    lesson.startAt = new Date(lesson.startAt).toISOString();
    lesson.endAt = new Date(lesson.endAt).toISOString();

    try {
        await sendEvent("update-lesson", lesson.id, lesson);

        try {
            await sendEvent("update-lecture", lecture.id, lecture);

            return true;
        } catch (error) {
            return false;
        }
    } catch (error) {
        console.log(error)
        return false;
    }
}