import React, { useState, FormEvent } from "react"
import { Roboto } from 'next/font/google'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios';

const roboto = Roboto({
    weight: '500',
    subsets: ['latin'],
    display: 'swap',
})

export default function PublicationForm() {
    const [facultyName, setFacultyName] = useState("")
    const [titleBook, setTitleBook] = useState("")
    const [titlePaper, setTitlePaper] = useState("")
    const [titleConference, setTitleConference] = useState("")
    const [publicationYear, setPublicationYear] = useState("")
    const [issnNumber, setIssnNumber] = useState("")
    const [isSameInstitution, setIsSameInstitution] = useState(false)
    const [publisherName, setPublisherName] = useState("")

    const formSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault()

        const publicationData = {
            facultyName,
            titleBook,
            titlePaper,
            titleConference,
            publicationYear,
            issnNumber,
            isSameInstitution,
            publisherName
        };

        try {
            const response = await axios.post('http://localhost:8080/conference', publicationData);
            if (response.status === 201 || response.status == 200) {
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
    }

    const handleClearAll = () => {
        setFacultyName("")
        setTitleBook("")
        setTitlePaper("")
        setTitleConference("")
        setPublicationYear("")
        setIssnNumber("")
        setIsSameInstitution(false)
        setPublisherName("")
    }

    return (
        <>
            <ToastContainer />
            <div className="bg-[#d5e7eb]">
                <div className="bg-white flex flex-col">
                    <h1 className={`${roboto.className} text-black text-3xl lg:text-3xl mt-7`}>Conference Form</h1>
                    <hr className="flex justify-center border-t-2 border-gray-200 mt-7 mb-10" />
                    <form onSubmit={formSubmit}>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-7">
                            <div className="relative w-full">
                                <input
                                    className="peer h-10 w-full border-b-2 border-gray-300 text-gray-900 placeholder-transparent focus:outline-none focus:border-blue-400"
                                    type="text"
                                    placeholder="Faculty Name"
                                    required
                                    value={facultyName}
                                    onChange={(e) => setFacultyName(e.target.value)}
                                />
                                <label className="absolute left-0 -top-3.5 text-indigo-700 text-sm font-semibold transition-all peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-500 peer-placeholder-shown:font-normal peer-placeholder-shown:top-2 peer-focus:-top-3.5 peer-focus:text-indigo-700 peer-focus:font-semibold peer-focus:text-sm">Faculty Name</label>
                            </div>

                            <div className="relative w-full">
                                <input
                                    className="peer h-10 w-full border-b-2 border-gray-300 text-gray-900 placeholder-transparent focus:outline-none focus:border-blue-400"
                                    type="text"
                                    placeholder="Title of Book"
                                    value={titleBook}
                                    onChange={(e) => setTitleBook(e.target.value)}
                                />
                                <label className="absolute left-0 -top-3.5 text-indigo-700 font-semibold text-sm transition-all peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-500 peer-placeholder-shown:top-2 peer-placeholder-shown:font-normal peer-focus:-top-3.5 peer-focus:text-indigo-700 peer-focus:text-sm peer-focus:font-semibold">Title of Book</label>
                            </div>

                            <div className="relative w-full">
                                <input
                                    className="peer h-10 w-full border-b-2 border-gray-300 text-gray-900 placeholder-transparent focus:outline-none focus:border-blue-400"
                                    type="text"
                                    placeholder="Title of Paper"
                                    value={titlePaper}
                                    onChange={(e) => setTitlePaper(e.target.value)}
                                />
                                <label className="absolute left-0 -top-3.5 text-indigo-700 font-semibold text-sm transition-all peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-500 peer-placeholder-shown:top-2 peer-placeholder-shown:font-normal peer-focus:-top-3.5 peer-focus:text-indigo-700 peer-focus:text-sm peer-focus:font-semibold">Title of Paper</label>
                            </div>

                            <div className="relative w-full">
                                <input
                                    className="peer h-10 w-full border-b-2 border-gray-300 text-gray-900 placeholder-transparent focus:outline-none focus:border-blue-400"
                                    type="text"
                                    placeholder="Title of Conference"
                                    value={titleConference}
                                    onChange={(e) => setTitleConference(e.target.value)}
                                />
                                <label className="absolute left-0 -top-3.5 text-indigo-700 font-semibold text-sm transition-all peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-500 peer-placeholder-shown:top-2 peer-placeholder-shown:font-normal peer-focus:-top-3.5 peer-focus:text-indigo-700 peer-focus:text-sm peer-focus:font-semibold">Title of Conference</label>
                            </div>

                            <div className="relative w-full">
                                <input
                                    className="peer h-10 w-full border-b-2 border-gray-300 text-gray-900 placeholder-transparent focus:outline-none focus:border-blue-400"
                                    type="text"
                                    placeholder="Publication Year"
                                    value={publicationYear}
                                    onChange={(e) => setPublicationYear(e.target.value)}
                                />
                                <label className="absolute left-0 -top-3.5 text-indigo-700 font-semibold text-sm transition-all peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-500 peer-placeholder-shown:top-2 peer-placeholder-shown:font-normal peer-focus:-top-3.5 peer-focus:text-indigo-700 peer-focus:text-sm peer-focus:font-semibold">Publication Year</label>
                            </div>

                            <div className="relative w-full">
                                <input
                                    className="peer h-10 w-full border-b-2 border-gray-300 text-gray-900 placeholder-transparent focus:outline-none focus:border-blue-400"
                                    type="text"
                                    placeholder="ISSN Number"
                                    value={issnNumber}
                                    onChange={(e) => setIssnNumber(e.target.value)}
                                />
                                <label className="absolute left-0 -top-3.5 text-indigo-700 font-semibold text-sm transition-all peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-500 peer-placeholder-shown:top-2 peer-placeholder-shown:font-normal peer-focus:-top-3.5 peer-focus:text-indigo-700 peer-focus:text-sm peer-focus:font-semibold">ISSN Number</label>
                            </div>

                            <div className="relative w-full col-span-2 flex items-center">
                                <input
                                    type="checkbox"
                                    id="isSameInstitution"
                                    checked={isSameInstitution}
                                    onChange={(e) => setIsSameInstitution(e.target.checked)}
                                />
                                <label htmlFor="isSameInstitution" className="ml-2">Same Institution</label>
                            </div>

                            <div className="relative w-full">
                                <input
                                    className="peer h-10 w-full border-b-2 border-gray-300 text-gray-900 placeholder-transparent focus:outline-none focus:border-blue-400"
                                    type="text"
                                    placeholder="Publisher Name"
                                    value={publisherName}
                                    onChange={(e) => setPublisherName(e.target.value)}
                                />
                                <label className="absolute left-0 -top-3.5 text-indigo-700 font-semibold text-sm transition-all peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-500 peer-placeholder-shown:top-2 peer-placeholder-shown:font-normal peer-focus:-top-3.5 peer-focus:text-indigo-700 peer-focus:text-sm peer-focus:font-semibold">Publisher Name</label>
                            </div>
                        </div>

                        <div className="relative w-full flex justify-end px-4 mt-20 lg:mt-8">
                            <button className="bg-gradient-to-r from-[#170a7f] to-[#12075c] text-white font-semibold hover:scale-105 hover:shadow-[0_0_40px_-10px_(0,0,0,1)] hover:shadow-yellow-400 transition duration-300 ease-in-out transform hover:-translate-y-1 hover:text-yellow-400 rounded px-4 py-4" type="submit">Add Publication</button>
                            <button className="ml-6 bg-gradient-to-r from-red-700 to-red-800 text-white font-semibold hover:scale-105 hover:shadow-[0_0_40px_-10px_(0,0,0,1)] hover:shadow-yellow-400 transition duration-300 ease-in-out transform hover:-translate-y-1 hover:text-yellow-400 rounded px-6 py-4" onClick={handleClearAll} type="button">Clear All</button>
                        </div>
                    </form>
                </div>
            </div>
        </>
    )
}