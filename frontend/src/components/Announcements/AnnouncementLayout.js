import React from "react";
import { useState } from "react";
import AllAnnouncements from "./AllAnnouncements";
import MailingList from "./MailingList";
import CreateAnnouncement from "./CreateAnnouncement";

function AnnouncementLayout({ tab }) {
    const componentsMap = {
        Announcements: AllAnnouncements,
        "Create Announcement": CreateAnnouncement,
        "Mailing List": MailingList,
    };
    const SelectedComponent = componentsMap[tab];

    return (
        <div className="pt-4 flex-grow flex items-center justify-center w-full px-8">
            <SelectedComponent />
        </div>
    );
}

export default AnnouncementLayout;
