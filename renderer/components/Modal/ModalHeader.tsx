import { X } from "lucide-react"

export function ModalHeader ({ title, handleClose }) {
    return (
        <div className="flex justify-between items-center">
            <h1 className="text-darkBlue text-2xl font-bold">{title}</h1>
            <div className="bg-primaryBlue p-1 rounded-lg" onClick={handleClose}>
                <X color="white"/>
            </div>
        </div>
    )
}