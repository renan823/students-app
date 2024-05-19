import { Event } from "../interfaces";

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

    }

    async findEventById (id: string) {
        try {
            const event = await this.database.get<Event>(id)

            return event;
        } catch {
            throw new Error("Erro ao buscar evento");
        }
    }
}

export default EventService;