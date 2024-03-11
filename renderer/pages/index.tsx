import { useEffect, useState } from "react"
import { sendEvent } from "../utils/event";
import { getFullWeek } from "../utils/date";
import toast from "react-hot-toast";
import { Layout } from "../components/Layout";
import { ChevronLeft, ChevronRight } from "lucide-react";
import dayjs from "dayjs";

export default function Index () {

	const [loading, setLoading] = useState(true);
	const [lectures, setLectures] = useState([]);
	const [week, setWeek] = useState(getFullWeek());

	function handleNextWeek () {
		setWeek(getFullWeek(dayjs(week[0].date).add(1, "week")));
	}

	function handlePrevWeek () {
		setWeek(getFullWeek(dayjs(week[0].date).add(-1, "week")));
	}

	useEffect(() => {
		async function fetch () {
			try {
				const data: any = await sendEvent("lectures-by-week", week[0].date.toISOString());
				setLectures(data);
				console.log(lectures)
			} catch (error) {
				toast.error("Algo deu errado");
			} finally {
				setLoading(false);
			}
		}

		fetch();
	}, [week])

	return (
		<Layout.Root>
			<Layout.Header>
				<div>
					<h1 className="text-darkBlue text-3xl font-bold">Calendário de Aulas</h1>
					<div className="flex">
						<button onClick={handlePrevWeek}>
							<ChevronLeft size={30}/>
						</button>
						<h2 className="text-darkBlue text-lg font-bold"> {week[0].date.format("DD/MM/YYYY")} - {week[6].date.format("DD/MM/YYYY")}</h2>
						<button onClick={handleNextWeek}>
							<ChevronRight size={30}/>
						</button>
					</div>
				</div>
			</Layout.Header>
			<Layout.Content>
				<div className="w-full h-full overflow-y-auto">
					{
						loading ?
							<h2 className="text-darkBlue text-xl font-bold text-center">Carregando...</h2>
						:
							<div>
								{
									lectures.length !== 0 ?
										lectures.map((lecture: any) => {
											return (
												<div>
													<h1>Aluno: {lecture.studentId}</h1>
												</div>
											)
										})
									:
										<h1>Nada aqui</h1>
								}
							</div>
					}
				</div>
			</Layout.Content>
		</Layout.Root>
	)
}