import React, { useState, useEffect, useContext } from 'react';
import useAxiosPrivate from '../../hooks/useAxiosPrivate';
import AuthContext from '../../context/AuthProvider';
import SuccessModal from "../Modals/SuccessModal"

const AllEntries = ({ viewEntries, setViewEntries, entry }) => {
  const [err, setErr] = useState('');
  const { auth } = useContext(AuthContext);

  const [received, setReceived] = useState(false)

  const axiosPrivate = useAxiosPrivate();
  const [result, setResult] = useState([]);

  const [success, setSuccess] = useState(false)

  const getAllEntries = async () => {
    try {
      const res = await axiosPrivate.get(`game/allEntries?user=${auth?.userId}`);
      console.log(res?.data)
      console.log(auth?.userId)
      setResult(res.data);
    } catch (e) {
      setErr(e);
    }
  };

  const claimPrize = async (date) => {
    try {
      const res = await axiosPrivate.put("game/claim?date=" + date + "&userid="+auth?.userId)
      setReceived(true)
      console.log(res?.data)
    } catch (error) {
      console.error(error)
      setErr(error)
    }
  }

  useEffect(() => {
    getAllEntries();
  }, []);
  useEffect(() => {
    getAllEntries();
  }, [entry]);

  useEffect(() => { if (received == true) setSuccess(true) }, [received])

  return (
    <div className='m-5 bg-white rounded-md p-5' style={{ display: viewEntries ? 'block' : 'none' }}>

      <SuccessModal successIsOpen={success}
        successMessage={"Points Claimed!"}
        onSuccessClose={
          () => {
            setSuccess(!success)
          }
        } />
      <h1 className='m-4'>All Entries Today:</h1>

      {result.map((index) => (
        <div key={index} className='m-2 flex bg-lightOrange p-3 rounded-md'>
          <div className='pr-3'>{index.numberInput}</div>
          |
          <div className='pl-3'>{index.date}</div>

          {index.won == 1 && index.claimed == 0 && !received ? (<div><button className='m-2 bg-lightOrange' onClick={() => { claimPrize(index.date) }}>Claim</button></div>) : (<div></div>)}
          <hr />
        </div>
      ))}
      <button onClick={() => setViewEntries(false)}>Close</button>
    </div>
  );
};

export default AllEntries;
