import { Roboto } from 'next/font/google'
import { SingleValue, ActionMeta } from "react-select";
import "../../../styles/addPublicationStyles.css"
import Creatable from "react-select/creatable"
import makeAnimated from 'react-select/animated';
import React, { useState, FormEvent } from "react"
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios';

const roboto = Roboto({
    weight: '500',
    subsets: ['latin'],
    display: 'swap',
})

type GrantJSON = {
    projectName: string,
    principalInvestigator: string,
    fundingAgency: string,
    type: string, // Single string value
    department: string,
    awardYear: string,
    fundProvided: string,
    projectDuration: string,
}

export default function AddGrant() {
    const [projectName, setProjectName] = useState("")
    const [principalInvestigator, setPrincipalInvestigator] = useState("")
    const [fundingAgency, setFundingAgency] = useState("")
    const [selectedType, setSelectedType] = useState<SingleValue<{ value: string; label: string }> | null>(null);
    const [department, setDepartment] = useState("")
    const [awardYear, setAwardYear] = useState("")
    const [fundProvided, setFundProvided] = useState("")
    const [projectDuration, setProjectDuration] = useState("")

    const handleClearAll = () => {
        setProjectName("")
        setPrincipalInvestigator("")
        setFundingAgency("")
        setSelectedType(null)
        setDepartment("")
        setAwardYear("")
        setFundProvided("")
        setProjectDuration("")
    }

    const handleTypeChange = (newValue: SingleValue<{ value: string; label: string }>, actionMeta: ActionMeta<{ value: string; label: string }>) => {
        setSelectedType(newValue);
    };

    const formSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault()

        if (!selectedType) {
            alert("All fields are mandatory! Please select a project type.")
            return
        }

        if (!projectName || !principalInvestigator || !fundingAgency || !department || !awardYear || !fundProvided || !projectDuration) {
            alert("All fields are mandatory! Please fill in all required fields.")
            return
        }

        let json: GrantJSON = {
            projectName,
            principalInvestigator,
            fundingAgency,
            type: selectedType.value, // Single string value
            department,
            awardYear,
            fundProvided,
            projectDuration,
        }

        try {
            const response = await axios.post('http://localhost:8080/researchGrant', json);
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
    }

    return (
        <>
            <ToastContainer />
            <div className="bg-[#d5e7eb]">
                <div className="bg-white flex flex-col">
                    <h1 className={`${roboto.className} text-black text-3xl lg:text-3xl mt-7`}>Research Grant</h1>
                    <hr className="flex justify-center border-t-2 border-gray-200 mt-7 mb-10" />
                    <form onSubmit={formSubmit}>
                        <div className='flex justify-between gap-5 mb-7'>
                            <div className='relative w-full'>
                                <input
                                    className='peer h-10 w-full border-b-2 border-gray-300 text-gray-900 placeholder-transparent focus:outline-none focus:border-blue-400'
                                    type='text'
                                    autoFocus
                                    placeholder='Project Name'
                                    required
                                    value={projectName}
                                    onChange={(e) => setProjectName(e.target.value)}
                                />
                                <label className='absolute left-0 -top-3.5 text-indigo-700 text-sm font-semibold transition-all peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-500 peer-placeholder-shown:font-normal peer-placeholder-shown:top-2 peer-focus:-top-3.5 peer-focus:text-indigo-700 peer-focus:font-semibold peer-focus:text-sm'>Project Name</label>
                            </div>
                        </div>
                        <div className='flex justify-between gap-5 mb-7'>
                            <div className='relative w-full'>
                                <input
                                    className='peer h-10 w-full border-b-2 border-gray-300 text-gray-900 placeholder-transparent focus:outline-none focus:border-blue-400'
                                    required
                                    type='text'
                                    placeholder='Principal Investigator'
                                    value={principalInvestigator}
                                    onChange={(e) => setPrincipalInvestigator(e.target.value)}
                                />
                                <label className='absolute left-0 -top-3.5 text-indigo-700 font-semibold text-sm transition-all peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-500 peer-placeholder-shown:top-2 peer-placeholder-shown:font-normal peer-focus:-top-3.5 peer-focus:text-indigo-700 peer-focus:text-sm peer-focus:font-semibold'>Principal Investigator</label>
                            </div>
                        </div>
                        <div className='relative w-full mb-10'>
                            <input
                                className='peer h-10 w-full border-b-2 border-gray-300 text-gray-900 placeholder-transparent focus:outline-none focus:border-blue-400'
                                type='text'
                                placeholder='Funding Agency'
                                required
                                value={fundingAgency}
                                onChange={(e) => setFundingAgency(e.target.value)}
                            />
                            <label className='absolute left-0 -top-3.5 text-indigo-700 font-semibold text-sm transition-all peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-500 peer-placeholder-shown:top-2 peer-placeholder-shown:font-normal peer-focus:-top-3.5 peer-focus:text-indigo-700 peer-focus:text-sm peer-focus:font-semibold'>Funding Agency</label>
                        </div>
                        <div className='flex justify-between gap-5 mb-10'>
                            <div className='relative w-full'>
                                <Creatable
                                    className='text-blue-700'
                                    closeMenuOnSelect={true} // Allow single selection
                                    isClearable
                                    isMulti={false} // Single value selection
                                    required
                                    components={makeAnimated()}
                                    value={selectedType}
                                    onChange={handleTypeChange}
                                    isSearchable
                                    placeholder={<p className='text-gray-500'>Project Type</p>}
                                    options={[
                                        { value: "Government", label: "Government" },
                                        { value: "Non-Government", label: "Non-Government" },
                                    ]}
                                />
                            </div>
                        </div>
                        <div className='relative w-full mb-10'>
                            <input
                                className='peer h-10 w-full border-b-2 border-gray-300 text-gray-900 placeholder-transparent focus:outline-none focus:border-blue-400'
                                type='text'
                                placeholder='Department'
                                required
                                value={department}
                                onChange={(e) => setDepartment(e.target.value)}
                            />
                            <label className='absolute left-0 -top-3.5 text-indigo-700 font-semibold text-sm transition-all peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-500 peer-placeholder-shown:top-2 peer-placeholder-shown:font-normal peer-focus:-top-3.5 peer-focus:text-indigo-700 peer-focus:text-sm peer-focus:font-semibold'>Department</label>
                        </div>
                        <div className='relative w-full mb-10'>
                            <input
                                className='peer h-10 w-full border-b-2 border-gray-300 text-gray-900 placeholder-transparent focus:outline-none focus:border-blue-400'
                                type='text'
                                placeholder='Award Year'
                                required
                                value={awardYear}
                                onChange={(e) => setAwardYear(e.target.value)}
                            />
                            <label className='absolute left-0 -top-3.5 text-indigo-700 font-semibold text-sm transition-all peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-500 peer-placeholder-shown:top-2 peer-placeholder-shown:font-normal peer-focus:-top-3.5 peer-focus:text-indigo-700 peer-focus:text-sm peer-focus:font-semibold'>Award Year</label>
                        </div>
                        <div className='relative w-full mb-10'>
                            <input
                                className='peer h-10 w-full border-b-2 border-gray-300 text-gray-900 placeholder-transparent focus:outline-none focus:border-blue-400'
                                type='text'
                                placeholder='Fund Provided'
                                required
                                value={fundProvided}
                                onChange={(e) => setFundProvided(e.target.value)}
                            />
                            <label className='absolute left-0 -top-3.5 text-indigo-700 font-semibold text-sm transition-all peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-500 peer-placeholder-shown:top-2 peer-placeholder-shown:font-normal peer-focus:-top-3.5 peer-focus:text-indigo-700 peer-focus:text-sm peer-focus:font-semibold'>Fund Provided</label>
                        </div>
                        <div className='relative w-full mb-10'>
                            <input
                                className='peer h-10 w-full border-b-2 border-gray-300 text-gray-900 placeholder-transparent focus:outline-none focus:border-blue-400'
                                type='text'
                                placeholder='Project Duration'
                                required
                                value={projectDuration}
                                onChange={(e) => setProjectDuration(e.target.value)}
                            />
                            <label className='absolute left-0 -top-3.5 text-indigo-700 font-semibold text-sm transition-all peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-500 peer-placeholder-shown:top-2 peer-placeholder-shown:font-normal peer-focus:-top-3.5 peer-focus:text-indigo-700 peer-focus:text-sm peer-focus:font-semibold'>Project Duration</label>
                        </div>
                        <button
                            type="submit"
                            className="bg-blue-500 text-white py-2 px-4 rounded"
                        >
                            Submit
                        </button>
                        <button
                            type="button"
                            onClick={handleClearAll}
                            className="ml-4 bg-gray-500 text-white py-2 px-4 rounded"
                        >
                            Clear All
                        </button>
                    </form>
                </div>
            </div>
        </>
    )
}
