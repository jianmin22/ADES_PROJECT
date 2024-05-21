import React, { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom"
import useAxiosPrivate from '../../hooks/useAxiosPrivate';

const DelUser = ({ handleDelete, visible, setVisible }) => {
    const [match, setMatch] = useState(false);
    const [name, setName] = useState('');
    const [input, setInput] = useState('')
    const axiosPrivate = useAxiosPrivate();
    const navigate = useNavigate()

    const getUserName = async () => {
        try {
            const res = await axiosPrivate.get('/userinfo/name');
            if (res.data) {
                setName(res.data.username);
            }
        } catch (err) {
            console.error(err);
        }
    };

    const handleInput = async (e) => {
        setInput(e.target.value)
    }

    useEffect(() => {
        getUserName();
    }, []);

    useEffect(() => {
        console.log(name === input)
        if (name === input) {
            setMatch(true)
        } else {
            setMatch(false)
        }
    }, [input])

    return (
        <div  style={
            visible ? {
                display: 'block'
            } : {
                display: 'none'
            }
        }>
            <div className='p-5 m-5 bg-white rounded flex flex-col content-center justify-center items-center' >
                <div>
                    <div className='text-xl'>Type in your username to delete:
                        <div className=' m-1 text-base text-red-500 flex flex-col content-center justify-center items-center '>
                            {name}</div>
                    </div>
                </div>

                <form>
                    <input className='bg-lightOrange p-2' type='text'
                        value={input}
                        onChange={handleInput} />
                </form>
                <div className='flex flex-row m-5 '>
                    {match ? (<button className='p-1 mr-2 bg-white rounded flex flex-col content-center justify-center items-center' onClick={() => handleDelete()}>Confirm</button>) : (<div></div>)}

                    <button className='p-1 ml-2 bg-mainOrange text-white rounded flex flex-col content-center justify-center items-center' onClick={()=>setVisible(false)}>Cancel</button>
                </div>
            </div>
        </div>
    );
};

export default DelUser;
