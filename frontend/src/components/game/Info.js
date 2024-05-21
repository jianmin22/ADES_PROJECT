import React from 'react';

const Info = ({ info, setInfo }) => {
  return (
    info && (
      <div className='fixed inset-0 z-50 flex justify-center items-center bg-white bg-opacity-50'>
        <div className='w-96 p-6 bg-white rounded-lg shadow-md'>
          <h2 className='mb-4 text-xl font-bold'>Draw Rules</h2>
          <ul>
            <li>Everyday at 6pm SG time, a new number is generated</li>
            <li>Max 3 tries per day (day ends at 6pm)</li>
            <li>No Duplicate values</li>
            <li>Claiming period is only 2 days, so hurry claim your 1k points!</li>
          </ul>
          <div className='flex justify-end'>
            <button
              onClick={()=>setInfo(false)}
              className='bg-orange-500 text-white font-bold py-2 px-4 rounded-full'
            >
              OK
            </button>
          </div>
        </div>
      </div>
    )
  );
};

export default Info;
