import React, { useState, useEffect } from 'react';
import useAxiosPrivate from '../hooks/useAxiosPrivate';

function ManagerUsers() {
    const axiosPrivate = useAxiosPrivate();
    const [users, setUsers] = useState([]); // Initialize users as an empty array
    const [err, setErr] = useState(''); // Initialize err as an empty string

    const getUsers = async () => {
        try {
            const res = await axiosPrivate('mail/all');
            setUsers(res.data);
        } catch (err) {
            console.error(err);
            setErr(err.toString());
        }
    };

    useEffect(() => {
        getUsers();
    }, []); // Fetch users when the component mounts

    return (
        <div className='w-full h-full flex justify-center items-center'>
            <div className='w-screen max-w-7xl mx-auto p-5'>
                <h1 className='text-3xl m-5'>All Users</h1>
                {err && <div>Error: {err}</div>} {/* Display the error message if err is not empty */}
                <div className='relative overflow-x-auto'>
                    <table className='w-full text-sm text-left text-gray-500 dark:text-gray-400'>
                        <thead className='text-md text-gray-700 uppercase bg-lightOrange dark:bg-gray-700 dark:text-gray-400'>
                            <tr>
                                <th scope='col' className='px-6 py-3 rounded-l-lg'>
                                    Username
                                </th>
                                <th scope='col' className='px-6 py-3'>
                                    Email
                                </th>
                                <th scope='col' className='px-6 py-3'>
                                    Verified
                                </th>
                                <th scope='col' className='px-6 py-3 rounded-r-lg'>
                                    Subscribed
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {users.length > 0 ? (
                                users.map((user) => (
                                    <tr
                                        key={user.id}
                                        className='bg-white dark:bg-gray-800'
                                    >
                                        <td className='px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white'>
                                            {user.username}
                                        </td>
                                        <td className='px-6 py-4'>{user.email}</td>
                                        <td className='px-6 py-4'>
                                            {user.verified ? 'Yes' : 'No'}
                                        </td>
                                        <td className='px-6 py-4'>
                                            {user.subscribed ? 'Yes' : 'No'}
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan='4' className='text-center'>
                                        No Users
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}

export default ManagerUsers;
