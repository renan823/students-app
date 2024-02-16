import { useState } from "react"
import LectureModal from "../LectureModal";

export function LectureCardHeader ({ student, lesson }) {
    return (
        <div>
            <h1>{student.name}</h1>
        </div>
    )
}

export function LectureCardPayed ({ payed }) {
    return (
        <div>
            <h1>Oi</h1>
        </div>
    )
}

export default function LectureCard ({ lecture }) {

    const [isOpen, setOpen] = useState(false);

    const { user, lesson } = lecture;

    return (
        <div>
            <div className="w-8/12 flex rounded-md shadow-md shadow-slate-500 my-8" onClick={() => setOpen(!isOpen)}>
                <div className="bg-primaryBlue flex w-full rounded-md">
                    <LectureCardHeader student={user} lesson={lesson}/>
                    <div>
                        <button>{lecture.presence ? "Presente" : "Ausente"}</button>
                    </div>
                    <div>
                        <button>
                            <LectureCardPayed payed={lecture.payed}/>
                        </button>
                    </div>
                </div>
            </div>
            <LectureModal isOpen={isOpen} setOpen={setOpen} lecture={lecture}/>
        </div>
    )
}