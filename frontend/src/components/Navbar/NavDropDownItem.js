import React from "react";
import { Link } from "react-router-dom";
import { useLocation } from "react-router-dom";

function NavDropDownItem({ children, to, className, adminPrefix, onClick }) {
    const { pathname } = useLocation();
    const toLink = !to ? "" : adminPrefix ? `/admin${to}` : to;
    const active = pathname.split("/admin").join("") === to;

    return (
        <Link
            to={toLink}
            onClick={onClick}
            className={`btn btn-ghost flex items-center justify-center text-xl text-gray-900 space-x-2 ${
                active ? "text-mainOrange bg-base-300" : ""
            }`}
        >
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

export default NavDropDownItem;
