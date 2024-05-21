import React from "react";
import { useState, useEffect } from "react";
import Loading from "../Utilities/Loading";
import Pagination from "../../components/Utilities/Pagination";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";
import AnnouncementItem from "./subcomponents/AnnouncementItem";

function AllAnnouncements() {
    const axios = useAxiosPrivate();
    const [isLoading, setIsLoading] = useState(false);
    const [title, setTitle] = useState("");
    const [page, setPage] = useState(1);
    const [maxPage, setMaxPage] = useState(1);
    const [data, setData] = useState([]);

    const handleSearch = async () => {
        try {
            const { data } = await axios.post("/announcements/search", {
                title: title,
                page: page,
            });
            setData(data.data);

            let pageCount = parseInt(data.count);
            setMaxPage(Math.ceil(pageCount / 10));
        } catch (e) {
            console.error(e);
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault()
        handleSearch()
    }

    useEffect(() => {
        handleSearch();
    }, []);
    return (
        <>
            {isLoading ? (
                <Loading />
            ) : (
                <div className="flex-grow flex flex-col w-full h-full items-center justify-center">
                    <div className="w-full mb-8 flex justify-center items-center">
                        <form className="flex max-w-md w-full space-x-2">
                            <input
                                type="text"
                                placeholder="Announcement Title"
                                className="input input-bordered w-full"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                            />

                            <button
                                className="btn btn-primary"
                                onClick={handleSubmit}
                                type="submit"
                            >
                                Search
                            </button>
                        </form>
                    </div>

                    {data.length == 0 ? (
                        <h1>No Announcements...</h1>
                    ) : (
                        <div className="space-y-4 flex-grow w-full flex flex-col items-center">
                            {data.map((item) => (
                                <AnnouncementItem
                                    key={item.announcementId}
                                    data={item}
                                />
                            ))}
                        </div>
                    )}

                    <div className="w-full mt-4">
                        <Pagination
                            currentPage={page}
                            setCurrentPage={setPage}
                            maxPage={maxPage}
                        />
                    </div>
                </div>
            )}
        </>
    );
}

export default AllAnnouncements;
