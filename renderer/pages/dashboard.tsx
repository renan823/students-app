import { useEffect, useState } from "react";
import { Layout } from "../components/Layout"
import Chart from "react-apexcharts";
import { sendEvent } from "../../utils/api";
import { toast } from "react-hot-toast";
import { monthIdentify, sortFarmattedDates } from "../../utils/date";

const MoneyChart = ({ data }) => {

    const months = {};

    data.forEach((item) => {
        let month = monthIdentify(item.lesson.startAt);
        if (!months.hasOwnProperty(month)) {
            months[month] = { amount: 0 };
        }

        months[month].amount += item.lesson.value;
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
        <Chart options={options} series={series} height="100%" width="100%" type="line"/>
    )
}

const MoneyTable = ({ data }) => {

    const months = {};

    data.forEach((item) => {
        let month = monthIdentify(item.lesson.startAt);
        if (!months.hasOwnProperty(month)) {
            months[month] = { amount: 0 };
        }

        let cpf = item.user_cpf;

        if (!months[month].hasOwnProperty(cpf)) {
            let name = item.user.name;
            months[month][cpf] = { name, amount: 0, lessons: 0 };
        }

        months[month][cpf].amount += item.lesson.value;
        months[month][cpf].lessons += 1;
        months[month].amount += item.lesson.value;
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
                                    Object.keys(months[month]).map((student) => {
                                        if (student !== "amount") {
                                            return (
                                                <div className="flex justify-between my-2  w-full p-4 bg-primaryBlue rounded-md shadow-md shadow-slate-400">
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
                const result: any = await sendEvent("find-lectures-last-ten-months");
                setData(result);
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
