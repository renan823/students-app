import { v4 as uuidv4 } from "uuid";
import { sendEvent } from "../../../utils/event";
import dayjs from "dayjs";

export async function addLecture (lesson, student, events: boolean[]) {

    lesson.startAt = dayjs(lesson.startAt).toISOString();
    lesson.endAt = dayjs(lesson.startAt).add(parseInt(`${lesson.duration}`), "hours").toISOString();
    lesson.value = parseInt(`${lesson.value}`);
    lesson._id = uuidv4();

    const lecture = { 
        studentId: student._id, 
        lesson, 
        payed: false, 
        presence: false, 
        _id: uuidv4(), 
        event: { 
            repeat: events, 
            _id: uuidv4(), 
            initialDate: lesson.startAt
        },
        fromEvent: false
    };

    try {
        await sendEvent("add-lecture", lecture);
        return true;
    } catch (error) {
        return false;
    }
}