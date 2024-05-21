import { Outlet, Link } from "react-router-dom";
import { ManagerNavBar, AdminSidebar } from "./Navbar";

const ManagerLayout = () => {
    return (
        <div className="flex flex-col min-h-screen h-full">
            <ManagerNavBar />
            <div className="flex md:flex-row w-full">
                <AdminSidebar />
                <Outlet />
            </div>
        </div>
    );
};

export default ManagerLayout;
