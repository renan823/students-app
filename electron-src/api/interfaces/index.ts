export interface StudentInterface {
    _id: string,
    cpf: string,
    name: string,
    motherName: string,
    observation: string,
    grade: string,
    phones: string[],
    bornDate: Date | string,
    type: string
}

export interface LectureInterface {
    _id: string,
    studentCpf: string,
    payed: boolean,
    presence: boolean,
    lesson: {
        startAt: Date | string,
        endAt: Date | string,
        value: number
    },
    type: string
}