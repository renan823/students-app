import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { searchLectures } from "./actions";
import { toast } from "react-hot-toast";
import { sendEvent } from "../../../../utils/api";

interface LectureSearchProps {
    setSearchResults: Dispatch<SetStateAction<any[]>>
}

export default function LectureSearch ({ setSearchResults }: LectureSearchProps) {

    const [searchParam, setSearchParam] = useState("");

    useEffect(() => {
        async function fetch () {
            if (searchParam && searchParam.trim().length !== 0) {
                try {
                    let data: any = await searchLectures(searchParam);
                    setSearchResults(data);
                } catch (error) {
                    toast.error("Algo deu errado");
                }
            } else {
                try {
                    let data: any = await sendEvent("find-all-lectures-sorted-by-date");
                    setSearchResults(data);
                } catch (error) {
                    toast.error("Algo deu errado");
                }
            }
        }

        fetch();
    }, [searchParam])

    return (
        <div className="flex gap-10">
            <div>
                <input type="text" placeholder="Buscar aulas por nome do aluno" onChange={(event) => setSearchParam(event.target.value)}/>
            </div>
        </div>
    )
}