import React, { useEffect, useState } from "react";
import { Profile_navbar } from "../components/Navbar";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCopy } from "@fortawesome/free-solid-svg-icons";
import { faInfoCircle } from '@fortawesome/free-solid-svg-icons';

import NotifModal from "../components/NotificationModal";
import Loading from "../components/Utilities/Loading";
import useAuth from "../hooks/useAuth.js";
import ConfirmationModal from "../components/reward/ConfirmationModal";
import ErrorModal from "../components/reward/ErrorModal";
import PointsTransactionHistory from "../components/reward/TransactionHistory";
import useAxiosPrivate from "../hooks/useAxiosPrivate";
import NumberInput from "../components/game/NumberInput";
import AllEntries from "../components/game/AllEntries";
import Info from "../components/game/Info";

const Profile_rewards = () => {
	const { auth } = useAuth();
	const userId = auth.userId;
	const axiosPrivate = useAxiosPrivate();
	const selected = "rewards";
	const [availVouchers, setAvailVouchers] = useState([]);
	const [isLoading, setIsLoading] = useState(true);
	const [successMessage, setSuccessMessage] = useState("");
	const [showSuccess, setShowSuccess] = useState(false);
	const [noVoucher, setNoVoucher] = useState(null);
	const [userPoints, setUserPoints] = useState(null);
	const [visible, setVisible] = useState(false);
	const [redeemPointsConfirmation, setRedeemPointsConfirmation] = useState(false);
	const [valueToRedeem, setValueToRedeem] = useState();
	const [error, setError] = useState(false);
	const [openPointsInformation, setOpenPointsInformation] = useState(false);
	const [info, setInfo] = useState(false)

	// For 4d game

	//winning number
	const [win, setWin] = useState(0)
	const [entry, setEntry] = useState("")
	const [viewEntries, setViewEntries] = useState(false)

	const handleErrorModalOk = () => {
		setShowSuccess(false);
	};

	const getWinningNumbers = async () => {
		const url = "game/generate";
		const url1 = "game/winners";
		const url2 = "game/winningNum";
		

		console.log(1)

		try {
			const promise1 = axiosPrivate.post(url);
			const promise2 = axiosPrivate.put(url1);
	
			console.log("Before Promise.all");
	
			const [response1, response2] = await Promise.all([promise1, promise2]);
	
			console.log("After Promise.all");
	
			// Handle responses from promise1 and promise2 if needed
			const generatedNumbers = response1.data;
			const winners = response2.data;
	
			console.log("Generated Numbers:", generatedNumbers);
			console.log("Winners:", winners);
	
			const response3 = await axiosPrivate.get(url2);
			const winningNumbers = response3.data;
	
			console.log("Winning Numbers:", winningNumbers);
	
			setWin(response3.data);

		} catch (error) {
			console.error("Error:", error);
		}
	};

	useEffect(() => {
		getWinningNumbers()
		const getAvailableVouchers = async () => {
			await axiosPrivate
				.get(`/voucher/customer/${userId}`)
				.then((response) => {
					setIsLoading(false);
					setAvailVouchers(response.data);
				})
				.catch((error) => {
					if (error.response.data.message) {
						setIsLoading(false);
						setNoVoucher("You have no available vouchers!");
					}
				});
		};
		getAvailableVouchers();
	}, []);

	useEffect(() => {
		const getUserPoints = async () => {
			await axiosPrivate.get(`/points/user/${userId}`).then((response) => {
				setUserPoints(response.data[0]);
			});
		};
		getUserPoints();
	}, []);

	useEffect(() => {
		if (showSuccess == true) {
			setTimeout(() => {
				setShowSuccess(false);
			}, 3000);
		}
	}, [showSuccess]);

	const redeemPoints = async (event) => {
		let points;
		switch (event.target.id) {
			case "10":
				setValueToRedeem(10);
				points = 200;
				break;
			case "20":
				setValueToRedeem(20);
				points = 400;
				break;
			case "50":
				setValueToRedeem(50);
				points = 1000;
				break;
		}
		if (points > userPoints.pointsLeft) {
			setError(true);
			return;
		}
		setRedeemPointsConfirmation(true);
	};
	const reloadPage = async () => {
		const reload_points = axiosPrivate
			.get(`/points/user/${userId}`)
			.then((response) => {
				setUserPoints(response.data[0]);
			});
		const reload_voucher = axiosPrivate
			.get(`/voucher/customer/${userId}`)
			.then((response) => {
				setIsLoading(false);
				setAvailVouchers(response.data);
			})
			.catch((error) => {
				if (error.response.data.message) {
					setIsLoading(false);
					setNoVoucher("You have no available vouchers!");
				}
			});
		await Promise.all([reload_points, reload_voucher]);
	};
	const closeError = () => {
		setError(false);
	};

	return (
		<div className="my-5 flex flex-row grow">
			<Profile_navbar page={selected} />
			{error ? <ErrorModal closeModal={closeError} /> : ""}
			{openPointsInformation ? (
				<PointsTransactionHistory
					userId={userId}
					closeModal={() => {
						setOpenPointsInformation(false);
					}}
				/>
			) : (
				""
			)}
			<NotifModal
				showInput={showSuccess}
				closeMessage={handleErrorModalOk}
				message={successMessage}
			/>
			{/* <Game /> */}
			{redeemPointsConfirmation ? (
				<ConfirmationModal
					value={valueToRedeem}
					closeMessage={() => {
						setRedeemPointsConfirmation(false);
					}}
					closeWithReload={() => {
						reloadPage();
						setRedeemPointsConfirmation(false);
					}}
					userId={userId}
				/>
			) : (
				""
			)}

			<div className="grow mr-5 bg-orange-300 drop-shadow-2xl rounded-xl">


				<h1 className="text-2xl font-bold mt-4 mx-5">Available Vouchers!</h1>

				{noVoucher != null ? (
					<div className="flex justify-center items-center mt-44">
						<p className="font-semibold text-orange-600 text-2xl">
							{noVoucher}
						</p>
					</div>
				) : (
					""
				)}

				<div className="flex mx-5 justify-start flex-wrap ">
					{isLoading ? (
						<p className="m-auto mt-44 text-lg text-gray-600">
							<Loading />
						</p>
					) : (
						availVouchers.map((voucher) => (
							<div className="px-4 hover:scale-105 hover:drop-shadow-xl duration-500 drop-shadow-lg rounded-t-xl h-56 w-56 bg-orange-400 m-3 min-w-fit flex flex-col">
								<p className="text-center mt-5 font-bold text-xl text-warp">
									{voucher.voucherName}
								</p>
								<p className="text-center text-sm mt-5">Get:</p>
								{voucher.voucherType == "Percentage" ? (
									<p className="text-center mb-5 text-3xl ">
										{parseFloat(voucher.voucherValue)}%
									</p>
								) : voucher.voucherType == "Free Shipping" ? (
									<p className="text-center mb-5 text-2xl ">Free Shipping</p>
								) : (
									<p className="text-center mb-5 text-2xl ">
										${parseInt(voucher.voucherValue)}
									</p>
								)}
								<div
									className="self-center flex justify-center items-center bg-white rounded-md min-w-fit w-36 hover:cursor-pointer hover:scale-105 duration-300"
									onClick={async () => {
										await navigator.clipboard.writeText(voucher.voucherID);
										setSuccessMessage(
											`Successfully copied code ${voucher.voucherID}`
										);
										setShowSuccess(true);
									}}>
									<p className="text-center ml-9">{voucher.voucherID}</p>
									<div className="ml-5 mr-3">
										<FontAwesomeIcon
											icon={faCopy}
											size="sm"
											style={{ color: "#6f7071" }}
										/>
									</div>
								</div>
								<div className="mt-6">
									<p className="text-center text-sm text-gray-600">
										Expiry date:{" "}
										{new Date(voucher.expiryDate).toLocaleDateString()},{" "}
										{new Date(voucher.expiryDate).toLocaleTimeString()}
									</p>
								</div>
							</div>
						))
					)}
				</div>
				<div>
					<h1 className="text-2xl font-bold mt-4 mx-5">Member Points! </h1>
					{userPoints == null ? (
						""
					) : (
						<div>
							<div className="flex">
								<div className="basis-1/2 flex justify-start">
									<p className="text-lg font-semibold mx-5">
										Points Left: {userPoints.pointsLeft}
									</p>
								</div>
								<div className="basis-1/2 flex justify-end">
									<div
										className="bg-orange-500 rounded-lg py-1 mr-5 px-2 hover:cursor-pointer hover:scale-105"
										onClick={() => {
											setOpenPointsInformation(true);
										}}>
										Points Information
									</div>
								</div>
							</div>

							<div className="flex ml-5 justify-center mb-5">
								<div className="px-4 hover:scale-105 hover:drop-shadow-xl duration-500 drop-shadow-lg rounded-xl h-44 w-56 bg-orange-400 m-3 min-w-fit flex flex-col">
									<p className="text-center mt-5 font-bold text-xl text-warp">
										$10 Voucher
									</p>
									<p className="text-center">200 Points</p>
									<div
										className="mx-auto mt-10 bg-white hover:cursor-pointer duration-300 hover:scale-105 rounded-lg px-2 py-1 font-semibold"
										id="10"
										onClick={redeemPoints}>
										Claim Voucher!
									</div>
									<div>
										<p className="text-center text-sm mt-1 text-gray-600">
											Expires in 90 days
										</p>
									</div>
								</div>
								<div className="px-4 hover:scale-105 hover:drop-shadow-xl duration-500 drop-shadow-lg rounded-xl h-44 w-56 bg-orange-400 m-3 min-w-fit flex flex-col">
									<p className="text-center mt-5 font-bold text-xl text-warp">
										$20 Voucher
									</p>
									<p className="text-center">400 Points</p>
									<div
										className="mx-auto mt-10 bg-white hover:cursor-pointer duration-300 hover:scale-105 rounded-lg px-2 py-1 font-semibold"
										id="20"
										onClick={redeemPoints}>
										Claim Voucher!
									</div>
									<div>
										<p className="text-center text-sm mt-1 text-gray-600">
											Expires in 90 days
										</p>
									</div>
								</div>
								<div className="px-4 hover:scale-105 hover:drop-shadow-xl duration-500 drop-shadow-lg rounded-xl h-44 w-56 bg-orange-400 m-3 min-w-fit flex flex-col">
									<p className="text-center mt-5 font-bold text-xl text-warp">
										$50 Voucher
									</p>
									<p className="text-center">1000 Points</p>
									<div
										className="mx-auto mt-10 bg-white hover:cursor-pointer duration-300 hover:scale-105 rounded-lg px-2 py-1 font-semibold"
										id="50"
										onClick={redeemPoints}>
										Claim Voucher!
									</div>
									<div>
										<p className="text-center text-sm mt-1 text-gray-600">
											Expires in 90 days
										</p>
									</div>
								</div>
							</div>
						</div>
					)}
				</div>
				<hr />
				<div className="m-5 flex justify-center">

					<div>
						<img class="ml-5 p-8" src="https://usagif.com/wp-content/uploads/2022/hqgif/4-roblox-very-cool-dance.gif" alt="product image" />
						<h1 className="text-center m-4 text-4xl">LUCKY DRAW <FontAwesomeIcon onClick={()=>setInfo(true)} icon={faInfoCircle} /></h1>
						{entry}
						<div class="w-full max-w-sm bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700">
							<div className="m-5 flex justify-center">
										
								<h5 class="text-xl font-semibold tracking-tight m-4 text-gray-900 dark:text-white">Previous Winning numbers:</h5>

								<span class="text-3xl font-bold text-gray-900 dark:text-white">{win}</span>
							</div>
							<div class="px-5 pb-5">

								<div class="flex items-center justify-between">
		
									<button onClick={() => {
										console.log(visible)
										setVisible(true)
									}} class="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">New Entry</button>
									<button onClick={() => {
										console.log(visible)
										setViewEntries(true)
									}} class="text-white bg-blue-500 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">View Entries</button>
								</div>

							</div>
						</div>
						<NumberInput visible={visible} setVisible={setVisible} entry={entry} setEntry={setEntry} />
						<AllEntries viewEntries={viewEntries} setViewEntries={setViewEntries} entry={entry}/>
					</div>



				</div>
			</div>
			<Info info={info} setInfo={setInfo} />
		</div>
	);
};

export default Profile_rewards;
