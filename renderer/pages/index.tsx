import { Layout } from "../components/Layout";
import Calendar from "../components/Calendar";

export default function Index () {
	return (
		<Layout.Root>
			<Layout.Header>
				<div>
					<h1 className="text-darkBlue text-3xl font-bold">Calendário de Aulas</h1>
				</div>
				<div className="flex gap-4">
					<div className="flex gap-2 items-center">
						<div className="w-4 h-4 bg-lightGreen rounded-sm"></div>
						<h2 className="font-bold text-lg text-slate-800">Aulas pagas</h2>
					</div>
					<div className="flex gap-2 items-center">
						<div className="w-4 h-4 bg-lightRed rounded-sm"></div>
						<h2 className="font-bold text-lg text-slate-800">Aulas não pagas</h2>
					</div>
					<div className="flex gap-2 items-center">
						<div className="w-4 h-4 bg-primaryBlue rounded-sm"></div>
						<h2 className="font-bold text-lg text-slate-800">Aulas futuras</h2>
					</div>
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