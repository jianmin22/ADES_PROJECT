import React, { useState, useEffect } from 'react';
import useAxiosPrivate from '../../hooks/useAxiosPrivate';

const UpdateAddrModal = ({
    setStreet,
    setCountry,
    setUnitNumber,
    setPc,
    street,
    country,
    unitNumber,
    pc,
    setUpdate,
    err,
    updateModal,
    setErr,
    change,
    setAddr,
    addId,
    setChange
}) => {

    const axiosPrivate = useAxiosPrivate()

    const handleSubmit = async () => {
        try {
            const res1 = await axiosPrivate.put('/userinfo/updateaddr', {
                addrId: addId,
                street: street,
                country: country,
                unitNumber: unitNumber,
                pc: pc
            });

            const affectedRows = res1.data.affectedRows;
            if (affectedRows >= 1) {

                setUpdate(false);
                setChange(!change);

                setAddr((prevAddr) => {
                    const updatedAddr = prevAddr.map((addr) => {
                        if (addr.addressId === addId) {
                            return {
                                ...addr,
                                street: street,
                                country: country,
                                unitNumber: unitNumber,
                                pc: pc
                            };
                        }
                        return addr;
                    });
                    return updatedAddr;
                });



            }
        } catch (err) {
            console.error(err);
            setErr("Something went wrong");
        }
    };

    const retrieveAdd = async () => {
        try {
            if (addId) {
                const res = await axiosPrivate.get(`/userinfo/useradd/${addId}`);
                console.log("res: ", res);
                if (res) {
                    setStreet(res.data.street);
                    setCountry(res.data.country);
                    setUnitNumber(res.data.unitNumber);
                    setPc(res.data.postalCode);
                } else {
                    setErr("Please reload and try again");
                }
            } else {
                setErr("address ID is undefined");
            }
        } catch (err) {
            console.error(err);
            setErr(err.message);
        }
    };


    // ADDRESS INPUT
    const handleStreet = (e) => {
        setStreet(e.target.value);
    };
    const handleCountry = (e) => {
        setCountry(e.target.value);
    };
    const handleUnitNumber = (e) => {
        setUnitNumber(e.target.value);
    };
    const handlePc = (e) => {
        setPc(e.target.value);
    };

   

    useEffect(() => {
        if (addId !== null && updateModal) {
            retrieveAdd();
        }
    }, [addId, updateModal]);


    return (
        <div className="fixed inset-0 flex items-center justify-center z-50"
            style={
                {
                    display: updateModal ? 'flex' : 'none'
                }
            }>
            <div className="bg-white rounded-xl p-5">
                <h1 className="text-3xl m-3 text-black">Update Address:</h1>

                <div className="bg-red-100 text-black">
                    {err}</div>

                <form className="flex flex-col" onSubmit={
                    async (e) => {
                        e.preventDefault();
                        handleSubmit();
                        setUpdate(false);
                    }
                } >
                    <label className="m-3 text-black">Street:</label>
                    <input type="text" id="street" name="street" className="bg-lightOrange rounded-lg p-2 text-black"
                        value={street}
                        onChange={handleStreet}
                        required />

                    <label className="m-3 text-black">Country: (No numbers)</label>
                    <input type="text" id="country" name="country" className="bg-lightOrange rounded-lg p-2 text-black"
                        value={country}
                        pattern="^[^0-9]*$"
                        onChange={handleCountry}
                        required />

                    <label className="m-3 text-black">Unit-Number: (#XX-XXX)</label>
                    <input type="text" id="unitNumber" name="unitNumber" className="bg-lightOrange rounded-lg p-2 text-black"
                        value={unitNumber}
                        onChange={handleUnitNumber}
                        pattern="^#[a-zA-Z\d]+-[a-zA-Z\d]+$"
                        required />

                    <label className="m-3 text-black">Postal Code: (6 digits)</label>
                    <input type="number" id="pc" name="pc" className="bg-lightOrange rounded-lg p-2 text-black"
                        value={pc}
                        onChange={handlePc}
                        pattern='^\d{6}$'
                        required />

                    <div className="m-3 mt-6 p-2 flex justify-around">
                        <button type='submit'
                            className="bg-mainOrange text-white rounded-lg p-2">
                            Confirm
                        </button>
                        <button className='text-black'
                            onClick={
                                (e) => {
                                    e.preventDefault();
                                    setUpdate(false);
                                }
                            }>
                            Cancel
                        </button>

                    </div>
                </form>
            </div>
        </div>
    );
}

export default UpdateAddrModal
