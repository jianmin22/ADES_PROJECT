import React from "react";
import { useState, useEffect } from "react";
import Loading from "../Utilities/Loading";
import Editor from "./subcomponents/Editor";
import Viewer from "./subcomponents/Viewer";
import GeneralModal from "../Modals/GeneralModal";
import ConfirmCancelModal from "./modals/ConfirmCancelModal";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";
import useAuth from "../../hooks/useAuth";

function CreateAnnouncement() {
    const axios = useAxiosPrivate();
    const { auth } = useAuth();
    const [isLoading, setIsLoading] = useState(false);
    const [content, setContent] = useState("");
    const [text, setText] = useState("");

    const [mailingList, setMailingList] = useState(false);
    const [title, setTitle] = useState("");

    const [modalOpen, setModalOpen] = useState(false);
    const [generalOpen, setGeneralOpen] = useState(false);
    const [modalHeader, setModalHeader] = useState("Message");
    const [errorMsg, setErrorMsg] = useState(
        "Sorry, an Unexpected error has occured!"
    );

    const [creatingAnnouncement, setCreatingAnnouncement] = useState(false);

    const handlePost = (e) => {
        e.preventDefault();
        try {
            if (text.split("\n").join("").trim() === "")
                throw new Error("Announcement cannot be empty!");
            if (title.trim() === "")
                throw new Error("Please add a Title for your Announcement!");

            setModalOpen(true);
        } catch (e) {
            console.error(e);
            setErrorMsg(
                !e.message
                    ? "Sorry, an Unexpected error has occured!"
                    : e.message
            );
            setGeneralOpen(true);
        }
    };

    const handleConfirmCancel = () => {
        setModalOpen(false);
    };

    const handleConfirmOK = () => {
        setModalOpen(false);
        CreateAnnouncement();
    };

    const CreateAnnouncement = async () => {
        try {
            setCreatingAnnouncement(true);

            const { data } = await axios.post("/announcements/create", {
                title: title,
                delta: content,
                userId: auth.userId,
                mailing: mailingList,
            });

            if (data === "success") {
                setModalHeader("Success");
                setErrorMsg("Announcement has successfully been made!");
                setGeneralOpen(true);
            }
        } catch (e) {
            console.error(e);
            setModalHeader("Error");
            setErrorMsg(
                !e.message
                    ? "Sorry, an Unexpected error has occured!"
                    : e.message
            );
            setGeneralOpen(true);
        } finally {
            setCreatingAnnouncement(false);
        }
    };

    return (
        <>
            <ConfirmCancelModal
                header="Confirm"
                isOpen={modalOpen}
                message="Are you sure you want to create a new Announcement?"
                onConfirm={handleConfirmOK}
                onCancel={handleConfirmCancel}
            />

            <GeneralModal
                header={modalHeader}
                isOpen={generalOpen}
                setIsOpen={setGeneralOpen}
                message={errorMsg}
            />

            {isLoading ? (
                <Loading />
            ) : (
                <div className="flex-grow w-full self-start flex-col items-center justify-center space-y-8">
                    <div className="flex flex-col lg:flex-row mb-20 lg:mb-0">
                        <Viewer content={content} />
                        <div className="divider lg:divider-horizontal lg:flex"></div>
                        <Editor setContent={setContent} setText={setText} />
                    </div>

                    <form className="flex items-center justify-start bg-base-100 rounded-md p-2 space-y-4 lg:justify-center lg:space-y-0 lg:space-x-8 flex-wrap">
                        <div className="form-control">
                            <label className="cursor-pointer label space-x-2">
                                <input
                                    type="checkbox"
                                    checked={mailingList}
                                    className="checkbox checkbox-primary"
                                    onClick={() => setMailingList(!mailingList)}
                                />
                                <span className="label-text">
                                    Notify Mailing List
                                </span>
                            </label>
                        </div>

                        <input
                            type="text"
                            placeholder="Title"
                            className="input input-bordered w-full max-w-xs"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            required
                        />

                        <button
                            className="btn btn-primary"
                            type="submit"
                            onClick={handlePost}
                        >
                            Post Announcement
                        </button>

                        {creatingAnnouncement ? <Loading /> : <></>}
                    </form>
                </div>
            )}
        </>
    );
}

export default CreateAnnouncement;
