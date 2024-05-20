import dayjs from "dayjs";
import { sendEvent } from "../../../utils/event";

export async function setPresence (payload) {
    
    const lecture = { ...payload, presence: !payload.presence };

    try {
        await sendEvent("update-lecture", lecture);
        return true;
    } catch (error) {
        return false;
    }
}

export async function setPayed (payload) {

    const lecture = { ...payload, payed: !payload.payed };

    try {
        await sendEvent("update-lecture", lecture);
        return true;
    } catch (error) {
        return false;
    }
}

export async function updateLecture (lecture, lesson, events) {

    lesson.startAt = new Date(lesson.startAt).toISOString();
    lesson.endAt = dayjs(lesson.startAt).add(parseInt(`${lesson.duration}`), "hours").toISOString();
    lesson.value = parseFloat(`${lesson.value}`);

    lecture.lesson = lesson;
    lecture.event = { ...lecture.event, repeat: events };

    try {
        await sendEvent("update-lecture", lecture);
        return true;
    } catch (error) {
        return false;
    }
}