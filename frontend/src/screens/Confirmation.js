import React, { useEffect, useState } from 'react';
import failedVerificationImage from '../assets/failedVerification.png';
import verified from '../assets/verified.png';
import { useSearchParams, useNavigate } from 'react-router-dom';
import axios from '../api/axios';

const Confirmation = () => {
    const [confirmed, setConfirmed] = useState(false);
    const [err, setErr] = useState("")

    const navigate = useNavigate()

    //to get the query
    const [searchParams, setSearchParams] = useSearchParams()

    // important stuff nasayin
    const token = searchParams.get('token')
    const userid = searchParams.get('id')

    //differiantiate bet the email its sent to vs the email that you want
    const [sendEmail, setSendEmail] = useState("")
    const [email, setEmail] = useState("")

    const [changed, setChanged] = useState(false)
    const [resend, setResend] = useState("")

    // meow
    const [loading, setLoading] = useState(true)

    //countdown for redirect
    const [countdown, setCountdown] = useState(10)

    const verifyEmail = async () => {

        try {
            const res = await axios.get("confirmation/" + token)
            if (res.status === 200 || res.status === 204) {
                setConfirmed(true)
                return
            } else if (res.status === 409) {
                setErr("User does not exist, please sign up")
                return
            }

        } catch (err) {

            if (err.response.data) {
                setErr("Error: " + err.response.data.message)
                return
            }
            console.log("This is the error response: ", err.response.data)
            setErr("Error: " + err)
        }
    }

    const resendEmail = async () => {
        try {
            const res = await axios.get("resend?uuid=" + userid)
            if (res.status === 200) {
                setResend("Email has been sent")

                return
            } else if (res.status == 204) {
                setResend("Email has not been sent")
                return
            } else if (res.status === 409) {
                setErr("User does not exist, please sign up")
                return
            }

        } catch (err) {

            if (err.response.data) {
                setErr("Error: " + err.response.data.message)
                return
            }
            console.log("This is the error response: ", err.response.data)
            setErr("Error: " + err)
        }
    }

    const changeEmail = async () => {
        const body = {
            email: email
        }
        try {
            const res = await axios.post("/changeEmail?uuid=" + userid, body)
            if (res.status === 201) {
                window.location.reload()
                return
            } else if (res.status == 204) {
                setResend("Email has not been sent")
                return
            }

        } catch (err) {

            if (err?.response?.data) {
                setErr("Error: " + err.response.data.message)
                return
            }
            console.log("This is the error response: ", err.response.data)
            setErr("Error: " + err)
        }
    }

    const getEmail = async () => {
        try {
            const res = await axios.get("showEmail/" + userid)
            setSendEmail(res.data)

        } catch (err) {
            if (err?.response?.data) {
                setErr("Error: " + err.response.data.message)
                return
            }
            console.log("This is the error response: ", err.response.data)
            setErr("Error: " + err)
        }
    }

    useEffect(() => {
        console.log("uuid" + userid)
        getEmail()
        if (userid != null && token != null) {
            verifyEmail()
            setLoading(false)
            return
        } else if (userid === null) {
            console.log("user id falese")
            setErr("Undefined user, please change email or sign up again")
        }
    }, [])

    useEffect(() => {
        if (confirmed) {
            if (countdown > 0) {
                const timer = setTimeout(() => setCountdown(countdown - 1), 1000); // Reduce the countdown by 1 second
                return () => clearTimeout(timer); // Clean up the timer when component unmounts
            } else {
                navigate("/login"); // Redirect when countdown reaches 0
            }
        }
    }, [confirmed, countdown]);

    return (<div className='m-5 flex flex-col justify-center items-center'>
        <div>{resend}</div>
        {err}
        {
            loading ? (<>
                <h1>Verifying {sendEmail} Check your email!</h1>
                <div aria-label="Orange and tan hamster running in a metal wheel" role="img" class="wheel-and-hamster m-4">
                    <div class="wheel"></div>
                    <div class="hamster">
                        <div class="hamster__body">
                            <div class="hamster__head">
                                <div class="hamster__ear"></div>
                                <div class="hamster__eye"></div>
                                <div class="hamster__nose"></div>
                            </div>
                            <div class="hamster__limb hamster__limb--fr"></div>
                            <div class="hamster__limb hamster__limb--fl"></div>
                            <div class="hamster__limb hamster__limb--br"></div>
                            <div class="hamster__limb hamster__limb--bl"></div>
                            <div class="hamster__tail"></div>
                        </div>
                    </div>
                    <div class="spoke"></div>
                </div>
                <div className='m-5'>
                    <button onClick={
                        () => resendEmail()
                    }
                        className='btn bg-mainOrange m-5'>
                        Resend
                    </button>
                    <button className='btn btn-mainOrange m-5' onClick={() => setChanged(true)}>Edit email</button>
                </div>
            </>) : confirmed ? (<div className='flex flex-col justify-center items-center'>
                <h1 className='text-xl'>Congratulations! Your account has been verified!</h1>
                <img src={verified}
                    alt='account verified' />
                Redirecting you in...{countdown}
            </div>) : (<div className='flex flex-col justify-center items-center'>
                <h1 className='text-2xl'> {err}</h1>
                <img src={failedVerificationImage}
                    alt='failed verification'
                    className='w-48 h-36' />

            </div>)



        }<div>
            <div style={{ display: changed ? 'block' : 'none' }}>
                <form onSubmit={(e) => {
                    e.preventDefault();
                    changeEmail();
                }}>
                    <div className='flex justify-center bg-gray-100 p-5 rounded-md'>
                        <h1 className='m-1 mr-2'>Enter new Email here:</h1>
                        <input
                            className='ml-2'
                            type="email"
                            required
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </div>

                    <input type="submit" value="Submit" className='m-3 bg-mainOrange text-white rounded-md p-1' />
                    <input type="button" value="Cancel" className='m-3 bg-gray-100 rounded-md p-1' onClick={() => {
                        setChanged(false)

                    }} />
                </form>
            </div>
        </div>

    </div>);
};

export default Confirmation;
