import { Roboto } from 'next/font/google';
import { Quicksand } from 'next/font/google';
import { useState, useRef, useCallback, useEffect } from 'react';
import axios from 'axios';
import { Bar } from 'react-chartjs-2';
import { DownloadTableExcel } from 'react-export-table-to-excel';

import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Tooltip,
    Legend,
} from 'chart.js';

ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Tooltip,
    Legend
);

const roboto = Roboto({
    weight: '500',
    subsets: ['latin'],
    display: 'swap',
})

const quicksand = Quicksand({
    weight: '500',
    subsets: ['latin'],
    display: 'swap',
})

type ConferenceJSON = {
    facultyName: string,
    titleBook: string,
    titlePaper: string,
    titleConference: string,
    publicationYear: string,
    issnNumber: string,
    isSameInstitution: boolean,
    publisherName: string
}

interface ChartDataInf {
    labels: string[],
    datasets: {
        label: string,
        data: number[],
        backgroundColor: string[]
    }[]
}

export default function ConferencesCompare() {
    const [allConferences, setAllConferences] = useState<ConferenceJSON[]>([]);
    const [year1, setYear1] = useState<string>('');
    const [year2, setYear2] = useState<string>('');
    const [conferencesCount1, setConferencesCount1] = useState<{ [key: string]: number }>({});
    const [conferencesCount2, setConferencesCount2] = useState<{ [key: string]: number }>({});
    const [selectedYearConferences, setSelectedYearConferences] = useState<ConferenceJSON[]>([]);
    const [chartData, setChartData] = useState<ChartDataInf>({
        labels: [],
        datasets: [],
    });
    const [chartOptions, setChartOptions] = useState<any>({
        plugins: {
            legend: {
                position: 'top' as const,
            },
        },
        maintainAspectRatio: false,
        responsive: true
    });
    let ref = useRef<ChartJS<'bar'>>(null);
    let tableRef = useRef(null);

    useEffect(() => {
        fetchConferences();
    }, []);

    const fetchConferences = async () => {
        try {
            const response = await axios.get('http://localhost:8080/conference');
            setAllConferences(response.data);
            console.log("Response:", response.data);
        } catch (error) {
            console.error("Error fetching conferences:", error);
        }
    }

    const handleYearComparison = () => {
        const conferences1 = allConferences.filter(conference => conference.publicationYear === year1);
        const conferences2 = allConferences.filter(conference => conference.publicationYear === year2);

        console.log("conferences1", conferences1);
        console.log("conferences2", conferences2);

        const count1 = countConferencesByInstitution(conferences1);
        const count2 = countConferencesByInstitution(conferences2);

        setConferencesCount1(count1);
        setConferencesCount2(count2);

        updateChartData(count1, count2);

        setSelectedYearConferences([...conferences1, ...conferences2]);
    }

    const countConferencesByInstitution = (conferences: ConferenceJSON[]) => {
        return conferences.reduce((acc, conference) => {
            const key = conference.isSameInstitution ? 'Same Institution' : 'Different Institution';
            acc[key] = (acc[key] || 0) + 1;
            return acc;
        }, {} as { [key: string]: number });
    }

    const updateChartData = (count1: { [key: string]: number }, count2: { [key: string]: number }) => {
        const categories = Array.from(new Set([...Object.keys(count1), ...Object.keys(count2)]));

        setChartData({
            labels: categories,
            datasets: [
                {
                    label: `Year ${year1}`,
                    data: categories.map(cat => count1[cat] || 0),
                    backgroundColor: ['#fe1966'],
                },
                {
                    label: `Year ${year2}`,
                    data: categories.map(cat => count2[cat] || 0),
                    backgroundColor: ['#004aac'],
                },
            ]
        });
    }

    const handleDownloadGraph = useCallback(() => {
        if (ref.current) {
            const link = document.createElement("a");
            link.download = "conferences_comparison.png";
            link.href = ref.current.toBase64Image();
            link.click();
        }
    }, [])

    return (
        <div className="bg-[#d5e7eb]">
            <div className="bg-white flex flex-col">
                <h1 className={`${roboto.className} text-black text-3xl md:text-3xl lg:text-3xl mt-16 md:mt-7`}>Compare Conferences</h1>
                <hr className="flex justify-center border-t-2 border-gray-200 mt-7 mb-10" />
                <div className='bg-gray-50 shadow-lg rounded-2xl w-[100%] p-3 md:p-8'>
                    <div className={`${roboto.className} text-black text-2xl`}>
                        Conferences Overview
                    </div>
                    <div className='flex flex-row justify-between mt-5 mb-2'>
                        <div>
                            <input
                                className={`${quicksand.className} text-gray-500 border-2 border-gray-100 focus:outline-none focus:border-gray-400 p-2 rounded-xl shadow-md hover:cursor-pointer text-[0.7rem] lg:text-[1rem]`}
                                required
                                type='text'
                                id='year1'
                                placeholder='Year 1'
                                value={year1}
                                onChange={(e) => setYear1(e.target.value)}
                            />
                        </div>
                        <div>
                            <input
                                className={`${quicksand.className} text-gray-500 border-2 border-gray-100 focus:outline-none focus:border-gray-400 p-2 rounded-xl shadow-md hover:cursor-pointer text-[0.7rem] lg:text-[1rem]`}
                                required
                                type='text'
                                id='year2'
                                placeholder='Year 2'
                                value={year2}
                                onChange={(e) => setYear2(e.target.value)}
                            />
                        </div>
                    </div>
                    <div className='flex flex-row items-center gap-2 mb-20 p-1 px-2 md:p-2 text-gray-500 border-gray-100 border-2 rounded-xl hover:border-gray-400 hover:cursor-pointer shadow-md w-max' onClick={handleYearComparison}>
                        <div>Compare</div>
                        <div>
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-5 h-5 md:w-6 md:h-6">
                                <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
                            </svg>
                        </div>
                    </div>

                    <div className='flex justify-end mb-4 gap-2'>
                        <div className='flex justify-between gap-2 p-2 px-4 text-gray-500 border-gray-100 border-2 rounded-xl hover:border-gray-400 hover:cursor-pointer shadow-md w-max' onClick={handleDownloadGraph}>
                            <div>Download Graph</div>
                            <div>
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-6">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5M16.5 12 12 16.5m0 0L7.5 12m4.5 4.5V3" />
                                </svg>
                            </div>
                        </div>
                        <div className="p-2 px-4 text-gray-500 border-gray-100 border-2 rounded-xl hover:border-gray-400 hover:cursor-pointer shadow-md w-max">
                            <DownloadTableExcel
                                filename="conferences_comparison"
                                sheet="sheet 1"
                                currentTableRef={tableRef.current}
                            >
                                <div className='flex justify-between gap-2'>
                                    <button>Export Data</button>
                                    <div>
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-6 h-6">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 15a7.5 7.5 0 1 0-15 0 7.5 7.5 0 0 0 15 0ZM12 9v6m3-3H9" />
                                        </svg>
                                    </div>
                                </div>
                            </DownloadTableExcel>
                        </div>
                    </div>

                    <div className='flex flex-col md:flex-row md:gap-4 mb-5'>
                        <div className='bg-gray-100 p-4 shadow-md rounded-xl w-full md:w-1/2'>
                            <Bar
                                ref={ref}
                                data={chartData}
                                options={chartOptions}
                                height={350}
                            />
                        </div>
                        <div className='flex flex-col gap-3 bg-white shadow-md rounded-xl w-full md:w-1/2 p-3'>
                            <h2 className='text-lg font-bold'>Year {year1} - Count</h2>
                            <ul className='list-disc pl-5'>
                                {Object.entries(conferencesCount1).map(([key, value]) => (
                                    <li key={key} className='text-sm text-gray-600'>{key}: {value}</li>
                                ))}
                            </ul>
                            <h2 className='text-lg font-bold'>Year {year2} - Count</h2>
                            <ul className='list-disc pl-5'>
                                {Object.entries(conferencesCount2).map(([key, value]) => (
                                    <li key={key} className='text-sm text-gray-600'>{key}: {value}</li>
                                ))}
                            </ul>
                        </div>
                    </div>

                    <div className='overflow-x-auto'>
                        <table className='table-auto w-full border-separate border-spacing-0'>
                            <thead className='bg-gray-100 border-b-2 border-gray-200'>
                                <tr>
                                    <th className='p-3 text-sm font-semibold tracking-wide text-left'>Year</th>
                                    <th className='p-3 text-sm font-semibold tracking-wide text-left'>Title of Paper</th>
                                    <th className='p-3 text-sm font-semibold tracking-wide text-left'>Faculty Name</th>
                                    <th className='p-3 text-sm font-semibold tracking-wide text-left'>Title of Conference</th>
                                    <th className='p-3 text-sm font-semibold tracking-wide text-left'>Publisher Name</th>
                                    <th className='p-3 text-sm font-semibold tracking-wide text-left'>ISSN Number</th>
                                    <th className='p-3 text-sm font-semibold tracking-wide text-left'>Same Institution</th>
                                </tr>
                            </thead>
                            <tbody className='divide-y divide-gray-100'>
                                {selectedYearConferences.map((conference, index) => (
                                    <tr key={index}>
                                        <td className='p-3 text-sm text-gray-700 whitespace-nowrap'>{conference.publicationYear}</td>
                                        <td className='p-3 text-sm text-gray-700 whitespace-nowrap'>{conference.titlePaper}</td>
                                        <td className='p-3 text-sm text-gray-700 whitespace-nowrap'>{conference.facultyName}</td>
                                        <td className='p-3 text-sm text-gray-700 whitespace-nowrap'>{conference.titleConference}</td>
                                        <td className='p-3 text-sm text-gray-700 whitespace-nowrap'>{conference.publisherName}</td>
                                        <td className='p-3 text-sm text-gray-700 whitespace-nowrap'>{conference.issnNumber}</td>
                                        <td className='p-3 text-sm text-gray-700 whitespace-nowrap'>{conference.isSameInstitution ? 'Yes' : 'No'}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    )
}
