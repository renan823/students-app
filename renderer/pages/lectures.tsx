import { useState } from "react";
import LessonModal from "../components/lectures/LessonModal";
import { Plus } from "lucide-react";

export default function Lectures () {

    const [isOpen, setOpen] = useState(false);

    return (
        <div>
            <button className="py-2 px-4 flex gap-5 items-center bg-lightRed shadow-sm shadow-slate-400 rounded-sm" onClick={() => setOpen(true)}>
                <Plus color="white"/>
                <h2 className="font-bold text-xl text-white">Nova aula</h2>
            </button>
            <LessonModal isOpen={isOpen} setOpen={setOpen}/>
        </div>
    )
}