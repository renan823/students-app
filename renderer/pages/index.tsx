import { Layout } from "../components/Layout";
import Calendar from "../components/Calendar";

export default function Index () {
	return (
		<Layout.Root>
			<Layout.Header>
				<div>
					<h1 className="text-darkBlue text-3xl font-bold">Calendário de Aulas</h1>
				</div>
			</Layout.Header>
			<Layout.Content>
				<div className="w-full h-full overflow-y-auto">
					<Calendar/>
				</div>
			</Layout.Content>
		</Layout.Root>
	)
}