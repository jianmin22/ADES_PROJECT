import React from "react";
import { useEffect, useState } from "react";
import useAuth from "../hooks/useAuth";

import Stack_1 from "../assets/home/Stack_1.png";
import Stack_2 from "../assets/home/Stack_2.png";
import Stack_3 from "../assets/home/Stack_3.png";

import { Link } from "react-router-dom";
import useAxiosPrivate from "../hooks/useAxiosPrivate";

const Home = () => {
    const axiosPrivate = useAxiosPrivate();
    const { auth } = useAuth();

    useEffect(() => {
        console.log(auth);
    }, []);

    const getUserName = async () => {
        try {
            const res = await axiosPrivate.get("/userinfo/name");
        } catch (err) {
            console.error(err);
        }
    };

    useEffect(() => {
        getUserName();
    }, []);

    return (
        <div className="hero min-h-screen bg-white flex flex-col justify-center px-4">
            <div className="hero-content flex-col lg:flex-row-reverse">
                <div className="flex flex-col items-center">
                    <div className="text-6xl text-mainOrange flex flex-col items-center flex-center m-2">
                        <h1 className="font-bold font-serif tracking-tighter text-center text-5xl md:6xl">
                            Huang's Bakery
                        </h1>
                        <h4 className="pt-4 italic tracking-widest text-lg md:text-xl text-center">
                            a world of wonderful goods!
                        </h4>
                    </div>

                    <div className="py-8">
                        <div className="h-48 md:h-96 carousel rounded-box border shadow-lg">
                            <div className="carousel-item h-full">
                                <img src={Stack_2} />
                            </div>
                            <div className="carousel-item h-full">
                                <img src={Stack_3} />
                            </div>
                            <div className="carousel-item h-full">
                                <img src={Stack_1} />
                            </div>
                        </div>
                    </div>
                    <p className="py-6 max-w-md text-center tracking-wider lowercase text-sm md:text-base">
                        at Huang's Bakery, a team of talented bakers are
                        commited to serving only the best to your doorsteps
                    </p>
                    <Link to="/shop/search">
                        <button class="cssbuttons-io-button uppercase">
                            Get started
                            <div class="icon">
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    viewBox="0 0 24 24"
                                    width="24"
                                    height="24"
                                >
                                    <path fill="none" d="M0 0h24v24H0z"></path>
                                    <path
                                        fill="currentColor"
                                        d="M16.172 11l-5.364-5.364 1.414-1.414L20 12l-7.778 7.778-1.414-1.414L16.172 13H4v-2z"
                                    ></path>
                                </svg>
                            </div>
                        </button>
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default Home;
