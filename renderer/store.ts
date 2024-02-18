import { create } from "zustand";

export const useRefreshStore = create((set) => ({
    student: false,
    lesson: false, 
    lecture: false,
    setStudent: (value: boolean) => set((state) => ({ student: value, lesson: state.lesson, lecture: state.lecture })),
    setLesson: (value: boolean) => set((state) => ({ student: state.student, lesson: value, lecture: state.lecture })),
    setLecture: (value: boolean) => set((state) => ({ student: state.student, lesson: state.lesson, lecture: value }))
}))
