import dayjs from "dayjs";
import { Event } from "../interfaces";
import LectureService from "./LectureService";

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

    async findNextDate (event: Event) {
        try {
            const lectureService = new LectureService();

            const lastLecture = (await lectureService.findLecturesByEventId(event._id))[0];

            const lectureDay = dayjs(lastLecture.lesson.startAt).day();

            const newDay = dayjs(lastLecture.lesson.startAt);

            if (lastLecture.event?.repeat.slice(lectureDay == 6 ? lectureDay : lectureDay + 1).includes(true)) {
                //only accepts days between 0-6
                //find the first repeat after the date
                newDay.add(lastLecture.event?.repeat.slice(lectureDay == 6 ? lectureDay : lectureDay + 1).indexOf(true), "d");
            } else if (lastLecture.event?.repeat.slice(0, lectureDay).includes(true)) {
                //find the first repeat before the date
                newDay.add(1, "w").add(lastLecture.event?.repeat.slice(0, lectureDay).indexOf(true), "d");
            } else {
                //the new date is one week after the last date
                newDay.add(1, "w");
            }

            return { newDay, lastLecture };
        } catch (error: any) {
            throw new Error("Erro ao buscar evento");
        }
    }

    async createLectureFromEvent (event: Event) {
        try {
            //const lectureService = new LectureService();

            const { newDay, lastLecture } = await this.findNextDate(event);

            console.log("dia", newDay, "ultima aula", lastLecture);
        } catch (error: any) {

        }
    }
}

export default EventService;