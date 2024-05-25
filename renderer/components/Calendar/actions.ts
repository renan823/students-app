import dayjs, { Dayjs } from "dayjs";
import { sendEvent } from "../../utils/event";

export async function getEvents (week: Dayjs) {
    try {
        const data: any = await sendEvent("find-lectures-by-week", week.toISOString());

        const events = data.lectures.map(({ lecture, student }) => {
            const event = {
                start: lecture.lesson.startAt, 
                end: lecture.lesson.endAt,
                title: student.name,
                color: lecture.payed ? "#593FD8" : "#D81CB3"
            }

            if (dayjs().endOf("week").isBefore(dayjs(event.start))) {
                event.color = "#593FD8";
            }

            return event;
        });    

        return events;
    } catch (error) {
        return [];
    }
}