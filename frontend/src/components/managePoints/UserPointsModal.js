import React, { useEffect, useState } from "react";
import Loading from "../Utilities/Loading";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";

const UserPointsModal = ({ userInput, closeUserModal, alterPointsModal }) => {
	const axiosPrivate = useAxiosPrivate();
	const [user, setUser] = useState();
	const [loading, setLoading] = useState(true);
	const [loadingVoucher, setLoadingVoucher] = useState(true);
	const [loadingTransaction, setLoadingTransaction] = useState(true);
	const [errorMsg, setErrorMsg] = useState(false);
	const [userVoucher, setUserVoucher] = useState();
	const [userTransaction, setUserTransaction] = useState();

	const getUserInformation = async () => {
		const userVoucher = axiosPrivate.get(
			`/points/uservoucher/${userInput.userId}`
		);
		const userTransaction = axiosPrivate.get(
			`/points/usertransactions/${userInput.userId}`
		);
		const userInformation = axiosPrivate.get(
			`/points/user/${userInput.userId}`
		);
		try {
			const [resultVoucher, resultTransaction, resultUserInformation] =
				await Promise.all([userVoucher, userTransaction, userInformation]);
			setUser(resultUserInformation.data[0]);
			setLoading(false);
			setUserVoucher(resultVoucher.data);
			setLoadingVoucher(false);
			setUserTransaction(resultTransaction.data);
			setLoadingTransaction(false);
		} catch (error) {}
	};

	useEffect(() => {
		getUserInformation();
	}, []);

	const deleteVoucher = async (selectedVoucher) => {
		let points;
		switch (parseInt(selectedVoucher.voucherValue)) {
			case 10:
				points = 200;
				break;
			case 20:
				points = 400;
				break;
			case 50:
				points = 1000;
				break;
			default:
				return;
		}
		axiosPrivate
			.delete("/points/voucher", {
				data: {
					userId: user.userId,
					points: points,
					voucherId: selectedVoucher.voucherID,
				},
			})
			.then(() => {
				getUserInformation();
			});
	};

	return (
		<div className="fixed inset-0 z-50 flex justify-center items-center bg-black bg-opacity-50">
			<div className="w-full xl:w-2/3 mx-10 xl:mx-0 p-6 bg-white rounded-lg shadow-md">
				<div className="flex flex-col">
					{loading ? (
						<div className="flex justify-center">
							<Loading />
						</div>
					) : (
						<div className="flex">
							<div className="flex flex-col w-1/2">
								<p className="text-2xl font-semibold">{user.username}</p>
								<p className="mt-3">Points Used: {user.pointsUsed}</p>
								<p className="">
									Points Left: {user.totalPoints - user.pointsUsed}
								</p>
								<p className="">Points Total: {user.totalPoints}</p>
							</div>
							<div className="flex flex-col items-end w-1/2">
								<button
									className="hover:scale-105 bg-orange-500 text-white font-bold py-2 px-4 rounded-full"
									onClick={alterPointsModal}>
									Alter Points
								</button>
							</div>
						</div>
					)}

					<div className="flex my-10">
						<div className="w-1/2 flex flex-col border-r">
							<p className="font-semibold text-xl">Vouchers</p>
							<div className="flex w-96 mt-4 mb-1">
								<div className="basis-1/3 pr-10 flex justify-start">
									<p className="text-md font-semibold">ID</p>
								</div>
								<div className="basis-1/3 px-10">
									<p className="font-semibold">Value</p>
								</div>
							</div>
							<div className="max-h-44 overflow-auto">
								{loadingVoucher ? (
									<div className="flex justify-center scale-75">
										<Loading />
									</div>
								) : (
									userVoucher.map((voucher) => (
										<div className="flex w-96">
											<div className="w-1/3 pr-10 flex justify-start">
												<p className="text-md">{voucher.voucherID}</p>
											</div>
											<div className="w-1/3 px-10">
												<p>{voucher.voucherValue}</p>
											</div>
											<div className="w-1/3 flex justify-end">
												{voucher.redeemedQty == 1 ? (
													<p className="text-orange-500">Redeemed</p>
												) : (
													<p
														className="text-red-500 hover:cursor-pointer"
														onClick={() => {
															deleteVoucher(voucher);
														}}>
														Refund
													</p>
												)}
											</div>
										</div>
									))
								)}
							</div>
						</div>
						<div className="w-1/2 flex flex-col ml-2">
							<p className="font-semibold text-xl">Recent Transactions</p>
							<div className="flex mt-4 mb-1">
								<div className="basis-1/6 mr-2 flex justify-start">
									<p className="text-md font-semibold">Points</p>
								</div>
								<div className="basis-3/12">
									<p className="font-semibold">Action</p>
								</div>
								<div className="basis-7/12">
									<p className="font-semibold">Remarks</p>
								</div>
							</div>
							<div className="max-h-44 overflow-auto">
								{loadingTransaction ? (
									<div className="flex justify-center scale-75">
										<Loading />
									</div>
								) : (
									userTransaction.map((transaction) => (
										<div className="flex ">
											<div className="basis-1/6 mr-2 flex justify-start">
												<p className="text-md">{transaction.points}</p>
											</div>
											<div className="basis-3/12">
												<p>{transaction.type == 1 ? "Added" : "Deducted"}</p>
											</div>
											<div className="basis-7/12 truncate">
												<p className="">{transaction.remarks}</p>
											</div>
										</div>
									))
								)}
							</div>
						</div>
					</div>
				</div>
				<div className="flex justify-center">
					<button
						onClick={closeUserModal}
						className="hover:scale-105 bg-orange-500 text-white font-bold py-2 px-4 rounded-full">
						Close
					</button>
				</div>
			</div>
		</div>
	);
};

export default UserPointsModal;
