import React from "react";
import { Link } from "react-router-dom";
import {} from "@fortawesome/fontawesome-free"
function AnnouncementItem({ data }) {
    return (
        <div className="flex flex-col w-full items-center justify-center">
            <div className="w-full max-w-3xl bg-base-100 border p-4 shadow-lg flex items-start justify-between text-lg">
                <h1 className="text-mainOrange font-bold">{data.title}</h1>

                <div className="flex flex-col items-end justify-center">
                    <h1>{data.CREATED_AT}</h1>
                    <h1 className="text-sm italic text-gray-400">
                        Posted By: {data.username}
                    </h1>
                </div>
            </div>

            <Link to={`/announcements/${data.announcementId}`} className="w-full max-w-3xl bg-base-100 border p-4 shadow-lg flex items-start justify-between text-sm">
                View Announcement
            </Link>
        </div>
    );
}

export default AnnouncementItem;
