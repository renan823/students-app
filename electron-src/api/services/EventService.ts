import PouchDB from "pouchdb";
import dayjs, { Dayjs } from "dayjs";
import { Event, Lecture } from "../interfaces";
import LectureService from "./LectureService";
import { v4 as uuidv4 } from "uuid";
PouchDB.plugin(require('pouchdb-find'));

class EventService {

    private readonly database: PouchDB.Database<Event>;

    constructor () {
        this.database = new PouchDB<Event>("events");
    };

    async addEvent (event: Event) {
        try {
            const result = await this.database.put<Event>(event);

            return result;
        } catch {
            throw new Error("Erro ao criar evento");
        }
    }

    async updateEvent (event: Event) {
        try {
            const eventExists = await this.findEventById(event._id);

            if (eventExists) {
                if (event.repeat.includes(true)) {
                    this.database.put({
                        _rev: eventExists._rev,
                        ...event
                    })
                } else {
                    //remove event if repeat is false 
                    await this.database.remove({ 
                        _id: eventExists._id,
                        _rev: eventExists._id
                    })
                }
            }
        } catch {
            throw new Error("Erro ao criar evento");
        }
    }

    async findAllEvents () {
        try {
            const events = await this.database.find({
                selector: {
                    _id: undefined
                },
            })

            return events;
        } catch {
            throw new Error("Erro ao buscar eventos");
        }
    }

    async findEventById (id: string) {
        try {
            const event = await this.database.get<Event>(id);

            return event;
        } catch {
            throw new Error("Erro ao buscar evento");
        }
    }


    findNextDates (event: Event, weekStart: Dayjs) {
        try {
            const days = event.repeat.map((repeat: boolean, index: number) => {
                if (repeat) {
                    return dayjs(weekStart).add(index, "d");
                }
            })

            return days;
        } catch (error: any) {
            throw new Error("Erro ao buscar evento");
        }
    }

    async createLecturesFromEvent (event: Event, date: string) {
        try {
            const lectureService = new LectureService();
            const lastLecture = (await lectureService.findLecturesByEventId(event._id))[0];

            const weekStart = dayjs(date).startOf("week");

            const newDays = this.findNextDates(event, weekStart);

            const lectures: (Lecture | null)[] = newDays.map(day => {
                if (day && lastLecture.event) {

                    const duration = dayjs(lastLecture.lesson.endAt).diff(dayjs(lastLecture.lesson.startAt), "h");

                    const startAt = dayjs(day).set("h", dayjs(lastLecture.lesson.startAt).hour()).set("minute", dayjs(lastLecture.lesson.startAt).minute());

                    return {
                        _id: uuidv4(),
                        payed: lastLecture.payed,
                        presence: lastLecture.presence,
                        studentId: lastLecture.studentId,
                        event: {
                            ...lastLecture.event,
                        },
                        lesson: { 
                            startAt: startAt.toISOString(),
                            endAt: dayjs(startAt).add(duration, "h").toISOString(),
                            value: lastLecture.lesson.value 
                        },
                        fromEvent: true
                    }
                }

                return null;
            })

            return lectures;
        } catch (error: any) {
            throw new Error("Erro ao buscar evento");
        }
    }
}

export default EventService;