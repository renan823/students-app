import { Layout } from "../components/Layout";
import { useEffect, useState } from "react";
import StudentModal from "../components/Student/StudentModal";
import StudentSearch from "../components/Student/StudentSearch/StudentSearch";
import { sendEvent } from "../../utils/api";
import { toast } from "react-hot-toast";
import Pagination from "../components/Pagination";
import StudentCard from "../components/Student/StudentCard/StudentCard";
import { Plus } from "lucide-react";

export default function Students () {

    const [loading, setLoading] = useState(true);
    const [studentsData, setStudentsData] = useState([]);
    const [isOpen, setOpen] = useState(false);

    const [currentPage, setCurrentPage] = useState(1);
    const [perPage, setPerPage] = useState(10);

    const lastIndex = currentPage * perPage;
    const firstIndex = lastIndex - perPage;

    const currentStudents = studentsData.slice(firstIndex, lastIndex);

    useEffect(() => {
        setCurrentPage(1);
    }, [studentsData]);

    useEffect(() => {
        async function fetch () {
            try {
                const data: any = await sendEvent("find-all-students-with-phones-and-debt");
                setStudentsData(data);
                setCurrentPage(1);
            } catch (error) {
                toast.error("Algo deu errado")
            } finally {
                setLoading(false);
            }
        }

        fetch();
    }, [])

	return (
		<Layout.Root>
            <Layout.Header>
                <StudentSearch setSearchResults={setStudentsData} selector/>
                <div>
                <button className="py-2 px-4 flex gap-5 items-center bg-lightRed shadow-sm shadow-slate-400 rounded-sm" onClick={() => setOpen(true)}>
                        <Plus color="white"/>
                        <h2 className="font-bold text-xl text-white">Novo aluno</h2>
                    </button>
                    <StudentModal isOpen={isOpen} setOpen={setOpen} student={null} phones={null}/>
                </div>
                <div className="flex">
                    <div className="bg-primaryBlue rounded-sm py-2 px-4 shadow-md shadow-slate-400">
                        {
                            loading ? 
                                <p>Carregando...</p>
                            :
                                <h1 className="text-white text-xl font-bold">{studentsData?.length} Alunos cadastrados</h1>
                        }
                    </div>
                </div>
            </Layout.Header>
			<Layout.Content>
                <div className="h-full flex flex-col gap-4">
                    <h1 className="text-2xl font-bold text-slate-800 text-center">Alunos</h1>
                    <div className="h-5/6 w-full overflow-y-auto p-2">
                        {
                            currentStudents.map((data, index) => {
                                return (
                                    <StudentCard student={data.student} phones={data.phones} debtAmout={data.debtAmount}/>
                                )
                            })
                        }
                    </div>
                    <div className="flex justify-center my-3">
                        <Pagination totalData={studentsData.length} perPage={perPage} setCurrentPage={setCurrentPage} currentPage={currentPage}/>
                    </div>
                </div>
            </Layout.Content>
		</Layout.Root>
	)
}