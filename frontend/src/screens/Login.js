import React, { useState, useEffect, useContext } from "react";
import Form from "../components/login/Form";
import { useLocation, useNavigate } from 'react-router-dom';
import Notification from "../components/Notification";
import AuthContext from "../context/AuthProvider";

const Login = () => {

    const { auth } = useContext(AuthContext)
    const location = useLocation();
    const params = new URLSearchParams(location.search);
    const code = params.get('code');

    const navigate = useNavigate()
    const [notifMsg, setNotifMsg] = useState("");
    const [notifTitle, setNotifTitle] = useState("");
    const [showNotif, setShowNotif] = useState(false)

    useEffect(() => {
        // const logged = localStorage.getItem("logged")
        // if (logged === "true") {
        //     navigate("/profile/account")
        // }

        if (code == "deleted") {
            setNotifMsg("Account has been deleted")
            setNotifTitle("Success!")
            setShowNotif(true)
        }

    }, [])

    return (
        <>
            <Notification NotifMsg={notifMsg} NotifTitle={notifTitle} visible={showNotif} />
            <Form />
        </>
    );
};

export default Login;
