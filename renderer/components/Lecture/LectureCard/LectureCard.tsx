import { useState } from "react"
import LectureModal from "../LectureModal";
import { getDay, getTime } from "../../../../utils/date";
import { CheckCircle, XCircle } from "lucide-react";
import { setPayed, setPresence } from "../LectureModal/actions";
import { toast } from "react-hot-toast";
import { useRefreshStore } from "../../../store";

export function LectureCardHeader ({ student, lesson }) {
    return (
        <div className="bg-darkBlue py-2 px-4 rounded-md w-full flex items-center">
            <div className="w-1/2 border-r-2 border-r-white px-3 flex items-center">
                <h1 className="text-2xl text-white font-bold">{student.name}</h1>
            </div>
            <div className="w-1/2 px-3 flex flex-col">
                <h1 className="text-lg text-white font-bold">{getDay(lesson.startAt)}</h1>
                <h1 className="text-lg text-white font-bold">{getTime(lesson.startAt)} - {getTime(lesson.endAt)}</h1>
            </div>
        </div>
    )
}

export function LectureCardPayed ({ payed }) {
    return (
        <div className="bg-darkBlue flex gap-10 px-4 py-2 rounded-md items-center" style={{userSelect: "none"}}>
            <h3 className="text-white font-bold text-lg">Pagamento</h3>
                {
                    payed ?
                        <CheckCircle color="white" size={30}/>
                    :
                        <XCircle color="white" size={30}/>
                }
        </div>
    )
}

export default function LectureCard ({ lecture }) {
    const setLecture = useRefreshStore((state: any) => state.setLecture)

    const [isOpen, setOpen] = useState(false);

    const { user, lesson } = lecture;

    async function handlePayed () {
        try {
            await setPayed(lecture);
            setLecture(true);
        } catch (error) {
            toast.error("Erro ao atualizar")
        }
    }

    async function handlePresence () {
        try {
            await setPresence(lecture);
            setLecture(true);
        } catch (error) {
            toast.error("Erro ao atualizar")
        }
    }

    return (
        <div className="w-full flex justify-center">
            <div className="w-8/12 flex rounded-md shadow-md shadow-slate-500 my-8">
                <div className="bg-primaryBlue flex w-full items-center justify-between rounded-md p-3">
                    <div className="w-1/2">
                        <button className="w-full" onClick={() => setOpen(!isOpen)}>
                            <LectureCardHeader student={user} lesson={lesson}/>
                        </button>
                    </div>
                    <div>
                        <button onClick={handlePresence}>
                            <h2 className="text-lg text-white font-bold">{lecture.presence ? "Presente" : "Ausente"}</h2>
                        </button>
                    </div>
                    <div>
                        <button onClick={handlePayed}>
                            <LectureCardPayed payed={lecture.payed}/>
                        </button>
                    </div>
                </div>
            </div>
            <LectureModal isOpen={isOpen} setOpen={setOpen} lecture={lecture}/>
        </div>
    )
}