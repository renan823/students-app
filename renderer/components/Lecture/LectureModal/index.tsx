import { toast } from "react-hot-toast";
import { updateLecture } from "./actions";
import { useEffect, useState } from "react";
import { EditLecture } from "../../../intefaces";
import { useForm } from "react-hook-form";
import { toInputDatetime } from "../../../../utils/date";
import { Modal } from "../../Modal";
import StudentSearch from "../../Student/StudentSearch/StudentSearch";
import Field from "../../Field";
import Checkbox from "../../Checkbox";
import { useRefreshStore } from "../../../store";

export default function LectureModal ({ lecture, isOpen, setOpen }) {
    const setLecture = useRefreshStore((state: any) => state.setLecture);

    let { lesson, user, payed, presence } = lecture;
    console.log(user)

    let { startAt, endAt, value } = lesson;

    startAt = toInputDatetime(startAt);
    endAt = toInputDatetime(endAt);

    const defaultValues = { startAt, endAt, value, payed, presence };

    const [studentsData, setStudenstData] = useState([]);
    const [selectedStudentData, setSelectedStudentData] = useState({ student: user });

    const { control, setValue, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm<EditLecture>({ defaultValues });

    async function onSubmit (data) {
        if (selectedStudentData) {
            let { startAt, endAt, value, payed, presence } = data;
            let cpf = selectedStudentData.student.cpf;

            const newLesson = { startAt, endAt, value: parseFloat(value), id: lesson.id };
            const newLecture = { user_cpf: cpf, lesson_id: lesson.id, id: lecture.id, payed, presence };

            try {
                const result = await updateLecture(newLecture, newLesson);
                if (result) {
                    toast.success("Dados alterados");
                    setLecture(true);
                    handleClose();
                } else {
                    toast.error("Algo deu errado");
                }
            } catch (error) {
                toast.error("Algo deu errado");
            }
        }
    }

    function handleClose () {
        reset();
        setOpen(false);
    }

    useEffect(() => {
        if (defaultValues) {
            Object.entries(defaultValues).forEach(([key, value]) => {
                setValue(key as  keyof EditLecture, value);
            })
        }
    }, [defaultValues, setValue])

    return (
        <div>
            <Modal.Root isOpen={isOpen}>
                <Modal.Header title="Editar aula" handleClose={handleClose}/>
                <Modal.Content>
                    <div className="p-4">
                        <StudentSearch setSearchResults={setStudenstData} selector={false}/>
                        <div className="h-24 overflow-y-auto p-2 flex flex-col">
                            {
                                studentsData.map((data, index) => {
                                    return (
                                        <button className="m-2 bg-slate-400 flex" onClick={() => setSelectedStudentData(data)}>
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
                        <Checkbox name="payed" control={control} error={ errors.payed } label="Aula paga?" checked={defaultValues.payed}/>
                        <Checkbox name="presence" control={control} error={ errors.presence } label="Aluno presente?" checked={defaultValues.presence}/>
                        <div className="flex w-full p-2 justify-end">
                            <button className="flex font-bold text-lg text-white px-8 py-2 rounded-md bg-darkBlue" type="submit">{ isSubmitting ? "Enviando" : "Salvar" }</button>
                        </div>
                    </form>
                </Modal.Content>
            </Modal.Root>
        </div>
    )
}