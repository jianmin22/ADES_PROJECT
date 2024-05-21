import { useEffect, useState, useTransition } from "react";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";
import Loading from "../Utilities/Loading";

const PointsTransactionHistory = ({ userId, closeModal }) => {
	const axiosPrivate = useAxiosPrivate();
	const [loading, setLoading] = useState(true);
	const [transaction, setTransaction] = useState();
	const [userPoints, setUserPoints] = useState();
	useEffect(() => {
		async function load() {
			try {
				const userTransaction = axiosPrivate.get(
					`/points/usertransactions/${userId}`
				);
				const pointInformation = axiosPrivate.get(`/points/user/${userId}`);
				const [resultTran, resultPoints] = await Promise.all([
					userTransaction,
					pointInformation,
				]);
				setTransaction(resultTran.data);
				setUserPoints(resultPoints.data[0]);
				setLoading(false);
			} catch (error) {}
		}
		load();
	}, []);
	return (
		<div className="fixed inset-0 z-50 flex justify-center items-center bg-white bg-opacity-40">
			<div className="w-2/3 lg:w-2/5 p-6 bg-white rounded-lg shadow-md">
				<div className="flex flex-col items-center">
					<p className="text-xl font-semibold">Your Transaction History</p>
				</div>
				{loading ? (
					<div className="flex justify-center mt-5">
						<Loading />
					</div>
				) : (
					<div className="max-h-72 overflow-auto">
						<div className="flex flex-col my-5">
							{transaction.length != 0 ? (
								<div className="flex justify-between mt-2 mb-8">
									<p className="text-center">
										Points Left:{" "}
										{userPoints.totalPoints - userPoints.pointsUsed}
									</p>
									<p className="text-center">
										Points Used: {userPoints.pointsUsed}
									</p>
									<p className="text-center">
										Points Total: {userPoints.totalPoints}
									</p>
								</div>
							) : (
								""
							)}
							<div className="flex">
								<div className="w-1/5">
									<p className="font-semibold">
										{transaction.length == 0 ? "" : "Points"}
									</p>
								</div>
								<div className="w-1/5">
									<p className="font-semibold">
										{transaction.length == 0 ? "" : "Action"}
									</p>
								</div>
								<div className="w-3/5">
									<p className="font-semibold">
										{transaction.length == 0 ? "" : "Remarks"}
									</p>
								</div>
							</div>
							{transaction.length == 0 ? (
								<div className="mt-10">
									<p className="text-center">
										There are not transaction records
									</p>
								</div>
							) : (
								""
							)}
						</div>
						{transaction.map((transaction) => (
							<div className="flex flex-col mt-1">
								<div className="flex">
									<div className="w-1/5">
										<p className="">{transaction.points}</p>
									</div>
									<div className="w-1/5">
										<p className="">
											{transaction.type == 0 ? "Deducted" : "Added"}
										</p>
									</div>
									<div className="w-3/5">
										<p className="">{transaction.remarks}</p>
									</div>
								</div>
							</div>
						))}
					</div>
				)}
				<div className="flex justify-center mt-8">
					<button
						onClick={closeModal}
						className="hover:scale-105 bg-orange-500 text-white font-bold py-2 px-4 rounded-full">
						Close
					</button>
				</div>
			</div>
		</div>
	);
};

export default PointsTransactionHistory;
