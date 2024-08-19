import { Roboto } from 'next/font/google';
import "../../../styles/addPublicationStyles.css";
import React, { useState, FormEvent } from "react";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios';

const roboto = Roboto({
    weight: '500',
    subsets: ['latin'],
    display: 'swap',
});

export default function AddJournal() {
    const [title, setTitle] = useState("");
    const [authorName, setAuthorName] = useState("");
    const [teacherDepartment, setTeacherDepartment] = useState("");
    const [journalName, setJournalName] = useState("");
    const [publicationYear, setPublicationYear] = useState("");
    const [issnNumber, setIssnNumber] = useState("");
    const [linkWebsite, setLinkWebsite] = useState("");
    const [linkDocs, setLinkDocs] = useState("");
    const [isListed, setIsListed] = useState(false);
    const [linkToRe, setLinkToRe] = useState("");

    const formSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (isListed && !linkToRe) {
            toast.error('Please provide the link to research when "Is Listed" is true.');
            return;
        }

        if (!isListed && linkToRe) {
            toast.error('Link to research should not be provided when "Is Listed" is false.');
            return;
        }

        const json = {
            title,
            authorName,
            teacherDepartment,
            journalName,
            publicationYear,
            issnNumber,
            linkWebsite,
            linkDocs,
            isListed,
            linkToRe
        };

        try {
            const response = await axios.post('http://localhost:8080/journal', json);
            if (response.status === 201 || response.status === 200) {
                toast.success('Form submitted successfully', {
                    position: "top-right",
                    autoClose: 5000,
                    hideProgressBar: true,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                });
                handleClearAll();
            } else {
                toast.error('An error occurred. Please try again later.');
            }
        } catch (error) {
            console.error(error);
            toast.error('An error occurred. Please try again later.');
        }
    }

    const handleClearAll = () => {
        setTitle("");
        setAuthorName("");
        setTeacherDepartment("");
        setJournalName("");
        setPublicationYear("");
        setIssnNumber("");
        setLinkWebsite("");
        setLinkDocs("");
        setIsListed(false);
        setLinkToRe("");
    }

    return (
        <>
            <ToastContainer />
            <div className="bg-[#d5e7eb]">
                <div className="bg-white flex flex-col">
                    <h1 className={`${roboto.className} text-black text-3xl lg:text-3xl mt-7`}>Journal</h1>
                    <hr className="flex justify-center border-t-2 border-gray-200 mt-7 mb-10" />
                    <form onSubmit={formSubmit}>
                        <div className='flex flex-col gap-5 mb-7'>
                            <div className='relative w-full'>
                                <input
                                    className='peer h-10 w-full border-b-2 border-gray-300 text-gray-900 placeholder-transparent focus:outline-none focus:border-blue-400'
                                    type='text'
                                    autoFocus
                                    placeholder='Title'
                                    required
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                />
                                <label className='absolute left-0 -top-3.5 text-indigo-700 text-sm font-semibold transition-all peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-500 peer-placeholder-shown:font-normal peer-placeholder-shown:top-2 peer-focus:-top-3.5 peer-focus:text-indigo-700 peer-focus:font-semibold peer-focus:text-sm'>Title</label>
                            </div>
                        </div>

                        <div className='relative w-full mb-7'>
                            <input
                                className='peer h-10 w-full border-b-2 border-gray-300 text-gray-900 placeholder-transparent focus:outline-none focus:border-blue-400'
                                type='text'
                                placeholder='Authors (Comma Separated)'
                                value={authorName}
                                onChange={(e) => setAuthorName(e.target.value)}
                            />
                            <label className='absolute left-0 -top-3.5 text-indigo-700 text-sm font-semibold transition-all peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-500 peer-placeholder-shown:font-normal peer-placeholder-shown:top-2 peer-focus:-top-3.5 peer-focus:text-indigo-700 peer-focus:font-semibold peer-focus:text-sm'>Authors</label>
                        </div>

                        <div className='relative w-full mb-7'>
                            <input
                                className='peer h-10 w-full border-b-2 border-gray-300 text-gray-900 placeholder-transparent focus:outline-none focus:border-blue-400'
                                type='text'
                                placeholder='Teacher Department'
                                required
                                value={teacherDepartment}
                                onChange={(e) => setTeacherDepartment(e.target.value)}
                            />
                            <label className='absolute left-0 -top-3.5 text-indigo-700 text-sm font-semibold transition-all peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-500 peer-placeholder-shown:font-normal peer-placeholder-shown:top-2 peer-focus:-top-3.5 peer-focus:text-indigo-700 peer-focus:font-semibold peer-focus:text-sm'>Teacher Department</label>
                        </div>

                        <div className='relative w-full mb-7'>
                            <input
                                className='peer h-10 w-full border-b-2 border-gray-300 text-gray-900 placeholder-transparent focus:outline-none focus:border-blue-400'
                                type='text'
                                placeholder='Journal Name'
                                required
                                value={journalName}
                                onChange={(e) => setJournalName(e.target.value)}
                            />
                            <label className='absolute left-0 -top-3.5 text-indigo-700 text-sm font-semibold transition-all peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-500 peer-placeholder-shown:font-normal peer-placeholder-shown:top-2 peer-focus:-top-3.5 peer-focus:text-indigo-700 peer-focus:font-semibold peer-focus:text-sm'>Journal Name</label>
                        </div>

                        <div className='relative w-full mb-7'>
                            <input
                                className='peer h-10 w-full border-b-2 border-gray-300 text-gray-900 placeholder-transparent focus:outline-none focus:border-blue-400'
                                type='text'
                                placeholder='Publication Year'
                                required
                                value={publicationYear}
                                onChange={(e) => setPublicationYear(e.target.value)}
                            />
                            <label className='absolute left-0 -top-3.5 text-indigo-700 text-sm font-semibold transition-all peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-500 peer-placeholder-shown:font-normal peer-placeholder-shown:top-2 peer-focus:-top-3.5 peer-focus:text-indigo-700 peer-focus:font-semibold peer-focus:text-sm'>Publication Year</label>
                        </div>

                        <div className='relative w-full mb-7'>
                            <input
                                className='peer h-10 w-full border-b-2 border-gray-300 text-gray-900 placeholder-transparent focus:outline-none focus:border-blue-400'
                                type='text'
                                placeholder='ISSN Number'
                                required
                                value={issnNumber}
                                onChange={(e) => setIssnNumber(e.target.value)}
                            />
                            <label className='absolute left-0 -top-3.5 text-indigo-700 text-sm font-semibold transition-all peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-500 peer-placeholder-shown:font-normal peer-placeholder-shown:top-2 peer-focus:-top-3.5 peer-focus:text-indigo-700 peer-focus:font-semibold peer-focus:text-sm'>ISSN Number</label>
                        </div>

                        <div className='relative w-full mb-7'>
                            <input
                                className='peer h-10 w-full border-b-2 border-gray-300 text-gray-900 placeholder-transparent focus:outline-none focus:border-blue-400'
                                type='text'
                                placeholder='Website Links (Comma separated)'
                                value={linkWebsite}
                                onChange={(e) => setLinkWebsite(e.target.value)}
                            />
                            <label className='absolute left-0 -top-3.5 text-indigo-700 text-sm font-semibold transition-all peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-500 peer-placeholder-shown:font-normal peer-placeholder-shown:top-2 peer-focus:-top-3.5 peer-focus:text-indigo-700 peer-focus:font-semibold peer-focus:text-sm'>Website Links</label>
                        </div>

                        <div className='relative w-full mb-7'>
                            <input
                                className='peer h-10 w-full border-b-2 border-gray-300 text-gray-900 placeholder-transparent focus:outline-none focus:border-blue-400'
                                type='text'
                                placeholder='Document Links (Comma separated)'
                                value={linkDocs}
                                onChange={(e) => setLinkDocs(e.target.value)}
                            />
                            <label className='absolute left-0 -top-3.5 text-indigo-700 text-sm font-semibold transition-all peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-500 peer-placeholder-shown:font-normal peer-placeholder-shown:top-2 peer-focus:-top-3.5 peer-focus:text-indigo-700 peer-focus:font-semibold peer-focus:text-sm'>Document Links</label>
                        </div>

                        <div className='flex items-center mb-7'>
                            <input
                                id="isListed"
                                type='checkbox'
                                checked={isListed}
                                onChange={(e) => setIsListed(e.target.checked)}
                            />
                            <label htmlFor="isListed" className='ml-2 text-gray-700'>Is Listed?</label>
                        </div>

                        {isListed && (
                            <div className='relative w-full mb-7'>
                                <input
                                    className='peer h-10 w-full border-b-2 border-gray-300 text-gray-900 placeholder-transparent focus:outline-none focus:border-blue-400'
                                    type='text'
                                    placeholder='Link to Research'
                                    value={linkToRe}
                                    onChange={(e) => setLinkToRe(e.target.value)}
                                />
                                <label className='absolute left-0 -top-3.5 text-indigo-700 text-sm font-semibold transition-all peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-500 peer-placeholder-shown:font-normal peer-placeholder-shown:top-2 peer-focus:-top-3.5 peer-focus:text-indigo-700 peer-focus:font-semibold peer-focus:text-sm'>Link to Research</label>
                            </div>
                        )}

                        <div className="flex justify-end mt-8">
                            <button
                                type='submit'
                                className="bg-[#80c0d6] text-white py-2 px-4 rounded-md shadow-md hover:bg-[#4d8c9b]"
                            >
                                Submit
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </>
    );
}
