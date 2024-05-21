import React, { useEffect, useState, useContext, useRef } from 'react'
import AuthContext from '../../context/AuthProvider'
import useAxiosPrivate from '../../hooks/useAxiosPrivate'

const NumberInput = ({ visible, setVisible, entry, setEntry }) => {

    const { auth } = useContext(AuthContext)

    const axiosPrivate = useAxiosPrivate()

    const [first, setFirst] = useState("")
    const [second, setSecond] = useState("")
    const [third, setThird] = useState("")
    const [forth, setForth] = useState("")

    const [err, setErr] = useState("")
    const errRef = useRef(null);

    // things for this to work:
    // only 3 tries for each user
    // if no number generated that day, generate one winning number
    // if they win, 10000 points awarded to them
    // if they lose, clear db

    const handleSubmit = async () => {
        const userid = auth?.userId;
        const input = first + second + third + forth +"";

        console.log("This is the numberinput" + input)
        const body = {
            uuid: userid,
            input: input  
        };

        try {
            const res = await axiosPrivate.post('/game', body);
            if (res?.status == 200) {
                setEntry("Entry Added!");
            }
        } catch (error) {
            if (error?.response?.status == 403) {
                setErr("Maximum 3 tries");
            } else if (error?.response.status == 400) {
                setErr("Only input numbers");
            } else if (error?.response.status == 409) {
                setErr("No Duplicate entries allowed")
            } else {
                setErr(error.toString());
            }
        }
    };

    const handleFirstChange = (e) => {
        const value = e.currentTarget.value;
        if (/^\d?$/.test(value)) {
            setFirst(value);
        }
    };

    const handleSecondChange = (e) => {
        const value = e.currentTarget.value;
        if (/^\d?$/.test(value)) {
            setSecond(value);
        }
    };

    const handleThirdChange = (e) => {
        const value = e.currentTarget.value;
        if (/^\d?$/.test(value)) {
            setThird(value);
        }
    };

    const handleFourthChange = (e) => {
        const value = e.currentTarget.value;
        if (/^\d?$/.test(value)) {
            setForth(value);
        }
    };


    return (
        <div style={{ display: visible ? 'block' : 'none' }}>

            <div class="relative flex flex-col justify-center overflow-hidden py-12">
                <div class="relative bg-white px-6 pt-10 pb-9 shadow-xl mx-auto w-full max-w-lg rounded-2xl">
                    <div class="mx-auto flex w-full max-w-md flex-col space-y-16">
                        <div class="flex flex-col items-center justify-center text-center space-y-2">
                            <div class="font-semibold text-3xl">
                                <p>Enter your number</p>
                            </div>
                            <div class="flex flex-row text-sm font-medium text-gray-400">
                                <p>Enter the number you wish to get lucky with!</p>

                            </div>
                        </div>

                        <div>
                            <div>
                                <div class="flex flex-col space-y-16">
                                    <div class="flex flex-row items-center justify-between mx-auto w-full max-w-xs">
                                        <div class="w-16 h-16 ">
                                            <input
                                                onChange={handleFirstChange}
                                                value={first}
                                                class="w-full h-full flex flex-col items-center justify-center text-center px-5 outline-none rounded-xl border border-gray-200 text-lg bg-white focus:bg-gray-50 focus:ring-1 ring-blue-700"
                                                type="text"
                                                name=""
                                                maxLength="1"
                                            />
                                        </div>
                                        <div class="w-16 h-16 ">
                                            <input
                                                onChange={handleSecondChange}
                                                value={second}
                                                class="w-full h-full flex flex-col items-center justify-center text-center px-5 outline-none rounded-xl border border-gray-200 text-lg bg-white focus:bg-gray-50 focus:ring-1 ring-blue-700"
                                                type="text"
                                                name=""
                                                maxLength="1"
                                            />
                                        </div>
                                        <div class="w-16 h-16 ">
                                            <input
                                                onChange={handleThirdChange}
                                                value={third}
                                                class="w-full h-full flex flex-col items-center justify-center text-center px-5 outline-none rounded-xl border border-gray-200 text-lg bg-white focus:bg-gray-50 focus:ring-1 ring-blue-700"
                                                type="text"
                                                name=""
                                                maxLength="1"
                                            />
                                        </div>
                                        <div class="w-16 h-16 ">
                                            <input
                                                onChange={handleFourthChange} 
                                                value={forth}
                                                class="w-full h-full flex flex-col items-center justify-center text-center px-5 outline-none rounded-xl border border-gray-200 text-lg bg-white focus:bg-gray-50 focus:ring-1 ring-blue-700"
                                                type="text"
                                                name=""
                                                maxLength="1"
                                            />
                                        </div>
                                    </div>

                                    <div class="flex flex-col space-y-5">
                                        <div>
                                            <button onClick={handleSubmit} class="flex flex-row items-center justify-center text-center w-full border rounded-xl outline-none py-5 bg-blue-700 border-none text-white text-sm shadow-sm">
                                                Enter lucky draw!
                                            </button>
                                        </div>

                                        <div class="flex flex-row items-center justify-center text-center text-sm font-medium space-x-1 text-gray-500">
                                            <button class="flex flex-row items-center text-blue-600" onClick={() => setVisible(false)}>Cancel</button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                {err && (<div ref={errRef} id="toast-danger" class="flex items-center w-full max-w-xs p-4 mb-4 text-gray-500 bg-white rounded-lg shadow dark:text-gray-400 dark:bg-gray-800" role="alert">
                    <div class="inline-flex items-center justify-center flex-shrink-0 w-8 h-8 text-red-500 bg-red-100 rounded-lg dark:bg-red-800 dark:text-red-200">
                        <svg class="w-5 h-5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5Zm3.707 11.793a1 1 0 1 1-1.414 1.414L10 11.414l-2.293 2.293a1 1 0 0 1-1.414-1.414L8.586 10 6.293 7.707a1 1 0 0 1 1.414-1.414L10 8.586l2.293-2.293a1 1 0 0 1 1.414 1.414L11.414 10l2.293 2.293Z" />
                        </svg>
                        <span class="sr-only">Error icon</span>
                    </div>
                    <div class="ml-3 text-sm font-normal">{err}</div>
                    <button type="button" onClick={() => { setErr("") }} class="ml-auto -mx-1.5 -my-1.5 bg-white text-gray-400 hover:text-gray-900 rounded-lg focus:ring-2 focus:ring-gray-300 p-1.5 hover:bg-gray-100 inline-flex items-center justify-center h-8 w-8 dark:text-gray-500 dark:hover:text-white dark:bg-gray-800 dark:hover:bg-gray-700" data-dismiss-target="#toast-danger" aria-label="Close">
                        <span class="sr-only">Close</span>
                        <svg class="w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14">
                            <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6" />
                        </svg>
                    </button>
                </div>)}
            </div>
        </div>
    )
}

export default NumberInput