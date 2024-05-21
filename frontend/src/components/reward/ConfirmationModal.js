import React, { useState } from "react";
import Loading from "../Utilities/Loading";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";

const ConfirmationModal = ({
	value,
	closeMessage,
	userId,
	closeWithReload,
}) => {
	const axiosPrivate = useAxiosPrivate();
	const [isLoading, setIsLoading] = useState(false);

	const redeemVoucher = async () => {
		setIsLoading(true);
		await axiosPrivate.post("/points/createvoucher", {
			userId: userId,
			voucherValue: value,
		});
		closeWithReload();
	};
	return (
		<>
			{
				<div className="fixed inset-0 z-50 flex justify-center items-center bg-white bg-opacity-40">
					<div className="w-96 p-6 bg-white rounded-lg shadow-md">
						<div className="flex justify-center items-center mb-4">
							<h2 className="text-xl font-bold">
								Do you want to redeem ${value} Voucher?
							</h2>
						</div>
						{isLoading ? (
							<div className="flex justify-center my-2">
								<Loading />
							</div>
						) : (
							""
						)}
						<div className="flex justify-center gap-2">
							<button
								onClick={closeMessage}
								className="hover:scale-105 bg-red-500 text-white font-bold py-2 px-4 rounded-full">
								No
							</button>
							<button
								onClick={redeemVoucher}
								className="hover:scale-105 bg-orange-500 text-white font-bold py-2 px-4 rounded-full">
								Yes
							</button>
						</div>
					</div>
				</div>
			}
		</>
	);
};

export default ConfirmationModal;
