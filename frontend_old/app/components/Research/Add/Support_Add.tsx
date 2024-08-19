import { Roboto } from 'next/font/google';
import "../../../styles/addPublicationStyles.css";
import React, { useState, FormEvent } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios';

const roboto = Roboto({
    weight: '500',
    subsets: ['latin'],
    display: 'swap',
});

type SupportJSON = {
    year: string,
    facultyName: string,
    conferenceName: string,
    professionalbodyName: string,
    amount: number,
};

export default function AddSupport() {
    const [year, setYear] = useState("");
    const [facultyName, setFacultyName] = useState("");
    const [conferenceName, setConferenceName] = useState("");
    const [professionalbodyName, setProfessionalbodyName] = useState("");
    const [amount, setAmount] = useState(0);

    const handleFacultyBlur = () => {
        if (facultyName && facultyName.trim() !== "") {
            setFacultyName(facultyName.trim());
        }
    };

    const formSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!year || !facultyName || !conferenceName || !professionalbodyName || amount <= 0) {
            alert("All fields are mandatory! Please fill out all required fields.");
            return;
        }

        const json: SupportJSON = {
            year,
            facultyName,
            conferenceName,
            professionalbodyName,
            amount,
        };

        try {
            const response = await axios.post('http://localhost:8080/researchSupport', json);
            if (response.status === 201 || response.status === 200) {
                toast.success('Form submitted successfully', {
                    position: "top-right",
                    autoClose: 5000,
                    hideProgressBar: true,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                });
            } else {
                toast.error('An error occurred. Please try again later.');
            }
        } catch (error) {
            console.error(error);
            toast.error('An error occurred. Please try again later.');
        }
    };

    const handleClearAll = () => {
        setYear("");
        setFacultyName("");
        setConferenceName("");
        setProfessionalbodyName("");
        setAmount(0);
    };

    return (
        <>
            <ToastContainer />
            <div className="bg-[#d5e7eb]">
                <div className="bg-white flex flex-col">
                    <h1 className={`${roboto.className} text-black text-3xl lg:text-3xl mt-7`}>Research Support</h1>
                    <hr className="flex justify-center border-t-2 border-gray-200 mt-7 mb-10" />
                    <form onSubmit={formSubmit}>
                        <div className='flex justify-between gap-5 mb-7'>
                            <div className='relative w-full'>
                                <input
                                    className='peer h-10 w-full border-b-2 border-gray-300 text-gray-900 placeholder-transparent focus:outline-none focus:border-blue-400'
                                    type='text'
                                    autoFocus
                                    placeholder='Year'
                                    required
                                    value={year}
                                    onChange={(e) => setYear(e.target.value)}
                                />
                                <label className='absolute left-0 -top-3.5 text-indigo-700 text-sm font-semibold transition-all peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-500 peer-placeholder-shown:font-normal peer-placeholder-shown:top-2 peer-focus:-top-3.5 peer-focus:text-indigo-700 peer-focus:font-semibold peer-focus:text-sm'>Year</label>
                            </div>
                        </div>
                        <div className='flex justify-between gap-5 mb-7'>
                            <div className='relative w-full'>
                                <input
                                    className='peer h-10 w-full border-b-2 border-gray-300 text-gray-900 placeholder-transparent focus:outline-none focus:border-blue-400'
                                    required
                                    type='text'
                                    placeholder='Faculty Name'
                                    value={facultyName}
                                    onChange={(e) => setFacultyName(e.target.value)}
                                    onBlur={handleFacultyBlur}
                                />
                                <label className='absolute left-0 -top-3.5 text-indigo-700 font-semibold text-sm transition-all peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-500 peer-placeholder-shown:top-2 peer-placeholder-shown:font-normal peer-focus:-top-3.5 peer-focus:text-indigo-700 peer-focus:text-sm peer-focus:font-semibold'>Faculty Name</label>
                            </div>
                        </div>
                        <div className='relative w-full mb-10'>
                            <input
                                className='peer h-10 w-full border-b-2 border-gray-300 text-gray-900 placeholder-transparent focus:outline-none focus:border-blue-400'
                                type='text'
                                placeholder='Conference Name'
                                required
                                value={conferenceName}
                                onChange={(e) => setConferenceName(e.target.value)}
                            />
                            <label className='absolute left-0 -top-3.5 text-indigo-700 font-semibold text-sm transition-all peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-500 peer-placeholder-shown:top-2 peer-placeholder-shown:font-normal peer-focus:-top-3.5 peer-focus:text-indigo-700 peer-focus:text-sm peer-focus:font-semibold'>Conference Name</label>
                        </div>
                        <div className='relative w-full mb-10'>
                            <input
                                className='peer h-10 w-full border-b-2 border-gray-300 text-gray-900 placeholder-transparent focus:outline-none focus:border-blue-400'
                                type='text'
                                placeholder='Professional Body Name'
                                required
                                value={professionalbodyName}
                                onChange={(e) => setProfessionalbodyName(e.target.value)}
                            />
                            <label className='absolute left-0 -top-3.5 text-indigo-700 font-semibold text-sm transition-all peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-500 peer-placeholder-shown:top-2 peer-placeholder-shown:font-normal peer-focus:-top-3.5 peer-focus:text-indigo-700 peer-focus:text-sm peer-focus:font-semibold'>Professional Body Name</label>
                        </div>
                        <div className='relative w-full mb-10'>
                            <input
                                className='peer h-10 w-full border-b-2 border-gray-300 text-gray-900 placeholder-transparent focus:outline-none focus:border-blue-400'
                                type='number'
                                placeholder='Amount'
                                required
                                value={amount}
                                onChange={(e) => setAmount(Number(e.target.value))}
                            />
                            <label className='absolute left-0 -top-3.5 text-indigo-700 font-semibold text-sm transition-all peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-500 peer-placeholder-shown:top-2 peer-placeholder-shown:font-normal peer-focus:-top-3.5 peer-focus:text-indigo-700 peer-focus:text-sm peer-focus:font-semibold'>Amount</label>
                        </div>
                        <div className='flex justify-between gap-5 mb-32'>
                            <div className='relative w-full'>
                                <button
                                    className='bg-gradient-to-r from-[#170a7f] to-[#12075c] text-white font-semibold hover:scale-105 hover:shadow-[0_0_40px_-10px_(0,0,0,1)] hover:shadow-yellow-400 transition duration-300 ease-in-out transform hover:-translate-y-1 hover:text-yellow-400 rounded px-4 py-4'
                                    type="submit"
                                >
                                    Add Support
                                </button>
                                <button
                                    className='ml-6 bg-gradient-to-r from-red-700 to-red-800 text-white font-semibold hover:scale-105 hover:shadow-[0_0_40px_-10px_(0,0,0,1)] hover:shadow-yellow-400 transition duration-300 ease-in-out transform hover:-translate-y-1 hover:text-yellow-400 rounded px-6 py-4'
                                    onClick={handleClearAll}
                                >
                                    Clear All
                                </button>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </>
    );
}
