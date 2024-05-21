import logo from "../assets/hb_rect_log.png";
import userIcon from "../assets/user.png";
import bellIcon from "../assets/bell.png";
import giftIcon from "../assets/gift-box.png";
import reviewHistoryIcon from "../assets/reviewHistory.png";

import {useEffect, useState, useRef} from "react";
import {useNavigate, Link} from "react-router-dom";

import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {
    faUser,
    faSignOutAlt,
    faGaugeHigh,
    faBullhorn,
    faShop,
    faUsers,
    faTags,
    faGift,
    faTruck,
    faChartSimple,
    faRectangleList,
    faHouse,
    faRightFromBracket,
    faMessage,
    faBars
} from "@fortawesome/free-solid-svg-icons";

import useAuth from "../hooks/useAuth";
import useAxiosPrivate from "../hooks/useAxiosPrivate";
import useLogout from "../hooks/useLogout";

import SidebarItem from "./Navbar/SidebarItem";
import NavbarItem from "./Navbar/NavbarItem";
import ShoppingCart from "./Navbar/ShoppingCart";
import NavDropDownItem from "./Navbar/NavDropDownItem";

import "@fortawesome/fontawesome-free/css/all.css"; // Import Font Awesome CSS
import "./Navbar.css";

export function Navbar() {
    const [menuOpen, setMenuOpen] = useState(false);
    const [Home, Shop, Announcements, ContactUs, Login, Signup, Cart, AboutUs] = [
        "",
        "shop/search",
        "announcements",
        "contact",
        "login",
        "signup",
        "cart",
        "aboutus"
    ];
    const {auth} = useAuth();

    const isLoggedIn = !auth.accessToken == false;
    const role = !auth.role ? null : auth.role;

    const handleMenuClick = () => {
        setMenuOpen(!menuOpen);
    };

    return (<nav className="top-0 z-20 p-0">
        <div className="h-28 flex flex-row justify-between items-center shadow-lg bg-white px-6 md:px-12">
            <Link to={Home}>
                <img src={logo}
                    alt="logo"
                    className="h-24 w-48"/>
            </Link>

            <div className="hidden md:flex justify-between space-x-2 lg:space-x-16">
                <NavbarItem to={Home}>Home</NavbarItem>
                <NavbarItem to={Shop}>Shop</NavbarItem>
                <NavbarItem to={AboutUs}>About Us</NavbarItem>
                <NavbarItem to={ContactUs}>Contact Us</NavbarItem>

                <NavbarItem to={Announcements}>Announcements</NavbarItem>
                {
                role === "admin" ? (<NavbarItem to="/admin">Admin</NavbarItem>) : ("")
            } </div>

            <div className="hidden md:flex items-center justify-between space-x-6"> {
                ! isLoggedIn ? (<div className="flex items-center justify-center space-x-4">
                    <Link to={Login}
                        className="text-lg font-semibold ">
                        Login
                    </Link>
                    <Link to={Signup}
                        className="text-white text-lg lg:text-xl bg-mainOrange font-semibold px-4 py-1 rounded-full">
                        Sign Up
                    </Link>
                </div>) : role != "admin" ? (<>
                    <ShoppingCart/>
                    <Link to="/profile/account" className="btn btn-primary btn-circle text-xl">
                        <FontAwesomeIcon icon={faUser}/>
                    </Link>
                </>) : (<Link to="/admin/profile" className="btn btn-primary btn-circle text-xl">
                    <FontAwesomeIcon icon={faUser}/>
                </Link>)
            } </div>

            <button id="menu-btn"
                className={
                    `block hamburger md:hidden focus:outline-none ${
                        menuOpen ? "open" : ""
                    }`
                }
                onClick={handleMenuClick}>
                <span className="hamburger-top"></span>
                <span className="hamburger-mid"></span>
                <span className="hamburger-bot"></span>
            </button>
        </div>

        <div className={
            `${
                menuOpen ? "block" : "hidden"
            } md:hidden`
        }>
            <div id="menu"
                className={
                    `absolute ${
                        menuOpen ? "flex" : "hidden"
                    } flex-col items-center self-end font-bold bg-gray-100 text-black sm:w-auto sm:self-center left-6 right-6 shadow-lg divide-y divide-gray-300 border border-gray-300 top-28 rounded-b-xl`
            }>
                <Link className="hover:bg-mainOrange w-full text-center py-3 transition-all hover:text-white"
                    to={
                        `${Home}`
                }>
                    Home
                </Link>
                <Link className="hover:bg-mainOrange w-full text-center py-3 transition-all hover:text-white"
                    to={
                        `${Shop}`
                }>
                    Shop
                </Link>
                <Link className="hover:bg-mainOrange w-full text-center py-3 transition-all hover:text-white"
                    to={
                        `${ContactUs}`
                }>
                    Contact us
                </Link>
                <Link className="hover:bg-mainOrange w-full text-center py-3 transition-all hover:text-white"
                    to={
                        `${Announcements}`
                }>
                    Announcements
                </Link>
                {
                role === "admin" ? (<Link className="hover:bg-mainOrange w-full text-center py-3 transition-all hover:text-white" to="/admin">
                    Admin
                </Link>) : ("")
            }
                <Link className="hover:bg-mainOrange w-full text-center py-3 transition-all hover:text-white"
                    to={
                        `${Cart}`
                }>
                    Cart
                </Link>
                {
                !auth ?. accessToken ? (<>
                    <Link className="text-mainOrange hover:bg-mainOrange w-full text-center py-3 transition-all hover:text-white"
                        to={Login}>
                        Login
                    </Link>
                    <Link className="text-mainOrange hover:bg-mainOrange w-full text-center py-3 transition-all hover:text-white"
                        to={Signup}>
                        Sign Up
                    </Link>
                </>) : (<Link className="text-mainOrange hover:bg-mainOrange w-full text-center py-3 transition-all hover:text-white"
                    to={"/profile/account"}>
                    Profile
                </Link>)
            } </div>
        </div>
    </nav>);
}

export const Profile_navbar = ({page}) => {
    const navigate = useNavigate();
    const logout = useLogout();
    const axiosPrivate = useAxiosPrivate();
    const [name, setName] = useState("");
    const [dateJoined, setDateJoined] = useState("");

    const signOut = async () => {
        localStorage.setItem("logged", false);
        await logout();
        console.log("This was pressed");
        navigate("/home");
    };

    const getUserName = async () => {
        try {
            const res = await axiosPrivate.get("/userinfo/name");
            if (res.data) {
                setName(res.data.username);
            }
        } catch (err) {
            console.error(err);
        }
    };
    const getdateJoined = async () => {
        try {
            const res = await axiosPrivate.get("/userinfo/dateJoined");
            if (res.data) {
                setDateJoined(res.data.dateJoined);
            }
        } catch (err) {
            console.error(err);
        }
    };

    useEffect(() => {
        getUserName();
        getdateJoined();
    }, []);

    let accountSelected = "flex justify-start mb-4 ";
    let reviewHistorySelected = "flex justify-start mb-4 ";
    let rewardsSelected = "flex justify-start ";
    switch (page) {
        case "account": accountSelected += "pl-6 border-l-4 border-mainOrange-300 ";
            break;
        case "reviewHistory": reviewHistorySelected += "pl-6 border-l-4 border-mainOrange-300 ";
            break;
        case "rewards": rewardsSelected += "pl-6 border-l-4 border-mainOrange-300 ";
            break;
    }
    return (<div className="ml-3 rounded-xl w-1/5 flex drop-shadow-xl flex-col min-w-max">
        <div className="grow bg-mainOrange rounded-xl drop-shadow-xl w-11/12 min-w-max">
            <h2 className="pt-5 text-center text-white font-semibold md:text-2xl sm:text-xl text-md hover:text-xl duration-500"> {" "}
                {name}
                {" "} </h2>
            <div className="flex justify-center">
                <p className="text-center text-xs opacity-40">
                    Joined: {dateJoined}
                    {" "} </p>
            </div>

            <div className="flex justify-center my-16 text-center min-w-max mx-3 md:mx-0">
                <div>
                    <Link to={"/profile/account"}
                        className={accountSelected}>
                        <img src={userIcon}
                            className="w-5 h-5 sm:w-6 sm:h-6 my-auto mr-2 sm:mr-3"/>
                        <p className="lg:text-xl md:text-md sm:text:sm font-bold">
                            My Account
                        </p>
                    </Link>
                    <Link to={"/profile/reviewHistory"}
                        className={reviewHistorySelected}>
                        <img src={reviewHistoryIcon}
                            className="w-5 h-5 sm:w-6 sm:h-6 my-auto mr-2 sm:mr-3"/>
                        <p className="lg:text-xl md:text-md sm:text:xs font-bold">
                            Review History
                        </p>
                    </Link>
                    <Link to={"/profile/rewards"}
                        className={rewardsSelected}>
                        <img src={giftIcon}
                            className="w-5 h-5 sm:w-6 sm:h-6 my-auto mr-2 sm:mr-3"/>
                        <p className="lg:text-xl md:text-md sm:text:xs font-bold">
                            Rewards
                        </p>
                    </Link>
                    <div className="lg:text-xl md:text-md sm:text:xs font-bold mt-5 text-white">
                        <hr></hr>
                        Delivery Status:
                        <hr></hr>
                    </div>

                    <div className="text-white">
                        <Link to={"/userTransactionHistoryPending"}
                            className="text-2xl flex items-center m-5">
                            <i className="fa-solid fa-clock w-5 h-5 sm:w-6 sm:h-6 my-auto mr-2 sm:mr-3"></i>
                            <div className="lg:text-xl md:text-md sm:text:xs font-bold">
                                Pending
                            </div>
                        </Link>

                        <Link to={"/userTransactionHistoryDelivering"}
                            className="text-2xl flex items-center m-5">
                            <i className="fa-solid fa-truck w-5 h-5 sm:w-6 sm:h-6 my-auto mr-2 sm:mr-3"></i>
                            <div className="lg:text-xl md:text-md sm:text:xs font-bold"> {" "}
                                Delivering
                            </div>
                        </Link>

                        <Link to={"/userTransactionHistorySuccess"}
                            className="text-2xl flex items-center m-5">
                            <i className="fas fa-truck-ramp-box w-5 h-5 sm:w-6 sm:h-6 my-auto mr-2 sm:mr-3"></i>
                            <div className="lg:text-xl md:text-md sm:text:xs font-bold">
                                Success
                            </div>
                        </Link>

                        <Link to={"/userTransactionHistoryFailed"}
                            className="text-2xl flex items-center m-5">
                            <i className="fas fa-circle-exclamation w-5 h-5 sm:w-6 sm:h-6 my-auto mr-2 sm:mr-3"></i>
                            <div className="lg:text-xl md:text-md sm:text:xs font-bold">
                                Failed
                            </div>
                        </Link>
                    </div>

                    <button className="absolute bottom-0 left-0 right-0 flex m-2 p-2"
                        onClick={signOut}>
                        <FontAwesomeIcon icon={faSignOutAlt}
                            className="w-5 h-5 sm:w-6 sm:h-6 my-auto mr-2 sm:m-3 lg:text-xl md:text-md sm:text:xs text-white p-1"/>
                        <p className="lg:text-xl md:text-md sm:text:xs font-bold text-white p-1 pt-3">
                            Sign out
                        </p>
                    </button>
                </div>
            </div>
        </div>
    </div>);
};

export const ManagerNavBar = () => {
    const [menuOpen, setMenuOpen] = useState(false);
    const navigate = useNavigate();
    const logout = useLogout();
    const signOut = async () => {
        await logout();
        console.log("Logout was pressed");
        navigate("/login");
    };

    const handleMenuClick = () => {
        setMenuOpen(!menuOpen);
    };

    const dropdownRef = useRef(null);

    useEffect(() => {
        const handleOutsideClick = (event) => {
            if (dropdownRef.current && ! dropdownRef.current.contains(event.target)) {
                setMenuOpen(false);
            }
        };

        document.addEventListener("mousedown", handleOutsideClick);

        return() => {
            document.removeEventListener("mousedown", handleOutsideClick);
        };
    }, []);

    return (<nav className="top-0 z-20 p-0">
        <div className="h-28 flex flex-row justify-between items-center shadow-lg bg-white px-6 md:px-12">
            <Link to="/home">
                <img src={logo}
                    alt="logo"
                    className="h-24 w-48"/>
            </Link>

            <div className="dropdown dropdown-end"
                ref={dropdownRef}>
                <label tabIndex={0}
                    className="btn btn-ghost btn-circle !rounded-md"
                    onClick={handleMenuClick}>
                    <FontAwesomeIcon icon={faBars}
                        className="text-xl"/>
                </label>
                <ul tabIndex={0}
                    className={
                        `menu menu-sm dropdown-content mt-10 z-[1] p-2 shadow-lg border bg-base-100 rounded-box w-52 ${
                            !menuOpen ? "hidden" : ""
                        }`
                }>
                    <NavDropDownItem to=""
                        adminPrefix={true}
                        onClick={handleMenuClick}>
                        Dashboard
                    </NavDropDownItem>

                    <NavDropDownItem to="/announcements"
                        adminPrefix={true}
                        onClick={handleMenuClick}>
                        Announcements
                    </NavDropDownItem>
                    <NavDropDownItem to="/products"
                        adminPrefix={true}
                        onClick={handleMenuClick}>
                        Products
                    </NavDropDownItem>
                    <NavDropDownItem to="/inquiry"
                        adminPrefix={true}
                        onClick={handleMenuClick}>
                        Inquiry
                    </NavDropDownItem>

                    <div className="divider"></div>

                    <NavDropDownItem to="/users"
                        adminPrefix={true}
                        onClick={handleMenuClick}>
                        Users
                    </NavDropDownItem>
                    <NavDropDownItem to="/voucher"
                        adminPrefix={true}
                        onClick={handleMenuClick}>
                        Vouchers
                    </NavDropDownItem>
                    <NavDropDownItem to="/points"
                        adminPrefix={true}
                        onClick={handleMenuClick}>
                        Points
                    </NavDropDownItem>

                    <div className="divider"></div>

                    <NavDropDownItem to="/delivery"
                        adminPrefix={true}
                        onClick={handleMenuClick}>
                        Delivery
                    </NavDropDownItem>
                    <NavDropDownItem to="/report"
                        adminPrefix={true}
                        onClick={handleMenuClick}>
                        Report
                    </NavDropDownItem>
                    <NavDropDownItem to="/transaction"
                        adminPrefix={true}
                        onClick={handleMenuClick}>
                        Transaction History
                    </NavDropDownItem>

                    <div className="divider"></div>

                    <NavDropDownItem to="/"
                        adminPrefix={false}
                        onClick={handleMenuClick}>
                        Home
                    </NavDropDownItem>

                    <button className="btn btn-error mt-4"
                        onClick={signOut}>
                        Logout
                    </button>
                </ul>
            </div>
        </div>
    </nav>);
};

export const AdminSidebar = () => {
    const navigate = useNavigate();
    const logout = useLogout();

    const signOut = async () => {
        localStorage.setItem("logged", false);
        await logout();
        navigate("/home");
    };

    return (<div className="w-max px-4 py-2 bg-base-200 h-screen sticky top-0 hidden md:flex flex-col justify-between flex-shrink-0">
        <div className="flex flex-col space-y-2">
            <SidebarItem to=""
                icon={faGaugeHigh}
                adminPrefix={true}>
                Dashboard
            </SidebarItem>
            <SidebarItem to="/announcements"
                icon={faBullhorn}
                adminPrefix={true}>
                Announcements
            </SidebarItem>
            <SidebarItem to="/products"
                icon={faShop}
                adminPrefix={true}>
                Products
            </SidebarItem>
            <SidebarItem to="/inquiry"
                icon={faMessage}
                adminPrefix={true}>
                Inquiry
            </SidebarItem>

            <div className="divider"></div>

            <SidebarItem to="/users"
                icon={faUsers}
                adminPrefix={true}>
                Users
            </SidebarItem>
            <SidebarItem to="/voucher"
                icon={faTags}
                adminPrefix={true}>
                Vouchers
            </SidebarItem>
            <SidebarItem to="/points"
                icon={faGift}
                adminPrefix={true}>
                Points
            </SidebarItem>

            <div className="divider"></div>

            <SidebarItem to="/delivery"
                icon={faTruck}
                adminPrefix={true}>
                Delivery
            </SidebarItem>
            <SidebarItem to="/report"
                icon={faChartSimple}
                adminPrefix={true}>
                Report
            </SidebarItem>
            <SidebarItem to="/transaction"
                icon={faRectangleList}
                adminPrefix={true}>
                Transaction History
            </SidebarItem>

            <div className="divider"></div>

            <SidebarItem to="/home"
                icon={faHouse}
                adminPrefix={false}>
                Home
            </SidebarItem>
        </div>

        <Link className="btn btn-ghost flex items-center justify-between text-xl text-gray-800"
            onClick={signOut}>
            <FontAwesomeIcon icon={faRightFromBracket}
                className="rotate"/>
            <h1 className="normal-case">Logout</h1>
        </Link>
    </div>);
};
