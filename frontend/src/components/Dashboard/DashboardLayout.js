import React, { useEffect, useState } from "react";
import OrdersChart from "./OrdersChart";
import PopularProductsChart from "./PopularProductsChart";
import RecentOrders from "./RecentOrders";
import SiteStatistics from "./SiteStatistics";
import TopCustomers from "./TopCustomers";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faRefresh } from "@fortawesome/free-solid-svg-icons";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";
import Loading from "../Utilities/Loading";

import GeneralModal from "../Modals/GeneralModal";

function DashboardLayout() {
    const [hasError, setHasError] = useState(false);
    const [modalOpen, setModalOpen] = useState(false);

    const [msg, setMsg] = useState("An unexpected error has occured!");
    const [isLoading, setIsLoading] = useState(true);
    const [lastUpdated, setLastUpdated] = useState(
        new Date().toLocaleDateString([], {
            month: "long",
            day: "numeric",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit",
        })
    );
    const [data, setData] = useState({
        sales: {
            users: 0,
            orders: 0,
            sales: 0,
        },
        orders: [],
    });
    const [disabled, setIsDisabled] = useState(false);
    const axios = useAxiosPrivate();

    const fetchDashboardData = async () => {
        try {
            setIsLoading(true);
            setHasError(false);

            const { data } = await axios.get("/dashboard/stats");

            setData(data);
            setLastUpdated(
                new Date().toLocaleDateString([], {
                    month: "long",
                    day: "numeric",
                    year: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                    second: "2-digit",
                })
            );
        } catch (e) {
            setMsg(e.message ? e.message : "An unexpected error has occured!");
            setHasError(true);

            setModalOpen(true)
            console.error(e);
        } finally {
            setIsLoading(false);
        }
    };

    const handleRefresh = async () => {
        setIsDisabled(true);
        await fetchDashboardData();

        setTimeout(() => setIsDisabled(false), 5000);
    };

    useEffect(() => {
        fetchDashboardData();
    }, []);

    return (
        <>
            <GeneralModal
                isOpen={modalOpen}
                setIsOpen={setModalOpen}
                header={"Error"}
                message={msg}
            />
            <div
                className={`alert alert-error my-8 ${hasError ? "" : "hidden"}`}
            >
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="stroke-current shrink-0 h-6 w-6"
                    fill="none"
                    viewBox="0 0 24 24"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                </svg>
                <span>{msg}</span>
            </div>

            <div className="flex items-center justify-center md:justify-start py-4 space-x-4">
                <h1 className="italic text-sm">Last Updated: {lastUpdated}</h1>
                <button
                    className={`${
                        disabled || isLoading
                            ? "disabled btn-disabled btn-sm"
                            : "btn btn-ghost btn-sm"
                    } ${isLoading ? "animate-spin" : ""}`}
                    onClick={handleRefresh}
                >
                    <FontAwesomeIcon icon={faRefresh} />
                </button>
            </div>

            {isLoading ? (
                <div className="flex items-center justify-center">
                    <Loading />
                </div>
            ) : hasError ? (
                <></>
            ) : (
                <>
                    <div className="w-full h-full grid grid-cols-6 xl:grid-cols-12 gap-4 py-8">
                        <div className="col-span-6 xl:col-span-2 flex xl:justify-end">
                            <SiteStatistics data={data.sales} />
                        </div>
                        <div className="col-span-6">
                            <OrdersChart data={data.orders} />
                        </div>
                        <div className="col-span-6 xl:col-span-4">
                            <PopularProductsChart data={data.popular} />
                        </div>

                        <div className="col-span-6">
                            <RecentOrders data={data.recents} />
                        </div>
                        <div className="col-span-6">
                            <TopCustomers data={data.customers} />
                        </div>
                    </div>
                </>
            )}
        </>
    );
}

export default DashboardLayout;
