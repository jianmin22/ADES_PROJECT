import React, { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import axios from '../../api/axios'
import SuccessModal from '../Modals/SuccessModal'


const SignUpForm = () => {

    const navigate = useNavigate()

    const [username, setUsername] = useState('')
    const [email, setEmail] = useState('')
    const [pwd, setPwd] = useState('')
    const [rePwd, setRePwd] = useState('')
    const [same, setSame] = useState(false)
    const [err, setErr] = useState("")
    const [bday, setBday] = useState(null)
    const [success, setSuccess] = useState(false)
    const [today, setToday] = useState("");
    const [validPwd, setValidPwd] = useState(true)

    const [userid, setUserid] = useState("")

    useEffect(() => {
        if (pwd !== rePwd) {
            setErr("Passwords do not match!")
        } else {
            setErr("")
            setSame(true)
        }
    }, [rePwd, pwd])

    useEffect(() => {
        var dtToday = new Date();
        var month = dtToday.getMonth() + 1;
        var day = dtToday.getDate();
        var year = dtToday.getFullYear();

        if (month < 10)
            month = '0' + month.toString();
        if (day < 10)
            day = '0' + day.toString();

        var maxDate = year + '-' + month + '-' + day;
        setToday(maxDate)
    })

    const handleSubmit = async (e) => {
        e.preventDefault(); // Prevent default form submission

        const reqBody = {
            user: username,
            pwd: pwd,
            email: email,
            bday: bday
        };

        try {
            const res = await axios.post("/register", reqBody);

            localStorage.setItem("uuid", res.data.uuid)
            setUserid(res.data.uuid)

            const reqs = [
                axios.post("/register/newc", { userId: res.data.uuid }),
                axios.post("/register/newp", { userId: res.data.uuid }),
            ]
            
            const responses = await Promise.all(reqs);

            // Process the response if needed
            setSuccess(true)

        } catch (err) {
            if (err?.response) {
                console.log("This is the Error::",err)
                const statusCode = err.response.status;
                console.log(statusCode)
                let errorMessage = "No server response";
                
                if (statusCode === 409) {
                    errorMessage = "Account already exists!";
                } else if (statusCode === 500) {
                    errorMessage = "Something went wrong, error 500";
                }
                setErr(errorMessage);
            } else {
                setErr("");
            }
        }
    };


    return (<div className="flex justify-center items-center m-3">
        
        <SuccessModal successIsOpen={success}
            successMessage={"Email confirmation sent! Please check your mail for email verfication"}
            onSuccessClose={
                () => {
                    setSuccess(!success)
                    navigate("/confirmation?id="+userid);
                }
            } />
        <form className="w-full max-w-sm bg-mainOrange rounded-xl p-10 shadow-lg m-3"
            onSubmit={handleSubmit}>

            <h1 className="text-4xl mb-4 text-white">Account Details</h1>

            <div className="bg-red-200 rounded-sm m-3"> {err} </div>

            <div className="justify-center items-center">
                <div className="md:flex md:items-center mb-6">
                    <div className="md:w-1/3">
                        <label className=" text-white md:text-right mb-1 md:mb-0 pr-4" for="user">
                            Username:
                        </label>
                    </div>
                    <div className="md:w-2/3">
                        <input className="bg-white-200 appearance-none border-2 border-gray-200 rounded-xl w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:border-orange-300 shadow" id="user" type="text" autoComplete="off"
                            onChange={
                                (e) => setUsername(e.target.value)
                            }
                            value={username}
                            required />
                    </div>
                </div>
                <div className="md:flex md:items-center mb-6">
                    <div className="md:w-1/3">
                        <label className="block text-white md:text-right mb-1 md:mb-0 pr-4" for="pwd" >
                            Password:
                        </label>
                    </div>
                    <div className="md:w-2/3">
                        <input className="bg-white-200 appearance-none border-2 border-gray-200 rounded-xl w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:border-orange-300 shadow" id="pwd" type="password"
                            onChange={
                                (e) => { setPwd(e.target.value) 
                                            setValidPwd(false)}
                            }
                            value={pwd}
                            required
                            pattern="^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$"/>
                    </div>
                </div>
                <div className="md:flex md:items-center mb-6">
                    <div className="md:w-1/3">
                        <label className="block text-white md:text-right mb-1 md:mb-0 pr-4" for="pwd">
                            Re-type Password:
                        </label>
                    </div>
                    <div className="md:w-2/3">
                        <input className="bg-white-200 appearance-none border-2 border-gray-200 rounded-xl w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:border-orange-300 shadow" id="rePwd" type="password"
                            onChange={
                                (e) => setRePwd(e.target.value)
                            }
                            value={rePwd}
                            required />
                    </div>
                </div>
                <div className="md:flex md:items-center mb-6">
                    <div className="md:w-1/3">
                        <label className="block text-white md:text-right mb-1 md:mb-0 pr-4" for="pwd">
                            Email:
                        </label>
                    </div>
                    <div className="md:w-2/3">
                        <input className="bg-white-200 appearance-none border-2 border-gray-200 rounded-xl w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:border-orange-300 shadow" id="email" type="email"
                            onChange={
                                (e) => setEmail(e.target.value)
                            }
                            value={email}
                            required />
                    </div>
                </div>
                <div className="md:flex md:items-center mb-6">
                    <div className="md:w-1/3">
                        <label className="block text-white md:text-right mb-1 md:mb-0 pr-4" for="pwd">
                            (Optional) Birthday
                        </label>
                    </div>
                    <div className="md:w-2/3">
                        <input max={today} className="bg-white-200 appearance-none border-2 border-gray-200 rounded-xl w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:border-orange-300 shadow" id="bday" type="date"
                            onChange={
                                (e) => setBday(e.target.value)
                            }
                            value={bday} />
                    </div>
                </div>


                <div className="flex justify-center">
                    <button className="shadow bg-darkOrange hover:ease-in transform hover:scale-110 transition duration-200 m-2 hover:bg-white hover:text-darkOrange focus:shadow-outline focus:outline-none text-white font-bold py-2 px-4 rounded" type="submit">
                        Create Account!
                    </button>
                </div>

                <div className="flex justify-center">
                    <label className="text-darkOrange">
                        <small>
                            Have an account?
                            <a href>
                                <u>
                                    <Link to={"/login"}>Login here!</Link>
                                </u>
                            </a>
                        </small>
                    </label>
                </div>


            </div>
        </form>
    </div>)
}

export default SignUpForm
