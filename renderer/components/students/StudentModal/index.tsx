import { useEffect, useState } from "react";
import { Modal } from "../../Modal";
import { useForm } from "react-hook-form";
import { addStudent, grades, splitGrades, updateStudent, years } from "./actions";
import { toast } from "react-hot-toast";
import { toInputDate } from "../../../utils/date";
import store from "../../../utils/store";
import Field from "../../Forms/Field";
import Select from "../../Forms/Select";
import TextArea from "../../Forms/TextArea";

export default function StudentModal ({ isOpen, setOpen, student }) {
    const setStudent = store().setStudents

    const [action, setAction] = useState("create");

    const [values, setValues] = useState({ 
        name: "", 
        lastName: "",
        motherName: "",
        bornDate: "",
        cpf: "",
        gradeType: "",
        gradeYear: "",
        phone1: "",
        phone2: "",
        observation: ""
    })

    const { control, handleSubmit, reset, setValue, formState: { errors, isSubmitting } } = useForm();

    async function onSubmit (data) {
        if (action === "create") {
            const result = await addStudent(data);
            if (result) {
                toast.success("Aluno cadastrado");
                setStudent(true);
                handleClose();
                return;
            } 
        } else if (action === "update") {
            const result = await updateStudent({...student, ...data});
            if (result) {
                toast.success("Dados alterados");
                setStudent(true);
                handleClose();
                return;
            } 
        }
        toast.error("Algo deu errado");
    }

    function handleClose () {
        reset();
        setOpen(!isOpen);
    }

    useEffect(() => {
        if (student) {
            let { cpf, name, lastName, motherName, grade, observation, phones, bornDate } = student;

            const { gradeType, gradeYear } = splitGrades(grade);
            const [phone1, phone2] = phones;
            bornDate = toInputDate(bornDate);

            setValues({ cpf, name, lastName, motherName, observation, gradeType, gradeYear, phone1, phone2, bornDate });
            setAction("update");
        }

        Object.entries(values).forEach(([key, value]) => {
            return setValue(`${key}`, value);
        })

    }, [isOpen, student]);

    return (
        <Modal.Root isOpen={isOpen}>
            <Modal.Header title="Alunos" handleClose={handleClose}/>
            <Modal.Content>
                <form className="overflow-auto h-96 p-4" onSubmit={handleSubmit(onSubmit)}>
                    <Field name="name" control={control} rules={{ required: true }} label="Nome" error={ errors.name }/>
                    <Field name="lastName" control={control} rules={{ required: false }} label="Sobrenome" error={ errors.lastName }/>
                    <Field name="motherName" control={control} rules={null} label="Nome da mãe" error={ errors.motherName }/>
                    <div className="flex gap-4">
                        <Field name="phone1" control={control} rules={{ required: true, pattern: /^\([1-9]{2}\)\d{4,5}-\d{4}$/ }} label="Telefone" error={ errors.phone1 } type="tel" placeholder="(00)0000-0000"/>
                        <Field name="phone2" control={control} rules={{ required: false, pattern: /^\([1-9]{2}\)\d{4,5}-\d{4}$/ }} label="Telefone" error={ errors.phone2 } type="tel" placeholder="(00)0000-0000"/>
                    </div>
                    <Field name="bornDate" control={control} rules={null} label="Data de nascimento" error={ errors.bornDate } type="date"/>
                    <Field name="cpf" control={control} rules={{ pattern: /^\d{3}\.\d{3}\.\d{3}\-\d{2}/ }} label="CPF" error={ errors.cpf } placeholder="XXX.XXX.XXX-XX"/>
                    <div className="w-full p-2">
                        <h3 className="font-bold text-lg">Série</h3>
                        <div className="flex items-center">
                            <Select name="gradeYear" control={control} options={years} className="p-1 m-2 text-center font-bold"/>
                            <h2 className="font-bold">ano do</h2>
                            <Select name="gradeType" control={control} options={grades} className="p-1 m-2 text-center font-bold"/>
                        </div>
                    </div>
                    <TextArea name="observation" control={control} label="Observações" rows={4}/>
                    <div className="flex w-full p-2 justify-end">
                        <button type="submit" className="flex font-bold text-lg text-white px-8 py-2 rounded-md bg-darkBlue">{ isSubmitting ? "Enviando" :  student ? "Alterar": "Salvar" }</button>
                    </div>
                </form>
            </Modal.Content>
        </Modal.Root>
    )
}