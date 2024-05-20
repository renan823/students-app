import { useEffect, useState } from "react";
import { Layout } from "../components/Layout";
import Pagination from "../components/Pagination";
import toast from "react-hot-toast";
import { sendEvent } from "../utils/event";
import { Plus } from "lucide-react";
import store from "../utils/store";
import LessonModal from "../components/lectures/LessonModal";
import LectureCard from "../components/lectures/LectureCard/LectureCard";

export default function Lectures () {
    const lecture = store().refreshLectures;
    const setLecture = store().setLectures;

    const [loading, setLoading] = useState(true);
    const [lectures, setLectures] = useState([]);
    const [isOpen, setOpen] = useState(false);

    const [currentPage, setCurrentPage] = useState(1);
    const [perPage, setPerPage] = useState(10);
    const [max, setMax] = useState(1);

    const [query, setQuery] = useState("");
    const [total, setTotal] = useState(0);
    const [showPagination, setShowPagination] = useState(true);
    const [debt, setDebt] = useState(0);

    async function handleSearch () {
        if (query.trim().length !== 0) {
            setShowPagination(false);
            try {
                setCurrentPage(1);
                const { students }: any = await sendEvent("find-lectures-by-student-name", query);
                setLectures(students);
            } catch (error) {
                toast.error("Busca com problemas...");
            }
        }
    }

    useEffect(() => {
        async function fetch () {
            try {
                const { total }: any = await sendEvent("count-lectures");
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
                const { lectures }: any = await sendEvent("find-all-lectures", currentPage, perPage);
                console.log(lectures)
                setLectures(lectures);
                setDebt(10);
            } catch (error) {
                toast.error("Algo deu errado");
            } finally {
                setLoading(false);
                setLecture(false);
            }
        }

        if (query === "") {
            setShowPagination(true);
            fetch();
        }
    }, [lecture, currentPage, query])

    return (
        <Layout.Root>
            <Layout.Header>
                <div className="flex">
                    <div className="flex items-center gap-10">
                        <div>
                            <input 
                                className="p-2 border-2 border-darkBlue focus:border-darkBlue placeholder:text-slate-600 text-slate-600 font-bold"
                                type="text" 
                                placeholder="Buscar aulas" 
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
                        <h2 className="font-bold text-xl text-white">Nova aula</h2>
                    </button>
                    <LessonModal isOpen={isOpen} setOpen={setOpen}/>
                </div>
                <div className="flex">
                    <div className="bg-primaryBlue rounded-sm py-2 px-4 shadow-md shadow-slate-400">
                        {
                            loading ? 
                                <p className="text-white text-xl font-bold">Carregando...</p>
                            :
                                <h1 className="text-white text-xl font-bold">{debt} Pagamento(s) pendente(s)</h1>
                        }
                    </div>
                </div>
            </Layout.Header>
            <Layout.Content>
                <div className="h-full flex flex-col gap-4">
                    <h1 className="text-2xl font-bold text-slate-800 text-center">Aulas</h1>
                    <div className="h-5/6 w-full overflow-y-auto p-2">
                        {
                            lectures.length !== 0 ? 
                                <>
                                    <h2 className="text-darkBlue text-lg font-bold text-center">Busque aulas pelo nome do aluno</h2>
                                    {
                                        lectures.map((data, index) => {
                                            return (
                                                <LectureCard data={data} key={index}/>
                                            )
                                        })
                                    }
                                </>
                            :
                                <h2 className="text-darkBlue text-xl font-bold text-center">Nenhuma aula encontrada!</h2>
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