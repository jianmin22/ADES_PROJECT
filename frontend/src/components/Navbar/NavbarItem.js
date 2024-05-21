import React from "react";
import { Link } from "react-router-dom";

function NavbarItem({children, to, className}) {
    return (
        <Link to={to} className={`group ${!className ? "" : className}`}>
            <span className="text-black text-lg lg:text-xl bg-bottom p-2 bg-gradient-to-r from-mainOrange to-mainOrange bg-[length:0%_5px] bg-no-repeat group-hover:bg-[length:100%_5px] transition-all duration-150 ease-out">
                {children}
            </span>
        </Link>
    );
}

export default NavbarItem;
