import React from "react";
import Back from "../components/Utilities/Back";
import Loading from "../components/Utilities/Loading";
import { useEffect, useState } from "react";
import axios from "../api/axios";
import { useParams } from "react-router-dom";
import Viewer from "../components/Announcements/subcomponents/Viewer";
import useAuth from "../hooks/useAuth";
import Modal from "../components/Announcements/modals/ConfirmCancelModal";
import GeneralModal from "../components/Modals/GeneralModal";
import useAxiosPrivate from "../hooks/useAxiosPrivate";
import { useNavigate } from "react-router-dom";

function ViewAnnouncement() {
    const { auth } = useAuth();
    const axiosPrivate = useAxiosPrivate();
    const navigate = useNavigate();
    const { announcement_id } = useParams();
    const [isLoading, setIsLoading] = useState(true);
    const [data, setData] = useState([]);

    const [isOpen, setIsOpen] = useState(false);
    const [successIsOpen, setSuccessIsOpen] = useState(false);

    const deleteAnnouncement = async () => {
        try {
            const { data } = await axiosPrivate.delete(
                `/announcements/delete/${announcement_id}`
            );

            if (data === "success") {
                navigate("/announcements");
                setSuccessIsOpen(true);
            }
        } catch (e) {
            console.error(e);
        }
    };

    const onConfirm = () => {
        setIsOpen(false);
        deleteAnnouncement();
    };

    const onCancel = () => {
        setIsOpen(false);
    };

    const fetchAnnouncements = async () => {
        try {
            setIsLoading(true);
            const { data } = await axios.get(
                `/public/announcements/${announcement_id}`
            );
            setData(data);
            setIsLoading(false);
        } catch (e) {
            console.error(e);
        }
    };

    useEffect(() => {
        fetchAnnouncements();
    }, []);
    return (
        <>
            <Modal
                header={"Confirm Delete"}
                message={"Are you sure you want to delete this Announcement?"}
                isOpen={isOpen}
                onCancel={onCancel}
                onConfirm={onConfirm}
            />
            <GeneralModal
                header={"Messsage"}
                message={`Successfully deleted Announcement with id: ${announcement_id}`}
                isOpen={successIsOpen}
                setIsOpen={setSuccessIsOpen}
            />
            <div className="flex flex-col w-full px-12 pt-6">
                <div className="flex justify-between">
                    <Back />
                    {auth.role === "admin" ? (
                        <div>
                            <button
                                className="btn px-6 bg-red-600 text-white rounded-md"
                                onClick={() => setIsOpen(true)}
                            >
                                Delete
                            </button>
                        </div>
                    ) : (
                        <></>
                    )}
                </div>

                <div className="flex-grow flex items-center justify-center">
                    {isLoading ? (
                        <Loading />
                    ) : (
                        <Viewer content={data.content} />
                    )}
                </div>
            </div>
        </>
    );
}

export default ViewAnnouncement;
