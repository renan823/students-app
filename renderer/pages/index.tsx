import { useEffect, useState } from "react";
import { Layout } from "../components/Layout";
import { getFullWeek } from "../../utils/date";
import { sendEvent } from "../../utils/api";
import { toast } from "react-hot-toast";
import DayPlanner from "../components/DayPlanner/DayPlanner";

export default function Index () {

	const [loading, setLoading] = useState(true);
	const [weekData, setWeekData] = useState([]);

	const week = getFullWeek();
	useEffect(() => {
		async function fetch () {
			try {
				const data: any = await sendEvent("find-lectures-by-week");
				setWeekData(data);
			} catch (error) {
				console.log(error)
				toast.error("Algo deu errado");
			} finally {
				setLoading(false);
			}
		}

		fetch()
	}, [])

	return (
		<Layout.Root>
			<Layout.Header>
				<div>
					<h1 className="text-darkBlue text-3xl font-bold">Calendário de Aulas</h1>
					<h2 className="text-darkBlue text-lg font-bold">Semana de {week[0].date.format("DD/MM/YYYY")} - {week[6].date.format("DD/MM/YYYY")}</h2>
				</div>

			</Layout.Header>
			<Layout.Content>
					<div className="w-full h-full overflow-y-auto">
						{
							loading ?
								<p>Carregando...</p>
							:
								<DayPlanner lectures={weekData}/>
						}
					</div>
			</Layout.Content>
		</Layout.Root>
	)
}