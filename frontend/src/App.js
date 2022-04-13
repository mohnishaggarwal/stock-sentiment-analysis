import './App.css';
import { useEffect, useState } from 'react';
import axios from 'axios';
import ProgressBar from "./components/ProgressBar";
import {
    BarChart,
    Bar,
    Cell,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ReferenceLine,
    ResponsiveContainer,
} from 'recharts';

function classNames(...classes) {
    return classes.filter(Boolean).join(" ");
}

axios.defaults.baseURL = "http://localhost:8000";

function App() {
    const [apiData, setApiData] = useState({});
    const [currIndustry, setCurrIndustry] = useState("");
    const [chartData, setChartData] = useState([]);
    const [avgSentiment, setAvgSentiment] = useState("");
    const [bestIndustry, setBestIndustry] = useState("");
    const [lowestIndustry, setLowestIndustry] = useState("");
    const [mostPositiveTitle, setMostPositiveTitle] = useState("");
    const [mostNegativeTitle, setMostNegativeTitle] = useState("");

    function changeCurrIndustry(newIndustry) {
        setCurrIndustry(newIndustry);
        let chartDataTemp = [];
        for (const [stock, sentiment] of Object.entries(apiData[newIndustry]["stocks"])) {
            chartDataTemp.push({ name: stock, sentiment: sentiment })
        }
        setChartData(chartDataTemp);
        setAvgSentiment(apiData[newIndustry]["avgScore"]);
        setMostPositiveTitle(apiData[newIndustry]["bestTitle"]);
        setMostNegativeTitle(apiData[newIndustry]["worstTitle"]);
    }

    useEffect(() => {
        axios.get("/")
            .then((result) => {
            console.log(result);
            setApiData(result.data);
        })
            .catch(error => console.log(error));
        setCurrIndustry("Technology");
    }, []);

    useEffect(() => {
        if (Object.keys(apiData).length !== 0) {
            let chartDataTemp = [];
            for (const [stock, sentiment] of Object.entries(apiData["Technology"]["stocks"])) {
                chartDataTemp.push({ name: stock, sentiment: sentiment })
            }

            let bestIndustry = "";
            let bestScore = -1;
            let worstIndustry = "";
            let worstScore = 1;
            for (const [industry, industryData] of Object.entries(apiData)) {
                if (industryData["avgScore"] > bestScore) {
                    bestIndustry = industry;
                    bestScore = industryData["avgScore"];
                }
                if (industryData["avgScore"] < worstScore) {
                    worstIndustry = industry;
                    worstScore = industryData["avgScore"];
                }
            }
            setBestIndustry(bestIndustry);
            setLowestIndustry(worstIndustry);

            setChartData(chartDataTemp);
            setAvgSentiment(apiData["Technology"]["avgScore"]);
            setMostPositiveTitle(apiData["Technology"]["bestTitle"]);
            setMostNegativeTitle(apiData["Technology"]["worstTitle"]);
        }
    }, [apiData]);

    return (
        <div className="font-mono mx-4">
            <div className="border-b py-6 px-8 rounded flex justify-between items-center mb-4">
                <h1 className="text-2xl font-medium">Dashboard</h1>
                <div className="flex flex-col mr-24">
                    <div>
                        <span className="text-md font-medium">Highest Sentiment Industry:</span><span className={"text-green-500"}> {bestIndustry}</span>
                    </div>
                    <div>
                        <span className="text-md font-medium">Lowest Sentiment Industry:</span><span className={"text-red-500"}> {lowestIndustry}</span>
                    </div>
                </div>
            </div>
            <div className="flex">
                <div className="w-7/12">
                    <div className="flex justify-evenly items-center my-2 py-2 border-b-2">
                        <p className={classNames(currIndustry === "Technology" ? "text-blue-500 font-bold" : "", "hover:text-gray-700 cursor-pointer")}
                           onClick={() => changeCurrIndustry("Technology")}
                        >
                            Technology
                        </p>
                        <p className={classNames(currIndustry === "Finance" ? "text-blue-500 font-bold" : "", "hover:text-gray-700 cursor-pointer")}
                           onClick={() => changeCurrIndustry("Finance")}
                        >
                            Finance
                        </p>
                        <p className={classNames(currIndustry === "Energy" ? "text-blue-500 font-bold" : "", "hover:text-gray-700 cursor-pointer")}
                           onClick={() => changeCurrIndustry("Energy")}
                        >
                            Energy
                        </p>
                        <p className={classNames(currIndustry === "Retail" ? "text-blue-500 font-bold" : "", "hover:text-gray-700 cursor-pointer")}
                           onClick={() => changeCurrIndustry("Retail")}
                        >
                            Retail
                        </p>
                    </div>
                    <BarChart
                        width={1000}
                        height={700}
                        data={chartData}
                        margin={{
                            top: 5,
                            right: 30,
                            left: 20,
                            bottom: 5,
                        }}
                    >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <Tooltip />
                        <Legend />
                        <ReferenceLine y={0} stroke="#000" />
                        <Bar dataKey="sentiment" fill="#3e7cf0" />
                    </BarChart>
                </div>
                <div className="w-5/12 flex flex-col items-center justify-center my-8">
                    <div className="w-72 h-48 rounded-lg bg-gray-100 flex flex-col justify-center items-center px-4">
                        <h3 className="text-lg text-black mb-2">Sentiment Insights</h3>
                        <span className="text-gray-600 text-sm mb-4">
                            <span>The average sentiment score for {currIndustry} was </span>
                            <span className="text-blue-500 font-bold">{avgSentiment}</span>
                        </span>
                        <ProgressBar value={"0.2"} lowerBound={"-1.0"} upperBound={"1.0"}/>
                    </div>
                    <div className="w-5/12 flex flex-col items-center justify-center my-8">
                        <div className="w-72 h-48 rounded-lg bg-gray-100 flex flex-col justify-center items-center px-4">
                            <h3 className="text-lg text-black mb-2">Positive Title Insights</h3>
                            <span className="text-gray-600 text-sm mb-4">
                            <span>The most positive title in {currIndustry} was </span>
                            <span className="text-green-500 font-bold">{mostPositiveTitle}</span>
                        </span>
                        </div>
                    </div>
                    <div className="w-5/12 flex flex-col items-center justify-center my-8">
                        <div className="w-72 h-48 rounded-lg bg-gray-100 flex flex-col justify-center items-center px-4">
                            <h3 className="text-lg text-black mb-2">Negative Title Insights</h3>
                            <span className="text-gray-600 text-sm mb-4">
                            <span>The most negative title in {currIndustry} was </span>
                            <span className="text-red-500 font-bold">{mostNegativeTitle}</span>
                        </span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default App;
