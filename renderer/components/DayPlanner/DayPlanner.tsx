import FullCalendar from "@fullcalendar/react";
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import { getFullWeek, toInputDate } from "../../../utils/date"

export default function DayPlanner ({ lectures }) {

    const week = getFullWeek();
    const weekStart = toInputDate(week[0].date);
	const weekEnd = toInputDate(week[6].date);

    console.log(week)

    console.log(weekStart, weekEnd);

    console.log(lectures)

    const events = [];

    Object.keys(lectures).forEach((day) => {
        lectures[day].forEach((event) => {
            let start = new Date(event.lesson.startAt).toISOString();
            let end = new Date(event.lesson.endAt).toISOString();
            let title = `Aula com ${event.user.name}`;
            let color = event.payed ? "#593FD8" : "#D81CB3";

            events.push({ title, start, end, color });
        })
    })


    return (
        <div>
            <FullCalendar 
                plugins={[ timeGridPlugin, interactionPlugin ]}
                initialView="timeGridWeek"
                locale="pt-br"
                visibleRange={{ start: weekStart, end: weekEnd }} 
                dayHeaders={true} 
                allDaySlot={false}
                expandRows={true}
                slotMinTime="06:00:00"
                slotMaxTime="23:00:00"
                slotDuration="01:00:00"
                dayHeaderFormat={{ weekday: 'short', month: 'numeric', day: 'numeric', year: 'numeric' }}
			    headerToolbar={false}
                events={events}
                eventContent={(content) => {
                    return (
                          <div>
                            <h1 className='font-bold text-lg'>{content.event.title}</h1>
                            <h1 className='font-bold text-lg'>{content.timeText}</h1> 
                        </div>
                    );
                }}
            />
        </div>
    )
}