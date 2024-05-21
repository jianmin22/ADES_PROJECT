import React, { useEffect, useState } from "react";
import useAxiosPrivate from "../hooks/useAxiosPrivate";
import Loading from "../components/Utilities/Loading";
import GeneralModal from "../components/Modals/GeneralModal";
import Clock from "../components/Utilities/Clock";
import DashboardLayout from "../components/Dashboard/DashboardLayout";

function Dashboard() {
    const [userData, setUserData] = useState({
        username: "",
        email: "",
        birthday: "",
        userPassword: "",
    });
    const [isLoading, setLoading] = useState(true);
    const [hasError, setHasError] = useState(false);
    const [errorMsg, setErrorMsg] = useState(
        "An unexpected error has occured while fetching data!"
    );

    const greeting =
        new Date().getHours() > 18
            ? "Good Evening"
            : new Date().getHours() > 12
            ? "Good Afternoon"
            : "Good Morning";

    const axios = useAxiosPrivate();

    const fetchData = async () => {
        try {
            setLoading(true);

            const { data } = await axios.get("userinfo/personal");

            if (!data && data?.username?.email?.birthday?.userPassword)
                throw new Error("Failed to retrieve user data");

            setUserData(data);
        } catch (e) {
            setErrorMsg(e.message);
            setHasError(true);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);
    return (
        <div className="min-h-screen h-full w-full flex p-4">
            {isLoading ? (
                <div className="flex w-full items-center justify-center">
                    <Loading />
                </div>
            ) : hasError ? (
                <GeneralModal
                    isOpen={hasError}
                    header={"Error!"}
                    message={errorMsg}
                />
            ) : (
                <div className="w-full h-full">
                    <div className="flex items-center justify-center md:justify-between w-full flex-wrap space-y-8 md:space-y-0">
                        <div className="flex items-center justify-center space-x-2 tracking-tighter font-light text-4xl">
                            <h1 className="">{greeting},</h1>
                            <h1 className="text-mainOrange font-bold tracking-normal">
                                &nbsp;{userData.username} 
                            </h1>
                        </div>
                        <Clock />
                    </div>

                    <DashboardLayout />
                </div>
            )}
        </div>
    );
}

export default Dashboard;
