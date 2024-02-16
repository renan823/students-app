import { sendEvent } from "../../../../utils/api";

export async function setPresence (lecture ) {
    lecture.presence = !lecture.presence;

    try {
        await sendEvent("update-lecture", lecture.id, lecture);
        return true;
    } catch (error) {
        return false;
    }
}

export async function setPayed (lecture) {
    lecture.payed = !lecture.payed;

    try {
        await sendEvent("update-lecture", lecture.id, lecture);
        return true;
    } catch (error) {
        return false;
    }
}

export function updateLecture (lecture, lesson) {
    lesson.startAt = new Date(lesson.startAt).toISOString();
    lesson.endAt = new Date(lesson.endAt).toISOString();
    

}