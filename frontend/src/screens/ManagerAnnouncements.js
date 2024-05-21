import React from "react";
import { useState } from "react";
import AnnouncementLayout from "../components/Announcements/AnnouncementLayout";
import Tab from "../components/Announcements/subcomponents/Tab";
import TabItem from "../components/Announcements/subcomponents/TabItem";
import { Route } from "react-router-dom";

function ManagerAnnouncements() {
    const [tab, setTab] = useState("Announcements");

    const handleTab = (title) => {
        setTab(title);
    };
    
    return (
        <div className="flex flex-col items-center justify-start w-full">
            <Tab>
                <TabItem
                    title="Announcements"
                    current={tab}
                    onClick={handleTab}
                />
                <TabItem
                    title="Create Announcement"
                    current={tab}
                    onClick={handleTab}
                />
                <TabItem
                    title="Mailing List"
                    current={tab}
                    onClick={handleTab}
                />
            </Tab>
            <AnnouncementLayout tab={tab} />
        </div>
    );
}

export default ManagerAnnouncements;
