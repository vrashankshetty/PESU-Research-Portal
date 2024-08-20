import { Roboto } from 'next/font/google';
import { Quicksand } from 'next/font/google';
import { useState, useRef, useCallback, useEffect } from 'react';
import axios from 'axios';
import { DownloadTableExcel } from 'react-export-table-to-excel';

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

type PatentJSON = {
    facultyName: string;
    patentNumber: string;
    patentTitle: string;
    patentPublish: string;
    link: string;
};

export default function PatentsCompare() {
    const [patents, setPatents] = useState<PatentJSON[]>([]);
    const [selectedPatents, setSelectedPatents] = useState<PatentJSON[]>([]);
    const tableRef = useRef(null);

    useEffect(() => {
        fetchPatents();
    }, []);

    const fetchPatents = async () => {
        try {
            const response = await axios.get('http://localhost:8080/patent');
            setPatents(response.data);
        } catch (error) {
            console.error("Error fetching patents:", error);
        }
    }

    const handleDownloadData = useCallback(() => {
        if (tableRef.current) {
            const link = document.createElement("a");
            link.download = "patents_data.xlsx";
            link.href = tableRef.current;
            link.click();
        }
    }, [])

    return (
        <div className="bg-[#d5e7eb]">
            <div className="bg-white flex flex-col">
                <h1 className={`${roboto.className} text-black text-3xl md:text-3xl lg:text-3xl mt-16 md:mt-7`}>Patents Overview</h1>
                <hr className="flex justify-center border-t-2 border-gray-200 mt-7 mb-10" />

                <div className='bg-gray-50 shadow-lg rounded-2xl w-[100%] p-3 md:p-8'>
                    <div className={`${roboto.className} text-black text-2xl`}>
                        Patents Information
                    </div>

                    <div className='flex justify-end mb-4 gap-2'>
                        <div className="p-2 px-4 text-gray-500 border-gray-100 border-2 rounded-xl hover:border-gray-400 hover:cursor-pointer shadow-md w-max">
                            <DownloadTableExcel
                                filename="patents_data"
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
                                    <th className='p-3 text-sm font-semibold tracking-wide text-left'>Faculty Name</th>
                                    <th className='p-3 text-sm font-semibold tracking-wide text-left'>Patent Number</th>
                                    <th className='p-3 text-sm font-semibold tracking-wide text-left'>Patent Title</th>
                                    <th className='p-3 text-sm font-semibold tracking-wide text-left'>Patent Publish</th>
                                    <th className='p-3 text-sm font-semibold tracking-wide text-left'>Link</th>
                                </tr>
                            </thead>
                            <tbody className='divide-y divide-gray-100'>
                                {patents.map((patent, index) => (
                                    <tr key={index}>
                                        <td className='p-3 text-sm text-gray-700 whitespace-nowrap'>{patent.facultyName}</td>
                                        <td className='p-3 text-sm text-gray-700 whitespace-nowrap'>{patent.patentNumber}</td>
                                        <td className='p-3 text-sm text-gray-700 whitespace-nowrap'>{patent.patentTitle}</td>
                                        <td className='p-3 text-sm text-gray-700 whitespace-nowrap'>{patent.patentPublish}</td>
                                        <td className='p-3 text-sm text-gray-700 whitespace-nowrap'>
                                            <a href={patent.link} target="_blank" rel="noopener noreferrer" className="text-blue-500 underline">View</a>
                                        </td>
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
