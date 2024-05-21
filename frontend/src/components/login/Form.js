import React, { useState, useRef, useEffect } from "react";
import axios from "../../api/axios";
import useAuth from "../../hooks/useAuth";
import { Link, useNavigate, useLocation } from "react-router-dom";
import ReCAPTCHA from "react-google-recaptcha";

const loginUrl = "/auth";

const Form = () => {
    const { setAuth, persist, setPersist } = useAuth();
    const userRef = useRef(null);
    const errRef = useRef(null);

    const navigate = useNavigate();
    const location = useLocation();

    // changed this temporarily
    let from = location.state?.from?.pathname || "/home";

    const [user, setUser] = useState("");
    const [pwd, setPwd] = useState("");
    const [err, setErr] = useState("");

    //For recapcha so user does not login without being check if they beep boop
    const [isVerified, setIsVerified] = useState(false)
    const [valid_token, setValidToken] = useState([]);

    const SITE_KEY = process.env.REACT_APP_RECAPTCHA_SITE_KEY;
    const SECRET_KEY = process.env.REACT_APP_RECAPTCHA_SECRET_KEY;


    const captchaRef = useRef(null);

    const verifyToken = (token) => {
        return new Promise((resolve, reject) => {
            let APIResponse = [];

            axios.post(`/verify-token`, {  
                reCAPTCHA_TOKEN: token,
                Secret_Key: SECRET_KEY,
            })
                .then((response) => {
                    APIResponse.push(response['data']);
                    resolve(APIResponse); 
                })
                .catch((error) => {
                    console.log(error);
                    reject(error);
                }); 
        }); 
    };


    const handleSubmit = async (e) => {
        try {
            e.preventDefault();

            let token = captchaRef.current.getValue();
            captchaRef.current.reset();

            if (token) {
                let valid_token = await verifyToken(token);

                if (valid_token[0].success === true) {
                    console.log("verified");

                    try {
                        const res = await axios.post(loginUrl, { user, pwd });

                        const userId = res?.data?.userId;
                        const accessToken = res?.data?.accessToken;
                        const role = res?.data?.role;
                        console.log("Tried to log in")
                        setAuth({ userId, role, accessToken });
                        setUser("");
                        setPwd("");
                        localStorage.setItem("logged", true)

                        from = role === "admin" || role === "admin" ? "/admin" : from;
                        navigate(from, { replace: true });


                    } catch (err) {
                        if (!err?.response) {
                            setErr("No Server Response");
                        } else if (err.response?.status === 400) {
                            setErr("Missing Username or Password");
                        } else if (err.response?.status === 401) {
                            console.log("what")
                            setErr("Incorrect username or password");

                        } else if (err.response?.status === 403) {
                            setErr("Please verify your email. A verification email has been sent to your inbox")

                        } else {
                            setErr("Login Failed");
                        } errRef.current.focus();

                        console.log(err);
                    }
                }
            }

            console.log("This is the verified status at this point", isVerified);

        } catch (err) {
            console.error(err);
        }
    };

    const handleLoginError = (err) => {
        if (!err?.response) {
            setErr("No Server Response");
        } else if (err.response?.status === 400) {
            setErr("Missing Username or Password");
        } else if (err.response?.status === 401) {
            setErr("Incorrect username or password");
        } else if (err.response?.status === 403) {
            setErr("Please verify your email. A verification email has been sent to your inbox");
        } else {
            setErr("Login Failed");
        }
        errRef.current.focus();
        console.log(err);
    };


    const togglePersist = () => {
        setPersist((prev) => !prev);
    };

    useEffect(() => {
        localStorage.setItem("persist", persist);
    }, [persist]);

    useEffect(() => {
        userRef.current.focus();
        console.log(SITE_KEY)
    }, []);

    useEffect(() => {
        setErr("");
    }, [user, pwd]);

    return (
        <div className="flex flex-col justify-center items-center m-3">
            {err && (<div ref={errRef}>
                <div id="toast-danger" class="flex items-center w-full max-w-xs p-4 mb-4 text-gray-500 bg-white rounded-lg shadow dark:text-gray-400 dark:bg-gray-800" role="alert">
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
                </div>
            </div>)}


            <form className="w-full max-w-sm bg-mainOrange rounded-xl p-10 shadow-lg m-3"
                onSubmit={handleSubmit}>

                <h1 className="text-4xl mb-4 text-white">Sign in</h1>
                <div className="justify-center items-center">
                    <div className="md:flex md:items-center mb-6">
                        <div className="md:w-1/3">
                            <label className="block text-white md:text-right mb-1 md:mb-0 pr-4" for="user">
                                Username:
                            </label>
                        </div>
                        <div className="md:w-2/3">
                            <input className="bg-white-200 appearance-none border-2 border-gray-200 rounded-xl w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:border-orange-300 shadow" id="user" type="text"
                                ref={userRef}
                                autoComplete="off"
                                onChange={
                                    (e) => setUser(e.target.value)
                                }
                                value={user}
                                required />
                        </div>
                    </div>
                    <div className="md:flex md:items-center mb-6">
                        <div className="md:w-1/3">
                            <label className="block text-white md:text-right mb-1 md:mb-0 pr-4" for="pwd">
                                Password:
                            </label>

                        </div>

                        <div className="md:w-2/3">

                            <input className="bg-white-200 appearance-none border-2 border-gray-200 rounded-xl w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:border-orange-300 shadow" id="pwd" type="password"
                                onChange={
                                    (e) => setPwd(e.target.value)
                                }
                                value={pwd}
                                required />
                            <button className=" text-xs" onClick={() => { navigate("/emailReset") }} > <u>Forgot password?</u></button>
                        </div>

                    </div>

                    <div className="m-1">
                        <input type="checkbox" id="persist"
                            onChange={togglePersist}
                            checked={persist} />
                        <label htmlFor="persist" className="text-white text-s pl-3">
                            Trust this device
                        </label>

                    </div>


                    <div className="flex justify-center">
                        <button className="shadow bg-darkOrange hover:ease-in transform hover:scale-110 transition duration-200 m-2 hover:bg-white hover:text-darkOrange focus:shadow-outline focus:outline-none text-white font-bold py-2 px-4 rounded" type="submit">
                            Sign In
                        </button>

                    </div>

                    <div className="flex justify-center">
                        <label className="text-darkOrange">
                            <small>
                                Don't have an account?
                                <a href>
                                    <u>
                                        <Link to={"/signup"}>Sign up here</Link>
                                        {" "} </u>
                                </a>
                            </small>
                        </label>
                    </div>
                </div>
                <div className="mt-5">
                    <ReCAPTCHA
                        className="recaptcha"
                        sitekey={SITE_KEY}
                        ref={captchaRef}
                    />
                </div>
            </form>

        </div>
    );
};

export default Form;
