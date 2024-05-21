import React, {useState, useEffect} from 'react';
import useAxiosPrivate from '../../hooks/useAxiosPrivate';

const AddAddrModal = ({
    setStreet,
    setCountry,
    setUnitNumber,
    setPc,
    street, 
    country,
    unitNumber,
    pc,
    setAddrModal,
    err,
    addrModal,
    setErr,
    addr,
    setAddr,
    change,
    setChange
}) => {

    const axiosPrivate = useAxiosPrivate()

    const handleSubmit = async () => {

        console.log("Handle submit in add addr was ran")
        try {
            const res1 = await axiosPrivate.post('/userinfo/addaddr', {
                street: street,
                country: country,
                unitNumber: unitNumber,
                pc: pc
            });

            const addressID = res1.data.id; // Assuming the inserted ID is returned in the response as 'id'

            const res2 = await axiosPrivate.post('/userinfo/addaddruser', {id: addressID});

            console.log("This is the first response data", res1.data);
            console.log("This is the second response data", JSON.stringify(res2.data));

            const affectedRows = JSON.stringify(res2.data.affectedRows);

            console.log("THIS IS RES2.DATA" + affectedRows)

            if (affectedRows >= 1) {
                setSuccess(true);

                const newAddress = {
                    id: addressID,
                    street: street,
                    country: country,
                    unitNumber: unitNumber,
                    pc: pc
                };

                setAddr((prevAddr) => [
                    ...prevAddr,
                    newAddress
                ]);
                setChange(prev => !prev);
                setAddrModal(false);
                setStreet("");
                setCountry("");
                setUnitNumber("");
                setPc("");
                setErr("");
            }
           
        } catch (err) {
            console.error(err);
            setErr("Something went wrong");
        }
    };


    // HANDLING ADDRESS INPUT
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

    const [success, setSuccess] = useState(false)

    return (
        <div className="fixed inset-0 flex items-center justify-center z-50 shadow-lg"
            style={
                {
                    display: addrModal ? 'flex' : 'none'
                }
        }>
            <div className="bg-white rounded-xl p-5">

                <h1 className="text-3xl m-3">Add new Address:</h1>
                <div className="bg-red-100">
                    {err}</div>

                <form className="flex flex-col"
                    onSubmit={
                        async (e) => {
                            console.log("Submit button was pressed in add addr")
                            e.preventDefault();
                            handleSubmit();
                            setSuccess(true)
                            setAddrModal(false);
                        }
                }>
                    
                    <label className="m-3">Street:</label>
                    <input type="text" id="street" name="street" className="bg-lightOrange rounded-lg p-2"
                        value={street}
                        onChange={handleStreet}
                        required/>

                    <label className="m-3">Country:</label>
                    <input type="text" id="country" name="country" className="bg-lightOrange rounded-lg p-2"
                        value={country}
                        onChange={handleCountry}
                        required/>

                    <label className="m-3">Unit-Number: (Start with #)</label>
                    <input type="text" id="unitNumber" name="unitNumber" className="bg-lightOrange rounded-lg p-2"
                        value={unitNumber}
                        onChange={handleUnitNumber}
                        pattern="^#\d+-\d+$"
                        required/>

                    <label className="m-3">Postal Code: (Make sure it is 6 digits)</label>
                    <input type="number" id="pc" name="pc" className="bg-lightOrange rounded-lg p-2"
                        value={pc}
                        onChange={handlePc}
                        pattern='^\d{6}$'
                        required/>

                    <div className="m-3 mt-6 p-2 flex justify-around">
                        <button type='submit' className="bg-mainOrange text-white rounded-lg p-2">
                            Confirm
                        </button>
                        <button onClick={
                            (e) => {
                                e.preventDefault();
                                setAddrModal(false);
                            }
                        }>
                            Cancel
                        </button>

                    </div>
                </form>
            </div>
        </div>
    );
};

export default AddAddrModal;
