import dayjs, { Dayjs } from "dayjs";
import { sendEvent } from "../../utils/event";

export async function getEvents (week: Dayjs) {
    try {
        const { lectures }: any = await sendEvent("find-lectures-by-week", week.toISOString());

        const events = lectures.map((lecture: any) => {

            const event = {
                start: lecture.lesson.startAt, 
                end: dayjs(lecture.lesson.startAt).add(parseInt(lecture.lesson.duration), "hour").toISOString(),
                title: lecture.student.name,
                color: lecture.payed ? "#593FD8" : "#D81CB3"
            }

            return event;
        });    

        return events;
    } catch (error) {
        return [];
    }
}