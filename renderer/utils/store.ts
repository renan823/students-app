import { create } from "zustand";

type State = {
    refreshStudents: boolean,
    refreshLectures: boolean,
    refreshLessons: boolean
}

type Actions =   {
    setStudents: (value: State["refreshStudents"]) => void,
    setLectures: (value: State["refreshLectures"]) => void,
    setLessons: (value: State["refreshLessons"]) => void
}

const store = create<State & Actions>((set) => ({
    refreshStudents: false,
    refreshLectures: false,
    refreshLessons: false,
    setStudents: (value) => set(() => ({ refreshStudents: value })),
    setLectures: (value) => set(() => ({ refreshLectures: value })),
    setLessons: (value) => set(() => ({ refreshLessons: value })),
}))

export default store;