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

type JournalJSON = {
    title: string,
    authorName: string,
    teacherDepartment: string,
    journalName: string,
    publicationYear: string,
    issnNumber: string,
    linkWebsite: string,
    linkDocs: string,
    isListed: boolean,
    abstract: string,
    keywords: string,
    titleDomain: string,
}

interface ChartDataInf {
    labels: string[],
    datasets: {
        label: string,
        data: number[],
        backgroundColor: string[]
    }[]
}

export default function JournalsCompare() {
    const [allJournals, setAllJournals] = useState<JournalJSON[]>([]);
    const [year1, setYear1] = useState<string>('');
    const [year2, setYear2] = useState<string>('');
    const [journalsCount1, setJournalsCount1] = useState<{ [key: string]: number }>({});
    const [journalsCount2, setJournalsCount2] = useState<{ [key: string]: number }>({});
    const [selectedYearJournals, setSelectedYearJournals] = useState<JournalJSON[]>([]);
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
        responsive: true,
        maxBarThickness: 20,
    });
    let ref = useRef<ChartJS<'bar'>>(null);
    let tableRef = useRef(null);

    useEffect(() => {
        fetchJournals();
    }, []);

    const fetchJournals = async () => {
        try {
            const response = await axios.get('http://localhost:8080/journal');
            setAllJournals(response.data);
            console.log("Response:", response.data)
        } catch (error) {
            console.error("Error fetching journals:", error);
        }
    }

    const handleYearComparison = () => {
        const journals1 = allJournals.filter(journal => journal.publicationYear === year1);
        const journals2 = allJournals.filter(journal => journal.publicationYear === year2);

        console.log("journals1", journals1)
        console.log("journals2", journals2)

        const count1 = countJournalsByDepartment(journals1);
        const count2 = countJournalsByDepartment(journals2);

        setJournalsCount1(count1);
        setJournalsCount2(count2);

        updateChartData(count1, count2);

        setSelectedYearJournals([...journals1, ...journals2]);
    }

    const countJournalsByDepartment = (journals: JournalJSON[]) => {
        return journals.reduce((acc, journal) => {
            acc[journal.teacherDepartment] = (acc[journal.teacherDepartment] || 0) + 1;
            return acc;
        }, {} as { [key: string]: number });
    }

    const updateChartData = (count1: { [key: string]: number }, count2: { [key: string]: number }) => {
        const departments = Array.from(new Set([...Object.keys(count1), ...Object.keys(count2)]));

        setChartData({
            labels: departments,
            datasets: [
                {
                    label: `Year ${year1}`,
                    data: departments.map(dept => count1[dept] || 0),
                    backgroundColor: ['#fe1966'],
                },
                {
                    label: `Year ${year2}`,
                    data: departments.map(dept => count2[dept] || 0),
                    backgroundColor: ['#004aac'],
                },
            ]
        });
    }

    const handleDownloadGraph = useCallback(() => {
        if (ref.current) {
            const link = document.createElement("a");
            link.download = "journals_comparison.png";
            link.href = ref.current.toBase64Image();
            link.click();
        }
    }, [])

    return (
        <div className="bg-[#d5e7eb]">
            <div className="bg-white flex flex-col">
                <h1 className={`${roboto.className} text-black text-3xl md:text-3xl lg:text-3xl mt-16 md:mt-7`}>Compare Journals</h1>
                <hr className="flex justify-center border-t-2 border-gray-200 mt-7 mb-10" />
                <div className='bg-gray-50 shadow-lg rounded-2xl w-[100%] p-3 md:p-8'>
                    <div className={`${roboto.className} text-black text-2xl`}>
                        Journals Overview
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
                                filename="journals_comparison"
                                sheet="sheet 1"
                                currentTableRef={tableRef.current}
                            >
                                <div className='flex justify-between gap-2'>
                                    <button>Export Data</button>
                                    <div>
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-6">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="m9 13.5 3 3m0 0 3-3m-3 3v-6m1.06-4.19-2.12-2.12a1.5 1.5 0 0 0-1.061-.44H4.5A2.25 2.25 0 0 0 2.25 6v12a2.25 2.25 0 0 0 2.25 2.25h15A2.25 2.25 0 0 0 21.75 18V9a2.25 2.25 0 0 0-2.25-2.25h-5.379a1.5 1.5 0 0 1-1.06-.44Z" />
                                        </svg>
                                    </div>
                                </div>
                            </DownloadTableExcel>
                        </div>
                    </div>
                    <div className='overflow-auto rounded-lg shadow-lg hidden md:block mb-5'>
                        <table className='w-full text-black' ref={tableRef}>
                            <thead className='bg-gray-100 border-b-2 border-gray-200'>
                                <tr>
                                    <th className='p-3 text-sm font-semibold tracking-wide text-left'>Department</th>
                                    <th className='p-3 text-sm font-semibold tracking-wide text-left'>{year1}</th>
                                    <th className='p-3 text-sm font-semibold tracking-wide text-left'>{year2}</th>
                                </tr>
                            </thead>
                            <tbody className='divide-y divide-gray-100'>
                                {Object.keys(journalsCount1).map(department => (
                                    <tr key={department}>
                                        <td className='p-3 text-sm text-gray-700 whitespace-nowrap'>{department}</td>
                                        <td className='p-3 text-sm text-gray-700 whitespace-nowrap'>{journalsCount1[department] || 0}</td>
                                        <td className='p-3 text-sm text-gray-700 whitespace-nowrap'>{journalsCount2[department] || 0}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    <div className='w-full md:col-span-2 h-[50vh] mb-2 md:m-auto p-4 rounded-lg bg-white shadow-md'>
                        <Bar data={chartData} ref={ref} options={chartOptions} />
                    </div>

                    <div className={`${roboto.className} text-black text-2xl mt-8 mb-4`}>
                        Detailed Journals Information
                    </div>
                    <div className='overflow-auto rounded-lg shadow-lg hidden md:block mb-5'>
                        <table className='w-full text-black'>
                            <thead className='bg-gray-100 border-b-2 border-gray-200'>
                                <tr>
                                    <th className='p-3 text-sm font-semibold tracking-wide text-left'>Year</th>
                                    <th className='p-3 text-sm font-semibold tracking-wide text-left'>Title</th>
                                    <th className='p-3 text-sm font-semibold tracking-wide text-left'>Author Name</th>
                                    <th className='p-3 text-sm font-semibold tracking-wide text-left'>Department</th>
                                    <th className='p-3 text-sm font-semibold tracking-wide text-left'>Journal Name</th>
                                    <th className='p-3 text-sm font-semibold tracking-wide text-left'>ISSN Number</th>
                                    <th className='p-3 text-sm font-semibold tracking-wide text-left'>Listed</th>
                                    <th className='p-3 text-sm font-semibold tracking-wide text-left'>Abstract</th>
                                    <th className='p-3 text-sm font-semibold tracking-wide text-left'>Keywords</th>
                                    <th className='p-3 text-sm font-semibold tracking-wide text-left'>Title Domain</th>
                                </tr>
                            </thead>
                            <tbody className='divide-y divide-gray-100'>
                                {selectedYearJournals.map((journal, index) => (
                                    <tr key={index}>
                                        <td className='p-3 text-sm text-gray-700 whitespace-nowrap'>{journal.publicationYear}</td>
                                        <td className='p-3 text-sm text-gray-700 whitespace-nowrap'>{journal.title}</td>
                                        <td className='p-3 text-sm text-gray-700 whitespace-nowrap'>{journal.authorName}</td>
                                        <td className='p-3 text-sm text-gray-700 whitespace-nowrap'>{journal.teacherDepartment}</td>
                                        <td className='p-3 text-sm text-gray-700 whitespace-nowrap'>{journal.journalName}</td>
                                        <td className='p-3 text-sm text-gray-700 whitespace-nowrap'>{journal.issnNumber}</td>
                                        <td className='p-3 text-sm text-gray-700 whitespace-nowrap'>{journal.isListed ? 'Yes' : 'No'}</td>
                                        <td className='p-3 text-sm text-gray-700 whitespace-nowrap'>{journal.abstract}</td>
                                        <td className='p-3 text-sm text-gray-700 whitespace-nowrap'>{journal.keywords}</td>
                                        <td className='p-3 text-sm text-gray-700 whitespace-nowrap'>{journal.titleDomain}</td>
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