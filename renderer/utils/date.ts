import dayjs from "dayjs";

export const days = "dom-seg-ter-qua-qui-sex-sab".split("-");
export const months = "jan-fev-mar-abr-mai-jun-jul-ago-set-out-nov-dec".split("-")

export function getDayName (date) {
    return days[date.day()];
}

export function getFullWeek (day=dayjs()) {
    const sunday = day.startOf("week");

    let week = [];

    for (let i = 0; i <= 6; i++) {
        const date = dayjs(sunday).add(i, "days");

        week.push({ date, day: getDayName(date) });
    }

    return week;
}

export function getAge (bornDate) {
    return dayjs().startOf("day").diff(bornDate, "years");
}

export function toInputDate (date) {
    return dayjs(date).format("YYYY-MM-DD");
}

export function format (date) {
    return dayjs(date).format("DD/MM/YYYY HH:mm");
}

export function getDay (date) {
    return dayjs(date).format("DD/MM/YYYY");
}

export function getTime (date) {
    return dayjs(date).format("HH:mm")
}

export function timeDiff (time1, time2) {
    const [hour1, min1] = time1.split(":");
    const date1 = dayjs().startOf("day").set("hour", parseInt(hour1)).set("minute", parseInt(min1));
    
    const [hour2, min2] = time2.split(":");
    const date2 = dayjs().startOf("day").set("hour", parseInt(hour2)).set("minute", parseInt(min2));

    const diff = date1.diff(date2, "hours");

    return diff;
}

export function toInputDatetime (date) {
    return dayjs(date).format("YYYY-MM-DDTHH:mm");
}

export function monthIdentify (date) {
    const newDate = dayjs(date).startOf("day");
    const month = newDate.month();
    const year = newDate.year();

    return `${months[month]}/${year}`;
}

export function sortFarmattedDates (dates) {
    const [month1, year1] = dates[0].split("/")
    const date1 = dayjs().set("d", 1).set("y", parseInt(year1)).set("month", months.indexOf(month1));

    const [month2, year2] = dates[1].split("/")
    const date2 = dayjs().set("d", 1).set("y", parseInt(year2)).set("month", months.indexOf(month2));

    return date1.isBefore(date2) ? -1 : 1;
}

export const today = dayjs().startOf("day");