import React, { useState, useEffect } from 'react';
import useAxiosPrivate from "../../hooks/useAxiosPrivate"

function MailingList() {
  const axiosPrivate = useAxiosPrivate();
  const [mailingList, setMailingList] = useState([]);

  useEffect(() => {
    const getUsers = async () => {
      try {
        const res = await axiosPrivate.get('/mail');
        console.log(res.data)
        setMailingList(res.data);
      } catch (error) {
        console.error('Error:', error);
      }
    };

    getUsers();
  }, [axiosPrivate]);

  return (
    <div className='flex flex-col justify-center p-4'>
      <h1 className='m-4'>Mailing List</h1>
      <div className=' bg-lightOrange rounded-md'>
        {mailingList.length > 0 ? (
        <table class="table-fixed m-5">
        <thead>
          <tr>
            <ol><li><th>Emails</th></li></ol>
          </tr>
        </thead>
        <tbody>
        {mailingList.map((user) => (
              <tr key={user.id}>
                  <td>{user.email}</td>
              </tr>
            ))}
        </tbody>
      </table>
        ) : (
          <h1>No subscriptions</h1>
        )}
      </div>
    </div>
  );
}

export default MailingList;
