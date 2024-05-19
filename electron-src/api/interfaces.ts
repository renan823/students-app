export type Student = {
    _id: string,
    cpf?: string,
    name: string,
    lastName: string,
    motherName?: string,
    observation?: string,
    grade?: string,
    phones: string[],
    bornDate?: string,
}

export type Lesson = {
    startAt: string,
    endAt: string,
    value: number
}

export type Event = {
    _id: string,
    initialDate: string,
    repeat: boolean[]
}

export type Lecture = {
    _id: string,
    studentId: string,
    payed: boolean,
    presence: boolean,
    lesson: Lesson
    fromEvent: boolean,
    event: Event | null;
}