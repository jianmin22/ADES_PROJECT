import React, { useState } from "react";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";
import Loading from "../Utilities/Loading";

const DeleteVoucherModal = ({ voucher, closeDeleteVoucher }) => {
	const axiosPrivate = useAxiosPrivate();
	const [loading, setLoading] = useState(false);
	const [errorMsg, setErrorMsg] = useState(false);
	const deleteVoucher = async () => {
		setErrorMsg(false);
		setLoading(true);
		try {
			await axiosPrivate.delete("/voucher/delete", {
				data: { coupon_id: voucher.voucherID, type: voucher.voucherType },
			});
			closeDeleteVoucher();
		} catch (error) {
			setErrorMsg(true);
			setLoading(false);
		}
	};

	return (
		<div className="fixed inset-0 z-50 flex justify-center items-center bg-black bg-opacity-50">
			<div className="w-96 p-6 bg-white rounded-lg shadow-md">
				<h2 className="mb-4 text-xl font-bold text-center">
					Are you sure you want to delete {voucher.voucherName} (
					{voucher.voucherID})
				</h2>
				<div className="flex justify-center mb-5">
					{loading ? <Loading /> : ""}
					{errorMsg ? (
						<p className="text-red-500">
							An Error Occurred, Please try again later.
						</p>
					) : (
						""
					)}
				</div>
				<div className="flex justify-center">
					<button
						onClick={closeDeleteVoucher}
						className="bg-orange-500 text-white font-bold py-2 px-4 rounded-full mr-4">
						No
					</button>
					<button
						onClick={deleteVoucher}
						className="bg-red-600 text-white font-bold py-2 px-4 rounded-full">
						Delete
					</button>
				</div>
			</div>
		</div>
	);
};

export default DeleteVoucherModal;
