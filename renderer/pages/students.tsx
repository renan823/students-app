import { useEffect, useState } from "react";
import { Layout } from "../components/Layout";
import StudentModal from "../components/Student/StudentModal";
import { Plus } from "lucide-react";
import toast from "react-hot-toast";
import { sendEvent } from "../utils/event";
import { useRefreshStore } from "../store";
import StudentCard from "../components/Student/StudentCard/StudentCard";
import Pagination from "../components/Pagination";

export default function Students () {
    const student = useRefreshStore((state: any) => state.student);
    const setStudent = useRefreshStore((state: any) => state.setStudent);

    const [loading, setLoading] = useState(true);
    const [students, setStudents] = useState([]);
    const [isOpen, setOpen] = useState(false);

    const [currentPage, setCurrentPage] = useState(1);
    const [perPage, setPerPage] = useState(10);
    const [max, setMax] = useState(1);

    const [query, setQuery] = useState("");
    const [total, setTotal] = useState(0);
    const [showPagination, setShowPagination] = useState(true);

    async function handleSearch () {
        setShowPagination(false);
        let search = "name";
        let value = query;
        
        if (query.includes(":")) {
            let [type, name] = query.split(":");
            type = type.trim().toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').slice(0, 4);

            if (type === "mae") {
                search = "mothername";
            } 

            value = name.trim();
        } 

        try {
            const data: any = await sendEvent(`find-students-by-${search}`, value);
            setStudents(data);
        } catch (error) {
            toast.error("Busca com problemas...");
        }
    }

    useEffect(() => {
        async function fetch () {
            try {
                const total: any = await sendEvent("count-students");
                setTotal(total);
                setMax(Math.ceil(total/perPage));
            } catch (error) {
                console.log(error);
                setTotal(10);
            }
        }

        fetch();
    }, [])

    useEffect(() => {
        async function fetch () {
            try {
                const data: any = await sendEvent("find-all-students", currentPage, perPage);
                setStudents(data.students);
            } catch (error) {
                toast.error("Algo deu errado");
            } finally {
                setLoading(false);
                setStudent(false);
            }
        }

        if (query === "") {
            setShowPagination(true);
            fetch();
        }
    }, [student, currentPage, query])

    return (
        <Layout.Root>
            <Layout.Header>
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
                <div>
                    <button className="py-2 px-4 flex gap-5 items-center bg-lightRed shadow-sm shadow-slate-400 rounded-sm" onClick={() => setOpen(true)}>
                        <Plus color="white"/>
                        <h2 className="font-bold text-xl text-white">Novo aluno</h2>
                    </button>
                    <StudentModal isOpen={isOpen} setOpen={setOpen} student={null}/>
                </div>
                <div className="flex">
                    <div className="bg-primaryBlue rounded-sm py-2 px-4 shadow-md shadow-slate-400">
                        {
                            loading ? 
                                <p className="text-white text-xl font-bold">Carregando...</p>
                            :
                                <h1 className="text-white text-xl font-bold">{total} Aluno(s) cadastrado(s)</h1>
                        }
                    </div>
                </div>
            </Layout.Header>
            <Layout.Content>
                <div className="h-full flex flex-col gap-4">
                    <h1 className="text-2xl font-bold text-slate-800 text-center">Alunos</h1>
                    <div className="h-5/6 w-full overflow-y-auto p-2">
                        {
                            students.length !== 0 ? 
                                <>
                                    <h2 className="text-darkBlue text-lg font-bold text-center">Busque alunos por nome ou nome da mãe (use "mãe:" antes do nome) </h2>
                                    {
                                        students.map((data, index) => {
                                            return (
                                                <StudentCard key={index} index={index} student={data.student} debtAmout={data.debtAmount}/>
                                            )
                                        })
                                    }
                                </>
                            :
                                <h2 className="text-darkBlue text-xl font-bold text-center">Nenhum aluno encontrado!</h2>
                        }
                    </div>
                    <div className="flex justify-center my-3">
                        {
                            showPagination ?
                                <Pagination currentPage={currentPage} max={max} setCurrentPage={setCurrentPage}/>
                            :
                                <></>
                        }
                    </div>
                </div>
            </Layout.Content>
        </Layout.Root>
    )
}