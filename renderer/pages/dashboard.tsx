import { useEffect, useState } from "react";
import { sendEvent } from "../utils/event";
import toast from "react-hot-toast";
import { Layout } from "../components/Layout";
import { monthIdentify, sortFarmattedDates } from "../utils/date";
import dynamic from "next/dynamic";
import { ChevronLeft, ChevronRight } from "lucide-react";
import dayjs from "dayjs";
const Chart = dynamic(() => import('react-apexcharts'), { ssr: false });

function MoneyTable ({ data }) {
    const months = {};

    data.forEach((item) => {
        let month = monthIdentify(item.lecture.lesson.startAt);
        if (!months.hasOwnProperty(month)) {
            months[month] = { amount: 0 };
        }

        let cpf = item.lecture.studentId;

        if (!months[month].hasOwnProperty(cpf)) {
            let name = item.student.name;
            months[month][cpf] = { name, amount: 0, lessons: 0 };
        }

        months[month][cpf].amount += item.lecture.lesson.value;
        months[month][cpf].lessons += 1;
        months[month].amount += item.lecture.lesson.value;
    })

    const monthDates = Object.keys(months);
    monthDates.sort((a, b) => sortFarmattedDates([a, b]));

    monthDates.reverse();

    return (
        <div className="w-full h-4/5 overflow-y-auto">
            {
                monthDates.map((month, index) => {
                    return (
                        <div key={index} className="flex justify-center">
                            <div className="w-2/3 flex flex-col">
                                <div className="flex w-full justify-between p-2 border-b-2 border-b-darkBlue">
                                    <h1 className="font-bold text-xl">{month}</h1>
                                    <h1 className="font-bold text-xl">R${months[month].amount}</h1>
                                </div>
                                {
                                    Object.keys(months[month]).map((student, index) => {
                                        if (student !== "amount") {
                                            return (
                                                <div key={index} className="flex justify-between my-2  w-full p-4 bg-primaryBlue rounded-md shadow-md shadow-slate-400">
                                                    <div className="flex w-2/3">
                                                        <h1 className="w-1/2 text-lg font-bold text-white">{months[month][student].name}</h1>
                                                        <h1 className="text-lg font-bold text-white">{months[month][student].lessons} aula(s)</h1>
                                                    </div>
                                                    <h1 className="text-lg font-bold text-white">R${months[month][student].amount}</h1>
                                                </div>
                                            )
                                        }
                                    })
                                }
                            </div>
                        </div>
                    )
                })
            }
        </div>
    )
}

function MoneyChart ({ data }) {
    const months = {};

    data.forEach((item) => {
        let month = monthIdentify(item.lecture.lesson.startAt);
        if (!months.hasOwnProperty(month)) {
            months[month] = { amount: 0 };
        }

        months[month].amount += item.lecture.lesson.value;
    })

    const monthDates = Object.keys(months);
    monthDates.sort((a, b) => sortFarmattedDates([a, b]));

    let values = [];
    monthDates.map((month) => {
        values.push(months[month].amount);
    })

    const options = {
		chart: {
			id: "money-chart",
			toolbar: {
			  	show: false
		  	},
	  	},
        stroke: {
            width: 3,
        },
        dataLabels: {
            enabled: false, 
        },
        colors: ['#D81CB3'], 
        xaxis: {
            categories: monthDates,
            labels: {
                style: {
                  	fontWeight: 'bold',
                },
            },
        },
        yaxis: {
            labels: {
                style: {
                  	fontWeight: 'bold',
                },
            },
        }
    }

    const series= [{
        name: "valor recebido",
        data: values
    }]

    return (
        <>
            {
                window !== undefined ?
                    <Chart options={options} series={series} height="100%" width="100%" type="line"/>
                :
                    <p>Erro ao carregar gráfico</p>
            }
        </>
    )
}

function DayMoney () {

    const [day, setDay] = useState(dayjs().startOf("day"));
    const [value, setValue] = useState(0);

    function nextDay () {
        setDay(day.add(1, "day"));
    }

    function prevDay () {
        setDay(day.add(-1, "day"));
    }

    useEffect(() => {
        async function fetch () {
            try {
                const { lectures }: any = await sendEvent("find-lectures-by-day", day.format("MM/DD/YYYY"));

                let total = 0;
                lectures.forEach((data: any) => data.lecture.payed ? total+=data.lecture.lesson.value : total+=0);

                setValue(total);
            } catch (error: any) {
                toast.error("Algo deu errado");
                setValue(0);
            } 
        }

        fetch();
    }, [day])

    return (
        <div className="flex items-center">
            <div className="flex">
                <button onClick={prevDay}>
					<ChevronLeft size={30}/>
				</button>
				<h2 className="text-darkBlue text-xl font-bold">Dia {day.format("DD/MM/YYYY")}</h2>
				<button onClick={nextDay}>
					<ChevronRight size={30}/>
				</button>
            </div>
            <h2 className="font-bold text-xl">Valor: R${value}</h2>
        </div>
    )
}

export default function Dashboard () {

    const [data, setData] = useState(true);
    const [loading, setLoading] = useState(true);

    const tabs = ["table", "chart"];

    const [tab, setTab] = useState(tabs[0]);

    const handleSelectTab = (item: string) => {
        setTab(item);
    }

    useEffect(() => {
        const fetch = async () => {
            try {
                const { lectures }: any = await sendEvent("find-lectures-by-months-ago", 10);
                setData(lectures);
                setLoading(false);
            } catch (error) {
                toast.error("Algo deu errado");
            }
        }

        fetch()
    }, [])


    return (
        <Layout.Root>
            <Layout.Header>
                <h1 className="text-3xl font-bold text-darkBlue">Resultados Financeiros</h1>
                <DayMoney/>
            </Layout.Header>
            <Layout.Content>
                <div className="flex h-full flex-col gap-3 items-center">
                    <div className="flex gap-4 rounded-md bg-white shadow-md w-fit">
                        {
                            tabs.map((item, index) => {
                                return (
                                    <div style={{ userSelect: "none" }} onClick={() => handleSelectTab(item)} key={index} className={`${item === tab ? "border-b-2 border-b-darkBlue" : ""} m-2 p-1 hover:bg-slate-400`}>
                                        <h2 className="text-lg font-bold text-darkBlue">{ item === "table" ? "Tabela" : "Gráfico"}</h2>
                                    </div>
                                )
                            })
                        }
                    </div>
                    <div>
                        <h1 className="text-center font-bold text-darkBlue text-xl">Valores recebidos nos últimos 10 meses</h1>
                        <h2 className="text-center font-bold text-darkBlue text-lg">Apenas aulas pagas serão exibidas</h2>
                    </div>
                    <div className="p-2 w-full flex flex-col justify-center h-5/6 ">
                        {
                            loading ? 
                                <p>Loading...</p>
                            :
                                <div className="my-2 w-full h-full">
                                    {
                                        tab === "table" ?  
                                            <MoneyTable data={data}/>
                                        :
                                            <MoneyChart data={data}/>    
                                    }
                                </div>
                            }
                    </div>
                </div>
            </Layout.Content>
        </Layout.Root>
    )
}
