import React, { useState } from 'react'
import axios from "../api/axios";
const EmailReset = () => {

    const [email, setEmail] = useState("")
    const [sent, setSent] = useState(false)
    const [err, setErr] = ("")

    const handleSubmit = async (e) => {
        e.preventDefault()
        const url = "reset/email?email=" + email
        try {
            const res = await axios.get(url)
            setSent(true)


        } catch (error) {
            console.error(error)
        }
    }

    return (
        <div className='flex flex-col justify-center items-center m-5'>
            {sent && (<div className="alert alert-info">
                <span>Reset Email sent.</span>
            </div>)}

            <div className='w-full text-white max-w-sm bg-mainOrange rounded-xl p-10 shadow-lg m-3'>
                <div className='m-1 mb-3'>
                    <h1 className='text-lg'>Reset your password</h1>
                    <p className='text-xs'>Please provide the email address you used when you signed up for an account</p>
                </div>

                <div>
                    <form className='flex flex-col m-4 mt-5'>
                        <input className='rounded-md text-black' type='email' required onChange={(e) => { setEmail(e.target.value) }} />
                        <button className='m-3' onClick={handleSubmit}>Enter</button>
                    </form>
                </div>
            </div>

        </div>
    )
}

export default EmailReset