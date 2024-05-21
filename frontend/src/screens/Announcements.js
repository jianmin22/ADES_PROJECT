import axios from "../api/axios";
import { useEffect, useState } from "react";
import AnnoucementItem from "../components/Announcements/subcomponents/AnnouncementItem";
function Announcements() {
    const [data, setData] = useState([]);

    const fetchAnnouncements = async () => {
        try {
            const { data } = await axios.get("/public/announcements/all");
            setData(data);
        } catch (e) {
            console.log(e);
        }
    };

    useEffect(() => {
        fetchAnnouncements();
    }, []);

    return (
        <div className="h-screen">
            <div className="h-48 bg-mainOrange relative">
                <h1 className="absolute left-10 bottom-5 text-6xl font-bold font-sans text-white tracking-tighter">
                    Announcements
                </h1>
            </div>
            <div className="h-full w-full py-6">
                {data.length === 0 ? (
                    <h1>There are no announcements...</h1>
                ) : (
                    <div className="flex flex-col items-center justify-center space-y-4">
                        {data.map((item) => (
                            <AnnoucementItem
                                key={item.announcementId}
                                data={item}
                            />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}

export default Announcements;
