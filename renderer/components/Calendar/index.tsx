import FullCalendar from "@fullcalendar/react";
import timeGridPlugin from "@fullcalendar/timegrid";
import { useEffect, useState } from "react";
import { getEvents } from "./actions";
import dayjs from "dayjs";

export default function Calendar () {
    
    const [loading, setLoading] = useState(false);
    const [events, setEvents] = useState([]);

    async function handleDateChange (args: any) {
        const week = dayjs(args.start).startOf("day");
        const events: any = await getEvents(week);
        setEvents(events);
        console.log("aqui oh", events)
    }

    useEffect(() => {
        async function fetch () {
            try {
                setLoading(true);
                const events: any[] = await getEvents(dayjs().startOf("day"));
                console.log(events)
                setEvents(events);
            } catch (error) {
                setEvents([]);
            } finally {
                setLoading(false);
            }
        }

        fetch();
    }, [])

    return (
        <div>
            {
                loading ?
                    <h1>Carregando</h1>
                :
                    <FullCalendar
                        plugins={[timeGridPlugin]}
                        initialView="timeGridWeek"
                        locale="pt-br"
                        slotMinTime="06:00:00"
                        slotMaxTime="23:00:00"
                        slotDuration="01:00:00"
                        allDayContent={false}
                        allDaySlot={false}
                        expandRows={true}
                        datesSet={handleDateChange}
                        events={events}
                        eventContent={eventRender}
                    />
            }
        </div>
    )
}

function eventRender (data: any) {
    return (
        <div>
            <h2 className="font-bold">{data.timeText}</h2>
            <h2 className="font-bold text-lg">{data.event.title}</h2>
        </div>
    )
}
 

