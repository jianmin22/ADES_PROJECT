import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import SuccessModal from "../components/Modals/SuccessModal"
import axios from '../api/axios';

const ResetPwd = () => {
    const [pwd, setPwd] = useState("");
    const [cfmPwd, setCfmPwd] = useState("");
    const [userid, setUserid] = useState("");

    const [err, setErr] = useState("")

    const [searchParams] = useSearchParams();
    const token = searchParams.get('token');

    const navigate = useNavigate()

    const [success, setSuccess] = useState(false)

    useEffect(() => {
        if (token) {
            verify();
        }
    }, [token]);

    useEffect(() => {
        if (pwd != cfmPwd) {
            setErr("Passwords do not match")
        } else {
            setErr("")
        }

    }, [pwd, cfmPwd])

    const verify = async () => {
        const url = "/reset/verify?token=" + token;

        try {
            const res = await axios.get(url);
            console.log(res)
            setUserid(res.data);
        } catch (error) {
            setErr(error)
            console.error(error);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const url = "/reset/changePwd"
        const body = {
            userid: userid,
            password: pwd
        }

        try {
            const res = await axios.put(url, body)

            if (res?.status === 200) {
                setSuccess(true)
            }
        } catch (error) {
            setErr(error)
            console.error(error)
        }


    };

    return (
        <div className='flex flex-col justify-center items-center m-5'>
            <SuccessModal successIsOpen={success}
                successMessage={"Password changed!"}
                onSuccessClose={
                    () => {
                        setSuccess(!success)
                    }
                } />

            <h1 className='text-2xl'>Reset Password:</h1>
            <p className='text-red-600' > {err}</p>
            <form className='flex flex-col m-5' onSubmit={handleSubmit}>
                <div>
                    New Password: <input type="password" required className='bg-mainOrange m-2' value={pwd} onChange={(e) => setPwd(e.target.value)} />
                </div>
                <div>
                    Re-type Password: <input type="password" required className='bg-mainOrange m-2' value={cfmPwd} onChange={(e) => setCfmPwd(e.target.value)} />
                </div>
                <button disabled={pwd === cfmPwd ? false : true} type="submit" className='bg-mainOrange m-5 rounded-md text-white'>Change Password</button>
            </form>
        </div>
    );
};

export default ResetPwd;
