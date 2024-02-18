import { useEffect, useState } from "react";
import { Layout } from "../components/Layout"
import LectureSearch from "../components/Lecture/LectureSearch";
import LessonModal from "../components/Lecture/LessonModal";
import { Plus } from "lucide-react";
import { sendEvent } from "../../utils/api";
import toast from "react-hot-toast";
import Pagination from "../components/Pagination";
import LectureCard from "../components/Lecture/LectureCard/LectureCard";
import { useRefreshStore } from "../store";

export default function Lessons () {

    const lesson = useRefreshStore((state: any) => state.lesson);
    const setLesson = useRefreshStore((state: any) => state.setLesson);

    const lecture = useRefreshStore((state: any) => state.lecture);
    const setLecture = useRefreshStore((state: any) => state.setLecture);

    const [isOpen, setOpen] = useState(false);
    const [lecturesData, setLecturesData] = useState([]);
    const [loading, setLoading] = useState(true);

    const [currentPage, setCurrentPage] = useState(1);
    const [perPage, setPerPage] = useState(20);

    const lastIndex = currentPage * perPage;
    const firstIndex = lastIndex - perPage;

    const currentLectures = lecturesData.slice(firstIndex, lastIndex);

    useEffect(() => {
        setCurrentPage(1);
    }, [lecturesData]);

    useEffect(() => {
        async function fetch () {
            try {
                const data: any = await sendEvent("find-all-lectures-sorted-by-date");
                setLecturesData(data);
                console.log(data)
                setCurrentPage(1);
            } catch (error) {
                toast.error("Algo deu errado");
            } finally {
                setLesson(false);
                setLecture(false);
                setLoading(false);
            }
        }

        fetch();
    }, [lesson, lecture])

    return (
        <Layout.Root>
            <Layout.Header>
                <LectureSearch setSearchResults={setLecturesData}/>
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
                                <p>Carregando...</p>
                            :
                                <h1 className="text-white text-xl font-bold"> 1 Pagamaneto(s) pendente(s)</h1>
                        }
                    </div>
                </div>
            </Layout.Header>
            <Layout.Content>
            <div className="h-full flex flex-col gap-4">
                    <h1 className="text-2xl font-bold text-slate-800 text-center">Aulas</h1>
                    <div className="h-5/6 w-full items-center overflow-y-auto p-2 flex flex-col content-center">
                        {
                            currentLectures.map((lecture, index) => {
                                return (
                                    <LectureCard key={index} lecture={lecture}/>
                                )
                            })
                        }
                    </div>
                    <div className="flex justify-center my-3">
                        <Pagination totalData={lecturesData.length} perPage={perPage} setCurrentPage={setCurrentPage} currentPage={currentPage}/>
                    </div>
                </div>
            </Layout.Content>
        </Layout.Root>
    )
}
