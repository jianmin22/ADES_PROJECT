import React, { useState, useEffect } from "react";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";
import voucherPlaceHolder from "../../voucherPlaceHolder.png";

const VoucherModal = ({
  voucherID,
  subTotal,
  voucherName,
  userId,
  onSelect,
  onClose,
}) => {
  const axiosPrivate = useAxiosPrivate();
  const [vouchers, setVouchers] = useState([]);
  const [selectedVoucherName, setSelectedVoucherName] = useState(voucherName);
  const [selectedVoucherID, setSelectedVoucherID] = useState(voucherID);

  useEffect(() => {
    const fetchVouchers = async () => {
      try {
        const response = await axiosPrivate.get(`/voucher/customer/${userId}`);
        setVouchers(response.data);
      } catch (error) {
        console.error(error);
      }
    };
    if (userId) {
      fetchVouchers();
    }
  }, []);

  const handleSelect = (voucher) => {
    if (voucher.minSpend <= subTotal) {
      if (selectedVoucherName && selectedVoucherID === voucher.voucherID) {
        setSelectedVoucherName(null);
        setSelectedVoucherID(null);
      } else {
        setSelectedVoucherName(voucher.voucherName);
        setSelectedVoucherID(voucher.voucherID);
      }
    }
  };

  const handleOkClick = () => {
    if (selectedVoucherName && selectedVoucherID) {
      onSelect(selectedVoucherID, selectedVoucherName);
    } else {
      onSelect(null, null);
    }
    onClose();
  };

  return (
    <div className="fixed z-10 inset-0 overflow-y-auto">
      <div className="flex items-end justify-center min-h-screen max-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <div className="fixed inset-0 transition-opacity">
          <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
        </div>
        <span className="hidden sm:inline-block sm:align-middle sm:h-screen"></span>
        <div className="inline-block align-middle bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:max-w-lg sm:w-full">
          <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
            <h3 className="text-lg leading-6 font-medium text-gray-900">
              Select a Voucher
            </h3>
            <div className="mt-4 h-40 overflow-y-scroll">
              {vouchers.map((voucher) => (
                <div
                key={voucher.voucherID}
                className={`flex items-center py-2 ${
                  voucher.minSpend > parseFloat(subTotal) ? "bg-gray-200 cursor-default" : "cursor-pointer hover:bg-gray-100"
                }`}
                onClick={voucher.minSpend > parseFloat(subTotal) ? null : () => handleSelect(voucher)}
              >              
                  <img
                    className="h-8 w-8 mr-2"
                    src={voucherPlaceHolder}
                    alt="Voucher Placeholder"
                  />
                  <div className="flex-grow mr-4">{voucher.voucherName}</div>
                  <div>
                    {voucher.voucherType === "Percentage"
                      ? `${voucher.voucherValue}%`
                      : voucher.voucherType === "Free Shipping"
                      ? "-$4"
                      : `-${voucher.voucherValue}`}
                  </div>
                  {(voucher.minSpend) > (parseFloat(subTotal)) && (
                    <div className="text-red-500 text-sm ml-2">{`Min. spend $${voucher.minSpend} not met`}</div>
                  )}
                  <div>
                    <input
                      type="radio"
                      name="voucher"
                      className="form-radio h-4 w-4 m-3"
                      checked={voucher.voucherID === selectedVoucherID}
                      disabled={voucher.minSpend > (parseFloat(subTotal))}
                      onClick={() => handleSelect(voucher)}
                    />
                  </div>
                </div>
              ))}
            </div>
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

export default VoucherModal;
