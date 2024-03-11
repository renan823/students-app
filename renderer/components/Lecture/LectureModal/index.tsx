import { useEffect, useState } from "react";
import { useRefreshStore } from "../../../store";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { updateLecture } from "./actions";
import { sendEvent } from "../../../utils/event";
import Field from "../../Field";
import { Modal } from "../../Modal";
import Checkbox from "../../Checkbox";
import { toInputDatetime } from "../../../utils/date";

export default function LectureModal ({ isOpen, setOpen, lecture }) {
    const setLecture = useRefreshStore((state: any) => state.setLecture);

    const [values, setValues]: [any, any]  = useState({ 
        startAt: "",
        endAt: "",
        value: "",
        payed: "",
        presence: ""
    })

    const [students, setStudents] = useState([]);
    const [query, setQuery] = useState("");
    const [selected, setSelected]= useState(null);

    const { control, setValue, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm({ defaultValues: values });

    async function onSubmit (data) {
        if (selected && selected !== "") {

            lecture.student = selected;
            lecture.studentId = selected._id;
            lecture.payed = data.payed;
            lecture.presence = data.presence;

            let lesson = { startAt: data.startAt, endAt: data.endAt, value: data.value };

            const result = await updateLecture(lecture, lesson);
            if (result) {
                toast.success("Dados alterados");
                setLecture(true);
                handleClose();
            } else {
                toast.error("Algo deu errado");
            }
            
        } else {
            toast.error("Para continuar, escolha um aluno");
        }
    }

    async function handleSearch () {
        if (query.trim().length !== 0) {
            try {
                const result: any = await sendEvent("find-students-by-name-for-lectures", query);
                setStudents(result);
            } catch (error) {
                toast.error("Busca com problemas...");
            }
        } else {
            setStudents([]);
        }
    }

    function handleSelect (student) {
        if (!selected || student.cpf !== selected.cpf) {
            setSelected(student);
        } else {
            setSelected(null);
        }
    }

    function handleClose () {
        setOpen(false);
        setSelected(null);
        setStudents([]);
        setQuery("");
        reset();
    }

    useEffect(() => {
        if (query === "") {
            setStudents([]);
        }
    }, [query])

    useEffect(() => {
        if (lecture) {
            const { lesson, student, payed, presence } = lecture;

            let { startAt, value, endAt } = lesson;

            startAt = toInputDatetime(startAt);
            endAt = toInputDatetime(endAt);

            setValues({ startAt, endAt, value, presence, payed });
            setSelected(student);
        }

        Object.entries(values).forEach(([key, value]) => {
            return setValue(`${key}`, value);
        })

    }, [isOpen, lecture]);

    return (
        <Modal.Root isOpen={isOpen}>
            <Modal.Header title="Editar aula" handleClose={handleClose}/>
            <Modal.Content>
                <div className="my-2">
                    <div className="p-5">
                        <div className="flex">
                            <div className="flex items-center gap-10">
                                <div>
                                    <input 
                                        className="p-2 border-2 border-darkBlue focus:border-darkBlue placeholder:text-slate-600 text-slate-600 font-bold"
                                        type="text" 
                                        placeholder="Buscar alunos" 
                                        onChange={(event) => setQuery(event.target.value)}
                                    />
                                </div>
                                <button className="py-2 px-4 flex gap-5 items-center bg-darkBlue shadow-sm shadow-slate-400 rounded-sm" onClick={handleSearch}>
                                    <h2 className="text-white font-bold text-lg">Buscar</h2>
                                </button>
                            </div>
                        </div>
                    </div>
                    <div className="h-28 overflow-y-auto p-4 flex flex-col">
                        {
                            students.map((student, index) => {
                                return (
                                    <button onClick={() => handleSelect(student)} className="p-2 flex border-2 border-slate-500 m-1 rounded-sm bg-slate-200">
                                        <h2 key={index} className="font-bold">{student.name}</h2>
                                    </button>
                                )
                            })
                        }
                    </div>
                </div>
                <form className="overflow-auto h-96 p-4" onSubmit={handleSubmit(onSubmit)}>
                    <div className="w-full p-2">
                        <h3 className="font-bold text-lg">Aluno: {selected ? selected.name : "selecione um aluno!"}</h3>
                    </div>
                    <Field name="startAt" control={control} rules={{ required: true }} error={ errors.startAt } label="Início da aula" type="datetime-local"/>
                    <Field name="endAt" control={control} rules={{ required: true }} error={ errors.endAt } label="Fim da aula" type="datetime-local"/>
                    <Field name="value" control={control} rules={{ required: true }} error={ errors.value } label="Valor da aula" type="number" step={5}/>
                    <Checkbox name="payed" control={control} error={ errors.payed } label="Aula paga?" checked={values.payed}/>
                    <Checkbox name="presence" control={control} error={ errors.presence } label="Aluno presente?" checked={values.presence}/>
                    <div className="flex w-full p-2 justify-end">
                        <button className="flex font-bold text-lg text-white px-8 py-2 rounded-md bg-darkBlue" type="submit">{ isSubmitting ? "Enviando" : "Salvar" }</button>
                    </div>
                </form>
            </Modal.Content>
        </Modal.Root>
    )

}