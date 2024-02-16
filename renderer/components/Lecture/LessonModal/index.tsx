import { useForm } from "react-hook-form";
import { Modal } from "../../Modal";
import { Lesson } from "../../../intefaces";
import Field from "../../Field";
import { useState } from "react";
import StudentSearch from "../../Student/StudentSearch/StudentSearch";
import { addLesson } from "./actions";
import { toast } from "react-hot-toast";


export default function LessonModal ({ isOpen, setOpen }) {
    const { control, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm<Lesson>();

    const [studentsData, setStudenstData] = useState([]);
    const [selectedStudentData, setSelectedStudentData] = useState(null);

    async function onSubmit (data) {
        if (selectedStudentData) {
            data.value = parseInt(data.value);
            try {
                const result = await addLesson(data, selectedStudentData.student);
                if (result) {
                    toast.success("Aula criada");
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
                <div className="p-4">
                    <StudentSearch setSearchResults={setStudenstData} selector={false}/>
                    <div className="h-24 overflow-y-auto p-2 flex flex-col">
                        {
                            studentsData.map((data, index) => {
                                return (
                                    <button className="m-2 bg-slate-400 flex" onClick={() => setSelectedStudentData(data)}>
                                        <h2 className="font-bold">{data.student.name}</h2>
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