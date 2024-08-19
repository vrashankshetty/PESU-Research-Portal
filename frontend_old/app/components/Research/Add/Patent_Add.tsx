import { Roboto } from 'next/font/google';
import '../../../styles/addPublicationStyles.css';
import React, { useState, FormEvent } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios';

const roboto = Roboto({
    weight: '500',
    subsets: ['latin'],
    display: 'swap',
});

type PatentJSON = {
    facultyName: string;
    patentNumber: string;
    patentTitle: string;
    patentPublish: string;
    link: string;
};

export default function AddPatent() {
    const [facultyName, setFacultyName] = useState('');
    const [patentNumber, setPatentNumber] = useState('');
    const [patentTitle, setPatentTitle] = useState('');
    const [patentPublish, setPatentPublish] = useState('');
    const [links, setLinks] = useState('');

    const handleLinksChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setLinks(e.target.value);
    };

    const formSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (!facultyName || !patentNumber || !patentTitle || !patentPublish || !links) {
            toast.error('All fields are mandatory!');
            return;
        }

        const json: PatentJSON = {
            facultyName,
            patentNumber,
            patentTitle,
            patentPublish,
            link: links,
        };

        try {
            const response = await axios.post('http://localhost:8080/patent', json, {
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            if (response.status === 201 || response.status === 200) {
                toast.success('Form submitted successfully', {
                    position: 'top-right',
                    autoClose: 5000,
                    hideProgressBar: true,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                });
                handleClearAll();  // Clear the form on successful submission
            } else {
                toast.error('An error occurred. Please try again later.');
            }
        } catch (error) {
            console.error(error);
            toast.error('An error occurred. Please try again later.');
        }
    };

    const handleClearAll = () => {
        setFacultyName('');
        setPatentNumber('');
        setPatentTitle('');
        setPatentPublish('');
        setLinks('');
    };

    return (
        <>
            <ToastContainer />
            <div className="bg-[#d5e7eb]">
                <div className="bg-white flex flex-col">
                    <h1 className={`${roboto.className} text-black text-3xl lg:text-3xl mt-7`}>Add Patent</h1>
                    <hr className="flex justify-center border-t-2 border-gray-200 mt-7 mb-10" />
                    <form onSubmit={formSubmit}>
                        <div className='flex justify-between gap-5 mb-7'>
                            <div className='relative w-full'>
                                <input
                                    className='peer h-10 w-full border-b-2 border-gray-300 text-gray-900 placeholder-transparent focus:outline-none focus:border-blue-400'
                                    type='text'
                                    placeholder='Faculty Name'
                                    required
                                    value={facultyName}
                                    onChange={(e) => setFacultyName(e.target.value)}
                                />
                                <label className='absolute left-0 -top-3.5 text-indigo-700 text-sm font-semibold transition-all peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-500 peer-placeholder-shown:font-normal peer-placeholder-shown:top-2 peer-focus:-top-3.5 peer-focus:text-indigo-700 peer-focus:font-semibold peer-focus:text-sm'>
                                    Faculty Name
                                </label>
                            </div>
                        </div>
                        <div className='flex justify-between gap-5 mb-7'>
                            <div className='relative w-full'>
                                <input
                                    className='peer h-10 w-full border-b-2 border-gray-300 text-gray-900 placeholder-transparent focus:outline-none focus:border-blue-400'
                                    type='text'
                                    placeholder='Patent Number'
                                    required
                                    value={patentNumber}
                                    onChange={(e) => setPatentNumber(e.target.value)}
                                />
                                <label className='absolute left-0 -top-3.5 text-indigo-700 text-sm font-semibold transition-all peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-500 peer-placeholder-shown:font-normal peer-placeholder-shown:top-2 peer-focus:-top-3.5 peer-focus:text-indigo-700 peer-focus:font-semibold peer-focus:text-sm'>
                                    Patent Number
                                </label>
                            </div>
                        </div>
                        <div className='flex justify-between gap-5 mb-7'>
                            <div className='relative w-full'>
                                <input
                                    className='peer h-10 w-full border-b-2 border-gray-300 text-gray-900 placeholder-transparent focus:outline-none focus:border-blue-400'
                                    type='text'
                                    placeholder='Patent Title'
                                    required
                                    value={patentTitle}
                                    onChange={(e) => setPatentTitle(e.target.value)}
                                />
                                <label className='absolute left-0 -top-3.5 text-indigo-700 text-sm font-semibold transition-all peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-500 peer-placeholder-shown:font-normal peer-placeholder-shown:top-2 peer-focus:-top-3.5 peer-focus:text-indigo-700 peer-focus:font-semibold peer-focus:text-sm'>
                                    Patent Title
                                </label>
                            </div>
                        </div>
                        <div className='relative w-full mb-10'>
                            <input
                                className='peer h-10 w-full border-b-2 border-gray-300 text-gray-900 placeholder-transparent focus:outline-none focus:border-blue-400'
                                type='text'
                                placeholder='Patent Publish'
                                required
                                value={patentPublish}
                                onChange={(e) => setPatentPublish(e.target.value)}
                            />
                            <label className='absolute left-0 -top-3.5 text-indigo-700 font-semibold text-sm transition-all peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-500 peer-placeholder-shown:top-2 peer-placeholder-shown:font-normal peer-focus:-top-3.5 peer-focus:text-indigo-700 peer-focus:text-sm peer-focus:font-semibold'>
                                Patent Publish
                            </label>
                        </div>
                        <div className='relative w-full mb-7'>
                            <input
                                className='peer h-10 w-full border-b-2 border-gray-300 text-gray-900 placeholder-transparent focus:outline-none focus:border-blue-400'
                                type='text'
                                placeholder='Patent Links'
                                required
                                value={links}
                                onChange={handleLinksChange}
                            />
                            <label className='absolute left-0 -top-3.5 text-indigo-700 font-semibold text-sm transition-all peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-500 peer-placeholder-shown:top-2 peer-placeholder-shown:font-normal peer-focus:-top-3.5 peer-focus:text-indigo-700 peer-focus:text-sm peer-focus:font-semibold'>
                                Patent Links
                            </label>
                        </div>
                        <div className='relative flex-row items-center w-full justify-center md:w-1/2 mx-auto mb-10'>
                            <div className='flex justify-between gap-5 mb-32'>
                                <button
                                    className='bg-gradient-to-r from-[#170a7f] to-[#12075c] text-white font-semibold hover:scale-105 hover:shadow-[0_0_40px_-10px_(0,0,0,1)] hover:shadow-yellow-400 transition duration-300 ease-in-out transform hover:-translate-y-1 hover:text-yellow-400 rounded px-4 py-4'
                                    type="submit"
                                >
                                    Add Patent
                                </button>
                                <button
                                    className='ml-6 bg-gradient-to-r from-red-700 to-red-800 text-white font-semibold hover:scale-105 hover:shadow-[0_0_40px_-10px_(0,0,0,1)] hover:shadow-yellow-400 transition duration-300 ease-in-out transform hover:-translate-y-1 hover:text-yellow-400 rounded px-6 py-4'
                                    type="button"
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
