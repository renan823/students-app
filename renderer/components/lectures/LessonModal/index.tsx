import { useEffect, useState } from "react";
import { Modal } from "../../Modal";
import { sendEvent } from "../../../utils/event";
import toast from "react-hot-toast";
import { useForm } from "react-hook-form";
import { addLecture } from "./actions";
import { days } from "../../../utils/date";
import store from "../../../utils/store";
import Field from "../../Forms/Field";

export default function LessonModal ({ isOpen, setOpen }) {
    const setLecture = store().setLectures;

    const [values, setValues] = useState({ 
        startAt: "",
        duration: "",
        value: ""
    })

    const [events, setEvents] = useState(Array.from(Array(7), () => false));

    const [students, setStudents] = useState([]);
    const [query, setQuery] = useState("");
    const [selected, setSelected] = useState(null);

    const { control, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm({ defaultValues: values });

    async function onSubmit (data) {
        if (selected && selected !== "") {
            const result = await addLecture(data, selected, events);
            if (result) {
                toast.success("Aula criada");
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
                const { students }: any = await sendEvent("find-students-by-name", query);
                setStudents(students);
            } catch (error) {
                toast.error("Busca com problemas...");
            }
        } else {
            setStudents([]);
        }
    }

    function handleSelect (student) {
        if (!selected || student._id !== selected._id) {
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

    function handleWeekEvent(event) {
        let day = event.target.id;
        let value = event.target.checked;

        let index = days.indexOf(day);

        let copy = events;
        copy[index] = value;

        setEvents(copy);
    }

    useEffect(() => {
        if (query === "") {
            setStudents([]);
        }
    }, [query])

    return (
        <Modal.Root isOpen={isOpen}>
            <Modal.Header title="Adicionar aula" handleClose={handleClose}/>
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
                            students.map((result) => {
                                return (
                                    <button onClick={() => handleSelect(result.student)} className="p-2 flex border-2 border-slate-500 m-1 rounded-sm bg-slate-200">
                                        <h2 key={result.student._id} className="font-bold">{result.student.name}</h2>
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
                    <Field name="duration" control={control} rules={{ required: true }} error={ errors.duration } label="Duração da aula" type="number" step={1} min={0}/>
                    <div className="w-full p-2">
                        <h3 className="font-bold text-lg">Repetir:</h3>
                        <div className="flex p-2 gap-3 items-center justify-center">
                            {
                                days.map((day, index) => {
                                    return (
                                        <div key={index} className="size-12">
                                            <div className="w-12 flex justify-center">
                                                <input className="size-6" type="checkbox" name={day} id={day} onChange={(event) => handleWeekEvent(event)}/>
                                            </div>
                                            <h2 className="text-center font-bold">{day}</h2>
                                        </div>
                                    )
                                })
                            }
                        </div>
                    </div>
                    <Field name="value" control={control} rules={{ required: true }} error={ errors.value } label="Valor da aula" type="number" step={5} min={0}/>
                    <div className="flex w-full p-2 justify-end">
                        <button className="flex font-bold text-lg text-white px-8 py-2 rounded-md bg-darkBlue" type="submit">{ isSubmitting ? "Enviando" : "Salvar" }</button>
                    </div>
                </form>
            </Modal.Content>
        </Modal.Root>
    )
}