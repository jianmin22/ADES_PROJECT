import axios from "../api/axios";
import useAuth from "../hooks/useAuth";
import React, { useState, useEffect } from 'react';
import {Link} from 'react-router-dom'
import useAxiosPrivate from "../hooks/useAxiosPrivate";

const Customer = () => {
    const [cust, setCust] = useState();

    const axiosPrivate = useAxiosPrivate()
    useEffect(() => {
        let isMounted = true;
        const controller = new AbortController();

        const getCust = async () => {
            try {
                const response = await axiosPrivate.get('/users');
                isMounted && setCust(response.data);

            } catch (err) {
                console.error(err);
            }
        }

        getCust();

    }, [])

    return (
        <article>
            <h2>Cust List</h2>
            {cust?.length
                ? (
                    <ul>
                        {cust.map((cust, i) => <li key={i}>{cust?.username}</li>)}
                    </ul>
                ) : <p>No users</p>
            }
        </article>
    );
};

export default Customer;
