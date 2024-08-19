import React, { useState, FormEvent } from "react";
import { Roboto } from 'next/font/google';
import { SingleValue, ActionMeta, MultiValue } from "react-select";
import Creatable from "react-select/creatable";
import makeAnimated from 'react-select/animated';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios';

const roboto = Roboto({
    weight: '500',
    subsets: ['latin'],
    display: 'swap',
})

type CategoryOption = { value: string; label: string };

type AwardJSON = {
    year: string,
    title: string,
    awardeeName: string,
    awardingAgencyName: string,
    category: string
}

export default function AddAwards() {
    const [year, setYear] = useState("");
    const [title, setTitle] = useState("");
    const [awardeeName, setAwardeeName] = useState("");
    const [awardingAgencyName, setAwardingAgencyName] = useState("");
    const [selectedCategory, setSelectedCategory] = useState<CategoryOption | null>(null);

    const animatedComponents = makeAnimated();

    const handleCategoryChange = (
        newValue: SingleValue<CategoryOption> | MultiValue<CategoryOption>,
        actionMeta: ActionMeta<CategoryOption>
    ) => {
        setSelectedCategory(newValue as SingleValue<CategoryOption>);
    };

    const formSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (!selectedCategory) {
            alert("All fields are mandatory! Please select a category.");
            return;
        }

        let json: AwardJSON = {
            year,
            title,
            awardeeName,
            awardingAgencyName,
            category: selectedCategory.value
        };

        try {
            const response = await axios.post('http://localhost:8080/awards', json);
            if (response.status === 201 || response.status === 200) {
                toast.success('Award added successfully', {
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
        setYear("");
        setTitle("");
        setAwardeeName("");
        setAwardingAgencyName("");
        setSelectedCategory(null);
    }

    return (
        <>
            <ToastContainer />
            <div className="bg-[#d5e7eb]">
                <div className="bg-white flex flex-col">
                    <h1 className={`${roboto.className} text-black text-3xl lg:text-3xl mt-7`}>Awards/Recognition</h1>
                    <hr className="flex justify-center border-t-2 border-gray-200 mt-7 mb-10" />
                    <form onSubmit={formSubmit}>
                        <div className='flex justify-between gap-5 mb-7'>
                            <div className='relative w-full'>
                                <input
                                    className='peer h-10 w-full border-b-2 border-gray-300 text-gray-900 placeholder-transparent focus:outline-none focus:border-blue-400'
                                    type='text'
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
                                    placeholder='Title'
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                />
                                <label className='absolute left-0 -top-3.5 text-indigo-700 font-semibold text-sm transition-all peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-500 peer-placeholder-shown:top-2 peer-placeholder-shown:font-normal peer-focus:-top-3.5 peer-focus:text-indigo-700 peer-focus:text-sm peer-focus:font-semibold'>Title</label>
                            </div>
                        </div>
                        <div className='relative w-full mb-7'>
                            <input
                                className='peer h-10 w-full border-b-2 border-gray-300 text-gray-900 placeholder-transparent focus:outline-none focus:border-blue-400'
                                type='text'
                                placeholder='Awardee Name'
                                required
                                value={awardeeName}
                                onChange={(e) => setAwardeeName(e.target.value)}
                            />
                            <label className='absolute left-0 -top-3.5 text-indigo-700 font-semibold text-sm transition-all peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-500 peer-placeholder-shown:top-2 peer-placeholder-shown:font-normal peer-focus:-top-3.5 peer-focus:text-indigo-700 peer-focus:text-sm peer-focus:font-semibold'>Awardee Name</label>
                        </div>
                        <div className='relative w-full mb-7'>
                            <input
                                className='peer h-10 w-full border-b-2 border-gray-300 text-gray-900 placeholder-transparent focus:outline-none focus:border-blue-400'
                                type='text'
                                placeholder='Awarding Agency Name'
                                required
                                value={awardingAgencyName}
                                onChange={(e) => setAwardingAgencyName(e.target.value)}
                            />
                            <label className='absolute left-0 -top-3.5 text-indigo-700 font-semibold text-sm transition-all peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-500 peer-placeholder-shown:top-2 peer-placeholder-shown:font-normal peer-focus:-top-3.5 peer-focus:text-indigo-700 peer-focus:text-sm peer-focus:font-semibold'>Awarding Agency Name</label>
                        </div>
                        <div className='relative w-full mb-10'>
                            <Creatable
                                className='text-blue-700'
                                isClearable
                                isSearchable
                                required
                                components={animatedComponents}
                                value={selectedCategory}
                                onChange={handleCategoryChange}
                                placeholder={
                                    <p className='text-gray-500'>
                                        Category
                                    </p>
                                }
                                options={[
                                    { value: "institution", label: "Institution" },
                                    { value: "teacher", label: "Teacher" },
                                    { value: "research scholar", label: "Research Scholar" },
                                    { value: "student", label: "Student" },
                                ]}
                            />
                        </div>
                        <div className='relative w-full flex justify-end px-4 mt-20 lg:mt-8'>
                            <button className='bg-gradient-to-r from-[#170a7f] to-[#12075c] text-white font-semibold hover:scale-105 hover:shadow-[0_0_40px_-10px_(0,0,0,1)] hover:shadow-yellow-400 transition duration-300 ease-in-out transform hover:-translate-y-1 hover:text-yellow-400 rounded px-4 py-4' type="submit">Add Award</button>
                            <button className='ml-6 bg-gradient-to-r from-red-700 to-red-800 text-white font-semibold hover:scale-105 hover:shadow-[0_0_40px_-10px_(0,0,0,1)] hover:shadow-yellow-400 transition duration-300 ease-in-out transform hover:-translate-y-1 hover:text-yellow-400 rounded px-6 py-4' onClick={handleClearAll}>Clear All</button>
                        </div>
                    </form>
                </div>
            </div>
        </>
    )
}