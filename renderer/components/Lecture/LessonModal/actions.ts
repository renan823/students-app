import { v4 as uuidv4 } from "uuid";
import { sendEvent } from "../../../utils/event";
import dayjs from "dayjs";

export async function addLecture (lesson, student) {

    lesson.startAt = dayjs(lesson.startAt).toISOString();
    lesson.endAt = dayjs(lesson.endAt).toISOString();
    lesson.value = parseInt(`${lesson.value}`);

    const lecture = { studentId: student._id, lesson, payed: false, presence: false, _id: uuidv4() };

    try {
        await sendEvent("add-lecture", lecture);
        return true;
    } catch (error) {
        return false;
    }
}