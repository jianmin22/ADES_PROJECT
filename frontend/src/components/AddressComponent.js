import {useState, useEffect} from 'react'
import useAxiosPrivate from '../hooks/useAxiosPrivate'
import AddAddrModal from './Modals/AddAddrModal'
import ConfirmCancelModal from './Modals/ConfirmCancelModal'
import UpdateAddrModal from './Modals/UpdateAddrModal'
import SuccessModal from './Modals/SuccessModal'


const AddressComponent = ({addr, setAddr, editable}) => {
    const axiosPrivate = useAxiosPrivate()

    const [addrModal, setAddrModal] = useState(false)
    const [street, setStreet] = useState('')
    const [country, setCountry] = useState('')
    const [unitNumber, setUnitNumber] = useState('#')
    const [pc, setPc] = useState('')
    const [err, setErr] = useState('')
    const [confirmationIsOpen, setConfirmationIsOpen] = useState(false);
    const [cfmDelete, setDelete] = useState(false)
    const [updateModal, setUpdate] = useState(false)
    const [addId, setAddId] = useState(null)
    const [success, setSuccess] = useState(false)
    const [change, setChange] = useState(false)

    const handleDelete = async (id) => {
        setDelete(true)
        setConfirmationIsOpen(false);
        console.log(id);
        try {
            const deletePromises = [
                axiosPrivate.delete('/userinfo/deleteaddr', {
                    data: {
                        id: id
                    }
                }),
                axiosPrivate.delete('/userinfo/deleteuseraddr', {
                    data: {
                        id: id
                    }
                })
            ];

            const results = await Promise.all(deletePromises);

        
            results.forEach((response) => {
                console.log('Status:', response.status);
            });

            // Update the addr state by filtering out the deleted address
            setAddr((prevAddr) => prevAddr.filter((address) => address.addressId !== id));
            setDelete(false)
        } catch (err) {
            console.error(err);
            if (err ?. response) {
                setErr('Server response');
            } else if (err ?. response ?. status === 204) {
                setErr('Nothing was updated');
            } else {
                setErr('Update Failed');
            }
        }
    };


    useEffect(() => {
        setSuccess(true)

        setStreet("");
        setCountry("");
        setUnitNumber("");
        setPc("");
        setErr("");
        
        const fetchData = async () => {
            try {
                const requests = await axiosPrivate.get("/userinfo/address");
                if (requests.data) {
                    setAddr(requests.data.addresses);
                }
            } catch (error) {
                console.error(error);
                setErr("An Error has occurred");
            }
        };

        console.log("Address Component")
    
        fetchData();
    }, [change]);
    
    useEffect(()=>{
        setSuccess(false)
    }, [])



    return (<div className="p-5 mt-5 m-6 bg-white rounded-xl ">
        <h1 className="text-4xl pb-2 text-orange-600">Saved Addresses</h1>

        <SuccessModal successIsOpen={success}
                onSuccessClose={
                    () => {
                        setSuccess(!success)
                    }
                }
                successMessage={"Updated list of address!"}/>

        <ConfirmCancelModal confirmationIsOpen={confirmationIsOpen}
            onConfirm={()=>{
            setDelete(true)
            setConfirmationIsOpen(false)
            handleDelete(addId)}}
            onCancel={
                () => setConfirmationIsOpen(false)
            }
            confirmationMessage={"Are you sure you want to delete?"}/>

        <AddAddrModal setStreet={setStreet}
            setCountry={setCountry}
            setUnitNumber={setUnitNumber}
            setPc={setPc}
            street={street}
            country={country}
            unitNumber={unitNumber}
            pc={pc}
            err={err}
            setAddrModal={setAddrModal}
            addrModal={addrModal}
            addr={addr}
            setAddr={setAddr}
            setErr={setErr}
            setChange={setChange}
            change = {change}
            style={
                {
                    display: addrModal ? 'flex' : 'none'
                }
            }/> {
        addr.map((address, index) => (<div key={index}
            className="address-item p-5 m-5 bg-mainOrange text-white rounded-xl flex justify-between">
            <div>
                <p>Country: {
                    address.country
                }</p>
                <p>Street: {
                    address.street
                }</p>
                <p>Unit Number: {
                    address.unitNumber
                }</p>
                <p>Postal Code: {
                    address.postalCode
                }</p>
            </div>
            <div>
                <button  style={ editable ? { display:'block'} : {display : 'none'} }   className='p-3' onClick={()=>{
                    setUpdate(true)
                    setAddId(address.addressId)
                }}>Edit</button>

                <UpdateAddrModal 
                setStreet={setStreet}
                setCountry={setCountry}
                setUnitNumber={setUnitNumber}
                setPc={setPc}
                street={street}
                country={country}
                unitNumber={unitNumber}
                pc={pc}
                err={err}
                setUpdate = {setUpdate}
                updateModal = {updateModal}
                setErr={setErr}
                setAddr={setAddr}
                addId = {addId}
                change = {change}
                setChange={setChange}
                /> 

                <button onClick={
                    async() => {
                        setConfirmationIsOpen(true)
                        setAddId(address.addressId)
                    }
                }
                className='p-3'
                style={ editable ? { display:'block'} : {display : 'none'} } 
                >Delete</button>
            </div>
        </div>))
    }

        {
        editable ? <button className='text-xl p-2 ml-5 bg-white rounded-xl'
            onClick={
                () => setAddrModal(true)
        }>+ Address</button> : <div></div>
    } </div>)
}

export default AddressComponent
