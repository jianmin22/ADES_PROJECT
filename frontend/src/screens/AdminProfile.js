import React, { useState, useEffect } from "react"
import useAxiosPrivate from "../hooks/useAxiosPrivate.js";

import ConfirmCancelModal from "../components/Modals/ConfirmCancelModal.js";
import { Link, useNavigate } from "react-router-dom"
import DelButton from "../components/DeleteAcc.js";
import DelUser from "../components/Modals/DelUser.js";
import EditButton from "../components/EditAcc.js";
import SaveButton from "../components/SaveAcc.js";
import SuccessModal from "../components/Modals/SuccessModal.js";

const AdminProfile = () => {


    const axiosPrivate = useAxiosPrivate();
    const selected = "account";
    const [err, setErr] = useState("")
    const [addr, setAddr] = useState([])

    const [editable, setEditable] = useState(false)
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('')
    const [birthday, setBirthday] = useState('')
    const [valid, setValid] = useState(false)
    const [pwd, setPwd] = useState('')
    const [oldPwd, setOldPwd] = useState('')
    const [pwdOpen, setPwdOpen] = useState(false)
    const [newPwd, setNewPwd] = useState('')
    const [rePwd, setRePwd] = useState('')
    const [match, setMatch] = useState(false)
    const [dupe, setDupe] = useState(false)
    const [success, setSuccess] = useState(false)
    const [confirmationIsOpen, setConfirmationIsOpen] = useState(false);
    const [cfmDelUser, setCfmDelUser] = useState(false)
    const [unsaved, setUnsaved] = useState(false)


    const handleChangeUsername = (e) => {
        setUnsaved(true)
        setUsername(e.target.value)
    }

    const handleChangeEmail = (e) => {
        const emailRegex = "/^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/";
        const input = e.target.value
        setUnsaved(true)
        setValid(!emailRegex.test(input))
        setEmail(input)
    }

    const handlePwdCheck = async () => {
        try {
            const res = await axiosPrivate.post('/userinfo/checkpwd', { oldPwd: oldPwd });

            if (res.status === 200) {
                setMatch(true);
                setErr("")
            }

        } catch (err) {
            if (err.response.status === 401) {
                setErr("Wrong password");
            } else {
                setErr("Something went wrong")
            }
        }
    };

    const handleDupe = async () => {
        if (newPwd === rePwd) {
            setDupe(true)
        } else {
            setErr("New password does not match")
        }
        return
    }

    const handleDelete = async () => {
        console.log("meow")
        try {
            const res = await axiosPrivate.delete('/userinfo/deleteuser');
            console.log("This is the res" + res)

            setErr("");
            window.location.reload();

        } catch (err) {
            if (err.response && err.response.status === 401) {
                setErr("Wrong password");
            } else {
                setErr("Something went wrong");
            }
        }
    }

    const handleChangeBirthday = (e) => {
        setUnsaved(true)
        setBirthday(e.target.value)
    }

    const handleChangeOldPwd = (e) => {
        setUnsaved(true)
        setOldPwd(e.target.value);
    };

    const handleChangeNewPwd = (e) => {
        setUnsaved(true)
        setNewPwd(e.target.value);
    };

    const handleChangeRePwd = (e) => {
        setUnsaved(true)
        setRePwd(e.target.value)
    }

    const handleSubmit = async (e) => {
        console.log("handleSubmit ran")
        try {

            const response = await axiosPrivate.put("/userinfo/updatepersonal", { email, birthday, username, pwd });

            const affectedRows = response.data;

            if (affectedRows === "OK") {
                setSuccess(true)
            }

            setUnsaved(false)

        } catch (error) {
            if (!error?.response) {
                setErr("No Server Response");
            } else if (error.response?.status === 400) {
                setErr("Missing Username or Password");
            } else if (error.response?.status === 401) {
                setErr("Incorrect password");
            } else {
                setErr("Update Failed");
            }
            console.log(error);
        }
    };


    useEffect(() => {
        const fetchData = async () => {
            try {
                const requests = [axiosPrivate.get("userinfo/personal"), axiosPrivate.get("/userinfo/address"),];

                const responses = await Promise.all(requests);

                const data = responses.map((response) => response.data);

                const [personalData, addressData] = data;

                if (personalData) {
                    setUsername(personalData.username);
                    setEmail(personalData.email);
                    if (personalData.birthday)
                        setBirthday(personalData.birthday.split("T")[0]);
                }

                if (addressData) {
                    setAddr(addressData.addresses);
                }
            } catch (error) {
                console.error(error);
                setErr("An Error has occurred " + error);
            }
        };

        fetchData();
    }, []);

    return (
        <div className="py-5 flex flex-row grow bg-lightOrange">
            <SuccessModal successIsOpen={success}
                onSuccessClose={
                    () => {
                        setSuccess(!success)
                    }
                }
                successMessage={"Successful Updated!"} /> {/* PASSWORD MODAL */}
            <modal className="fixed inset-0 flex items-center justify-center z-50"
                style={
                    {
                        display: pwdOpen ? 'flex' : 'none'
                    }
                }>

                <div className="bg-white rounded-xl p-5">
                    <h1 className="text-3xl m-3">
                        <u>
                            Change Password:
                        </u>
                    </h1>
                    <div className="bg-red-100">
                        {err}</div>
                    <form className="flex flex-col">
                        <label className="m-3">Old Password:</label>
                        <input type="text" id="oldPwd" name="oldPwd" className="bg-lightOrange rounded-lg p-2"
                            value={oldPwd}
                            onChange={handleChangeOldPwd} />

                        <label className="m-3">New Password:</label>
                        <input type="text" id="newPwd" name="newPwd" className="bg-lightOrange rounded-lg p-2"
                            value={newPwd}
                            onChange={handleChangeNewPwd} />

                        <label className="m-3">Re-type New Password:</label>
                        <input type="text" id="rePwd" name="rePwd" className="bg-lightOrange rounded-lg p-2"
                            value={rePwd}
                            onChange={handleChangeRePwd} />

                        <div className="m-3 mt-6 p-2 flex justify-around">
                            <button onClick={
                                async (e) => {
                                    e.preventDefault()
                                    await handlePwdCheck()
                                    await handleDupe()
                                    if (match && dupe) {
                                        setPwd(newPwd)
                                        setPwdOpen(false)
                                    }
                                }
                            }
                                className="bg-mainOrange text-white rounded-lg p-2">Confirm</button>
                            <button onClick={
                                (e) => {
                                    e.preventDefault()
                                    setPwdOpen(!pwdOpen)
                                }
                            }>Cancel</button>
                        </div>
                    </form>

                </div>
            </modal>

            <div className="p-2 m-5">
                <div>

                    <div className="text-4xl pb-6 text-orange-600 flex">Personal details {
                        editable ? <SaveButton handleSubmit={handleSubmit}
                            setEditable={setEditable} /> : <EditButton setEditable={setEditable} />
                    } </div>

                    <div>{unsaved ? "There are unsaved changes" : ""}</div>
                </div>


                <form>
                    <div className=" m-5 p-5 flex">
                        <div>
                            <img src="https://via.placeholder.com/200" className="rounded-lg m-1" />
                            <u className="flex justify-center text-mainOrange">Change profile image</u>
                        </div>

                        {/* PROFILE INFORMATION ===========================================================*/}

                        <div className=" text-xl text-darkOrange p-2  ml-5">
                            <div className="m-5 flex">
                                <label htmlFor="username">Username:</label>
                                <div className={
                                    editable ? "bg-white rounded-lg ml-3 pr-5 pl-5" : "bg-lightOrange rounded-lg ml-3 pr-5 pl-5"
                                }>
                                    <input className={
                                        editable ? "bg-white" : "bg-lightOrange "
                                    }
                                        id="username"
                                        user="username"
                                        type="text"
                                        value={username}
                                        readOnly={
                                            !editable
                                        }
                                        onChange={handleChangeUsername}
                                        required />
                                </div>
                            </div>
                            <div className="m-5 flex">
                                <label htmlFor="email">Email:</label>
                                <div className={
                                    editable ? "bg-white rounded-lg ml-3 pr-5 pl-5" : "bg-lightOrange rounded-lg ml-3 pr-5 pl-5"
                                }>
                                    <input className={
                                        editable ? "bg-white" : "bg-lightOrange "
                                    }
                                        id="email"
                                        user="email"
                                        type="email"
                                        value={email}
                                        readOnly={
                                            !editable
                                        }
                                        onChange={handleChangeEmail}
                                        required />
                                </div>
                            </div>
                            <div className="m-5 flex">
                                <label htmlFor="birthday">Birthday:</label>
                                <div className={
                                    editable ? "bg-white rounded-lg ml-3 pr-5 pl-5" : "bg-lightOrange rounded-lg ml-3 pr-5 pl-5"
                                }>
                                    <input className={
                                        editable ? "bg-white" : "bg-lightOrange "
                                    }
                                        id="birthday"
                                        user="birthday"
                                        type="date"
                                        value={birthday}
                                        readOnly={
                                            !editable
                                        }
                                        onChange={handleChangeBirthday} /> {
                                        birthday === "" && <p className="m-5 text-sm">No Birthday Added.</p>
                                    } </div>
                            </div>

                            <div className="m-5 flex">
                                <label htmlFor="pwd">Password:</label>
                                <button className="ml-3"
                                    onClick={
                                        (e) => {
                                            e.preventDefault()
                                            setPwdOpen(!pwdOpen)
                                        }
                                    }
                                    disabled={
                                        !editable
                                    }>
                                    {
                                        editable ? <u>Change Password</u> : "*********"
                                    }</button>
                            </div>

                            {
                                valid && <p className="m-5 text-red-500">
                                    <u>Please enter a valid email address.</u>
                                </p>
                            } </div>
                    </div>

                </form>

                <DelUser
                    visible={cfmDelUser}
                    setVisible={setCfmDelUser}
                    handleDelete={handleDelete} />
                <ConfirmCancelModal confirmationIsOpen={confirmationIsOpen}
                    onConfirm={
                        () => {
                            setConfirmationIsOpen(false)
                            setCfmDelUser(true)
                            // handleDelete()
                            // navigate("/home");
                        }
                    }
                    onCancel={
                        () => setConfirmationIsOpen(false)
                    }
                    confirmationMessage={"Are you sure you want to delete your account?"} />

                <DelButton setConfirmationIsOpen={setConfirmationIsOpen} />
            </div>

        </div>
    )
}

export default AdminProfile