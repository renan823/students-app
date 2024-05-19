import { ChevronLeft, ChevronRight } from "lucide-react";

export default function Pagination ({ max, setCurrentPage, currentPage }) {

    function handleBack () {
        setCurrentPage(currentPage-1);
    }

    function handleNext () {
        setCurrentPage(currentPage+1);
    }
    
    return (
        <div className="flex">
            <button disabled={currentPage === 1 ? true : false} onClick={handleBack}>
                <ChevronLeft size={30}/>
            </button>
            <h1 className="bg-darkBlue py-2 px-4 rounded-sm text-white font-bold text-lg">{currentPage}</h1>
            <button disabled={max <= currentPage} onClick={handleNext}>
                <ChevronRight size={30}/>
            </button>
        </div>
    )
}