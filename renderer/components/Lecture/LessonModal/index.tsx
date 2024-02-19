import { useForm } from "react-hook-form";
import { Modal } from "../../Modal";
import { Lesson } from "../../../intefaces";
import Field from "../../Field";
import { useState } from "react";
import StudentSearch from "../../Student/StudentSearch/StudentSearch";
import { addLesson } from "./actions";
import { toast } from "react-hot-toast";
import { useRefreshStore } from "../../../store";


export default function LessonModal ({ isOpen, setOpen }) {
    const setLesson = useRefreshStore((state: any) => state.setLesson);

    const { control, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm<Lesson>();

    const [studentsData, setStudenstData] = useState([]);
    const [selectedStudentData, setSelectedStudentData] = useState(null);

    async function onSubmit (data) {
        if (selectedStudentData) {
            data.value = parseFloat(data.value);
            try {
                const result = await addLesson(data, selectedStudentData.student);
                if (result) {
                    toast.success("Aula criada");
                    setLesson(true);
                    handleClose()
                } else {
                    toast.error("Algo deu errado");
                }
            } catch (error) {
                toast.error("Algo deu errado");
            }
        }
    }

    function handleClose () {
        setSelectedStudentData(null)
        setOpen(false);
        reset()
    }

    return (
        <Modal.Root isOpen={isOpen}>
            <Modal.Header title="Adicionar aulas" handleClose={handleClose}/>
            <Modal.Content>
                <div className="my-2">
                    <div className="p-5">
                        <StudentSearch setSearchResults={setStudenstData} selector={false}/>
                    </div>
                    <div className="h-28 overflow-y-auto p-4 flex flex-col">
                        {
                            studentsData.map((data, index) => {
                                return (
                                    <button className="p-2 flex border-2 border-slate-500 m-1 rounded-sm" onClick={() => setSelectedStudentData(data)}>
                                        <h2 key={index} className="font-bold">{data.student.name}</h2>
                                    </button>
                                )
                            })
                        }
                    </div>
                </div>
                <form className="overflow-auto h-96 p-4" onSubmit={handleSubmit(onSubmit)}>
                    <div className="w-full p-2">
                        <h3 className="font-bold text-lg">Aluno(a): {selectedStudentData?.student.name}</h3>
                    </div>
                    <Field name="startAt" control={control} rules={{ required: true }} error={ errors.startAt } label="Início da aula" type="datetime-local"/>
                    <Field name="endAt" control={control} rules={{ required: true }} error={ errors.endAt } label="Fim da aula" type="datetime-local"/>
                    <Field name="value" control={control} rules={{ required: true }} error={ errors.value } label="Valor da aula" type="number" step={5}/>
                    <div className="flex w-full p-2 justify-end">
                        <button className="flex font-bold text-lg text-white px-8 py-2 rounded-md bg-darkBlue" type="submit">{ isSubmitting ? "Enviando" : "Salvar" }</button>
                    </div>
                </form>
            </Modal.Content>
        </Modal.Root>
    )
}