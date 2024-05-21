import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTag, faPencil } from "@fortawesome/free-solid-svg-icons";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";
import Loading from "../Utilities/Loading";

const ViewVoucherModal = ({ voucher, closeVoucher, deleteVoucher }) => {
	const axiosPrivate = useAxiosPrivate();
	const [voucherID, setVoucherID] = useState(voucher.voucherID);
	const [voucherName, setVoucherName] = useState(voucher.voucherName);
	const [loading, setLoading] = useState(false);
	const [errorMsg, setErrorMsg] = useState(null);
	const [disableEdit, setDisableEdit] = useState(true);

	//functions to allow input changes
	const handleInputChangeName = (event) => {
		setVoucherName(event.target.value);
	};

	const editVoucher = () => {
		setLoading(true);
		if (voucherName != voucher.voucherName) {
			axiosPrivate
				.put("/voucher/edit", {
					id: voucher.voucherID,
					name: voucherName,
				})
				.then(() => {
					closeVoucher();
				})
				.catch(() => {
					setErrorMsg("An Error Occurred, Please try again later");
				});
		} else {
			closeVoucher();
		}
	};

	return (
		<div className="fixed inset-0 z-50 flex justify-center items-center bg-black bg-opacity-50">
			<div className="w-1/2 p-6 bg-white rounded-lg shadow-md">
				<div className="flex items-center">
					<FontAwesomeIcon icon={faTag} className="text-slate-300 mr-2" />
					<p className="text-slate-400 text-sm">
						{voucher.voucherType.toUpperCase()} DISCOUNT
					</p>
					<div className="grow flex items-center justify-end">
						<button
							className="flex"
							onClick={() => {
								setDisableEdit(!disableEdit);
							}}>
							<p className="text-sm mr-3 opacity-60">Edit Name</p>
							<FontAwesomeIcon
								icon={faPencil}
								className="fa-xl hover:scale-105 opacity-60"
							/>
						</button>
					</div>
				</div>
				<div className="flex mt-4">
					<div className="basis-1/2 flex items-center">
						<input
							type="text"
							className="text-3xl font-bold disabled:bg-white bg-gray-200 rounded-md disabled:pl-0 pl-3"
							value={voucherName}
							onChange={handleInputChangeName}
							disabled={disableEdit}
						/>
					</div>

					<div className="basis-1/2 flex items-center justify-end">
						<button
							className="text-red-500 hover:scale-105 duration-200"
							onClick={deleteVoucher}>
							Delete Coupon
						</button>
					</div>
				</div>

				<div className="flex items-center mt-1 ">
					<p className="text-xl text-slate-600 w-36 font-bold">
						{voucher.voucherID}
					</p>
				</div>
				<div className="mt-5 flex mb-1">
					<p className="text-slate-500">Expires: </p>
					<p className="ml-3">
						{new Date(voucher.expiryDate).toLocaleDateString() +
							" " +
							new Date(voucher.expiryDate).toLocaleTimeString()}
					</p>
				</div>
				<div className="flex mb-1">
					<p className="text-slate-500">Redemptions: </p>
					<p className="mr-1 ml-2 w-7 text-center">
						{voucher.redeemedQty}/{voucher.limitVoucher}
					</p>
				</div>

				<div className="flex mb-1">
					<p className="text-slate-500 mr-2">Type: </p>
					<p>{voucher.voucherType}</p>
				</div>

				<div className="flex">
					<p className="text-slate-500 mr-2">Condition: </p>
					<p>{voucher.condition == null ? "None" : voucher.condition}</p>
				</div>

				<div className="flex mt-1">
					<p className="text-slate-500 mr-2">Value: </p>
					{voucher.voucherType != "Free Shipping" ? (
						<p>{voucher.voucherValue}</p>
					) : (
						<p>Free Shipping</p>
					)}
				</div>

				<div className="flex mt-1">
					<p className="text-slate-500 mr-2">Min Spend: </p>
					<p>$</p>
					<p>{voucher.minSpend}</p>
				</div>

				{loading ? (
					<div className="flex justify-center">
						<Loading />
					</div>
				) : (
					""
				)}
				{errorMsg != null ? (
					<div className="flex justify-center">
						<p className="text-red-500">{errorMsg}</p>
					</div>
				) : (
					""
				)}

				<div className="flex justify-center mt-10">
					<button
						onClick={closeVoucher}
						className="bg-red-500 text-white font-bold py-2 px-4 rounded-full mr-5">
						Back
					</button>
					<button
						onClick={editVoucher}
						className="bg-orange-500 text-white font-bold py-2 px-4 rounded-full">
						Save
					</button>
				</div>
			</div>
		</div>
	);
};

export default ViewVoucherModal;
