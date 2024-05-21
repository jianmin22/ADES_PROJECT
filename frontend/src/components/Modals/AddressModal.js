import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import AddAddrModal from "./AddAddrModal";
import { faEdit } from "@fortawesome/free-solid-svg-icons";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";
import UpdateAddrModal from "./UpdateAddrModal";

const AddressModal = ({
  addressId,
  addressName,
  userId,
  onSelect,
  onClose,
}) => {
  const [addresses, setAddresses] = useState([]);
  const axiosPrivate=useAxiosPrivate();
  const [selectedAddressID, setSelectedAddressID] = useState(addressId);
  const [selectedAddressName, setSelectedAddressName] = useState(addressName);
  const [addAddress, setAddAddress] = useState(true)
  const [addrModal, setAddrModal] = useState(false)
  const [change, setChange] = useState(false)
  const [updateModal, setUpdateModal] = useState(false)

  const [addrId, setAddrId] = useState('')
  const [street, setStreet] = useState('')
  const [country, setCountry] = useState('')
  const [unitNumber, setUnitNumber] = useState('#')
  const [pc, setPc] = useState('')
  const [err, setErr] = useState('')

  useEffect(() => {
    const fetchAddress = async () => {
      const response = await axiosPrivate.get(`/address/${userId}`);
      setAddresses(response.data);
    };
    fetchAddress();
  }, [change]);

  const handleSelect = (address) => {
    if (selectedAddressID && selectedAddressID === address.addressId) {
      setSelectedAddressName(null);
      setSelectedAddressID(null);
    } else {
      setSelectedAddressName(
        address.country +
          " " +
          address.postalCode +
          ", " +
          address.street +
          ", #" +
          address.unitNumber
      );
      setSelectedAddressID(address.addressId);
    }
  };

  const handleUpdateClick = (address) =>{
    setUpdateModal(true)
    setAddrId(address.addressId)
  }

  const handleOkClick = () => {
    if (selectedAddressID) {
      onSelect(selectedAddressID, selectedAddressName);
    } else {
      onSelect(null, null);
    }
    onClose();
  };

  return (
    <div className="fixed z-10 inset-0 overflow-y-auto">
      <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <div className="fixed inset-0 transition-opacity">
          <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
        </div>
        <span className="hidden sm:inline-block sm:align-middle sm:h-screen"></span>

        <AddAddrModal 
            setStreet={setStreet}
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
            addr={addresses}
            setAddr={setAddresses}
            setErr={setErr}
            setChange={setChange}
            change = {change}/>
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
                    setUpdate = {setUpdateModal}
                    updateModal = {updateModal}
                    setErr={setErr}
                    addId = {addrId}
                    change = {change}
                    setChange={setChange}
          />



        <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
          <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
            <h3 className="text-lg leading-6 font-medium text-gray-900 border-b border-gray-300 pb-3">
              Choose Your Address
            </h3>
            <div className="mt-4 h-40 overflow-y-scroll">
              {addresses.map((address) => (
               
                <div
                  key={address.addressId}
                  className={`flex items-center py-2`}
                >
                  <div>
                    <input
                      type="radio"
                      name="address"
                      className="form-radio h-4 w-4"
                      checked={address.addressId === selectedAddressID}
                      onClick={() => {handleSelect(address)
                         setAddrId(address.addressId)}}
                    />
                  </div>
                  <div className="flex-grow px-3">
                    {address.country +
                      " " +
                      address.postalCode +
                      ", " +
                      address.street +
                      ", #" +
                      address.unitNumber}
                  </div>
                  {/* TO BE CHANGED TO EDIT ADDRESS */}
                  <FontAwesomeIcon
                    icon={faEdit}
                    className="cursor-pointer mr-4"
                    onClick={()=>handleUpdateClick(address)}
                  />

                </div>
              ))}
              
            </div>
            {/* TO BE CHANGED TO ADD ADDRESS */}
            <button
              className="text-blue-500 hover:underline mt-3 block"
              onClick={()=>{setAddrModal(true)}}
            >
              Add Address
            </button>
          </div>
          <div className="bg-gray-50 px-4 py-3 px-6 flex lg:flex-row-reverse">
            <button
              type="button"
              className="w-full inline-flex justify-center rounded-md px-4 py-2 bg-orange-500 text-base font-medium text-white hover:bg-orange-600 lg:ml-3 lg:w-auto lg:text-sm"
              onClick={handleOkClick}
            >
              OK
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddressModal;
