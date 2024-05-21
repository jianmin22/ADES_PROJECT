import React, { useState } from "react";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useLocation } from "react-router-dom";

function SidebarItem({ children, to, icon, className, adminPrefix }) {
    const { pathname } = useLocation();
    const toLink = !to ? "" : adminPrefix ? `/admin${to}` : to
    const active = pathname.split("/admin").join("") === to

    
    return (
        <Link
            to={toLink}
            className={`btn btn-ghost flex items-center justify-start text-xl text-gray-900 space-x-2 ${active ? "text-mainOrange bg-base-300" : ""}`}
        >
            <FontAwesomeIcon icon={icon} className="w-6 h-6" />
            <h1
                className={
                    !className ? "font-light normal-case text-base" : className
                }
            >
                {children}
            </h1>
        </Link>
    );
}

export default SidebarItem;
