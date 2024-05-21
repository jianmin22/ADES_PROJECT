import React, { useState } from "react";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";

const AddVoucherModal = ({ closeAddVoucher }) => {
	const axiosPrivate = useAxiosPrivate();
	//For date and time validation
	const date = new Date();
	const year = date.getFullYear();
	const month = String(date.getMonth() + 1).padStart(2, "0");
	const day = String(date.getDate()).padStart(2, "0");
	const formattedDate = `${year}-${month}-${day}`;

	const [chosedTdyDate, setChosedTdyDate] = useState(false);
	const [voucherID, setVoucherID] = useState();
	const [voucherName, setVoucherName] = useState();
	const [voucherDate, setvoucherDate] = useState();
	const [voucherTime, setvoucherTime] = useState();
	const [voucherValue, setVoucherValue] = useState(0);
	const [voucherMinSpend, setVoucherMinSpend] = useState(0);
	const [voucherType, setVoucherType] = useState("Percentage");
	const [voucherLimit, setVoucherLimit] = useState();
	const [voucherCondition, setVoucherCondition] = useState("");
	const [errorMessage, setErrorMessage] = useState();
	const [showErrorMessage, setShowErrorMessage] = useState(false);
	const [maxValue, setMaxValue] = useState(100);
	//functions to allow input changes
	const handleInputVoucherID = (event) => {
		setVoucherID(event.target.value);
	};
	const handleInputChangeName = (event) => {
		setVoucherName(event.target.value);
	};
	const handleInputChangeDate = (event) => {
		if (event.target.value == formattedDate) {
			setChosedTdyDate(true);
		} else {
			setChosedTdyDate(false);
		}
		setvoucherDate(event.target.value);
	};
	const handleInputTime = (event) => {
		setvoucherTime(event.target.value);
	};
	const handleInputValue = (event) => {
		setVoucherValue(event.target.value);
	};
	const handleInputMinSpend = (event) => {
		setVoucherMinSpend(event.target.value);
	};
	const handleInputType = (event) => {
		if (event.target.value == "Percentage") {
			setMaxValue(100);
		} else if (event.target.value == "Fixed Value") {
			setMaxValue(999);
		}
		setVoucherType(event.target.value);
	};
	const handleInputLimit = (event) => {
		setVoucherLimit(event.target.value);
	};
	const handleInputCondition = (event) => {
		setVoucherCondition(event.target.value);
	};
	const createVoucher = (event) => {
		event.preventDefault();
		setErrorMessage();
		setShowErrorMessage(false);
		if (new Date(`${voucherDate}T${voucherTime}`) < new Date()) {
			setErrorMessage("Voucher cannot expire in the past");
			setShowErrorMessage(true);
			return;
		}
		axiosPrivate
			.post("/voucher/create", {
				id: voucherID,
				name: voucherName,
				limit: parseInt(voucherLimit),
				expiryDate: voucherDate,
				expiryTime: voucherTime,
				voucherType: voucherType,
				voucherValue: parseFloat(voucherValue),
				minSpend: parseFloat(voucherMinSpend),
				condition: voucherCondition,
			})
			.then(() => {
				closeAddVoucher();
			})
			.catch((error) => {
				setErrorMessage(error.message);
				setShowErrorMessage(true);
			});
	};
	return (
		<div className="fixed inset-0 z-50 flex justify-center items-center bg-black bg-opacity-50">
			<div className="w-1/2 p-6 bg-white rounded-lg shadow-md">
				<h1 className="text-center text-2xl mb-5 font-semibold text-orange-500">
					Create Voucher
				</h1>
				<form onSubmit={createVoucher}>
					<div className="flex justify-center">
						<div className="flex flex-col w-fit self-center items-end">
							<div className="flex w-full">
								<div className="basis-1/2 flex justify-start">
									<p className="mr-3">ID:</p>
								</div>
								<input
									required
									maxLength={10}
									type="text"
									className="border-2 pl-2 rounded-md"
									value={voucherID}
									onChange={handleInputVoucherID}
								/>
							</div>
							<div className="flex mt-3 w-full">
								<div className="basis-1/2 flex justify-start">
									<p className="mr-3">Name:</p>
								</div>
								<input
									required
									value={voucherName}
									onChange={handleInputChangeName}
									maxLength={50}
									type="text"
									className="border-2 pl-2 rounded-md"
								/>
							</div>
							<div className="flex mt-3 w-full">
								<div className="basis-1/2 flex justify-start">
									<p className="mr-3">Redemption Limit:</p>
								</div>
								<input
									required
									value={voucherLimit}
									max={1000000}
									onChange={handleInputLimit}
									type="number"
									className="border-2 pl-2 rounded-md"
								/>
							</div>
							<div className="flex mt-3 w-full">
								<div className="basis-1/2 flex justify-start">
									<p className="mr-3">Expiry Date:</p>
								</div>

								<input
									required
									onChange={handleInputChangeDate}
									value={voucherDate}
									min={formattedDate}
									type="date"
									className="border-2 pl-2 rounded-md w-max basis-1/2"
								/>
							</div>
							<div className="flex mt-3 w-full">
								<div className="basis-1/2 flex justify-start">
									<p className="mr-3">Expiry Time:</p>
								</div>
								<div className="basis-1/2 flex justify-end">
									<input
										required
										value={voucherTime}
										onChange={handleInputTime}
										type="time"
										className="border-2 pl-2 rounded-md"
									/>
								</div>
							</div>
							<div className="flex mt-3 w-full">
								<div className="basis-1/2 flex justify-start">
									<p className="mr-3">Type:</p>
								</div>
								<div className="basis-1/2 flex justify-end">
									<select
										value={voucherType}
										onChange={handleInputType}
										className="border-2 pl-2 rounded-md">
										<option value={"Percentage"}>Percentage</option>
										<option value={"Fixed Value"}>Fixed Value</option>
										<option value={"Free Shipping"}>Free Shipping</option>
									</select>
								</div>
							</div>
							<div className="flex mt-3 w-full">
								<div className="basis-1/2 flex justify-start">
									<p className="mr-3">Value:</p>
								</div>
								<div className="basis-1/2 flex justify-end">
									{voucherType == "Free Shipping" ? (
										<input
											required
											value={4}
											onChange={handleInputValue}
											type="number"
											disabled
											className="border-2 pl-2 w-44 rounded-md"
										/>
									) : (
										<input
											required
											value={voucherValue}
											onChange={handleInputValue}
											type="number"
											min={1}
											max={maxValue}
											className="border-2 pl-2 w-44 rounded-md"
										/>
									)}
								</div>
							</div>
							<div className="flex mt-3 w-full">
								<div className="basis-1/2 flex justify-start">
									<p className="mr-3">Minimum Spend:</p>
								</div>
								<div className="basis-1/2 flex justify-end">
									<input
										required
										value={voucherMinSpend}
										onChange={handleInputMinSpend}
										type="number"
										min={0}
										max={1000}
										className="border-2 pl-2 w-44 rounded-md"
									/>
								</div>
							</div>
							<div className="flex mt-3 w-full">
								<div className="basis-1/2 flex justify-start">
									<p className="mr-3">Condition:</p>
								</div>
								<select
									value={voucherCondition}
									onChange={handleInputCondition}
									className="border-2 pl-2 rounded-md">
									<option value={""} className="text-center">
										-
									</option>
									<option value={"First Time Customer"}>
										First Time Customer
									</option>
								</select>
							</div>
						</div>
					</div>
					<div className="text-center text-red-500 mt-5">
						{showErrorMessage ? errorMessage : ""}
					</div>
					<div className="flex justify-center mt-8">
						<button
							type="button"
							className="bg-red-500 text-white font-bold py-2 px-4 rounded-full mr-5"
							onClick={closeAddVoucher}>
							Back
						</button>
						<button
							type="submit"
							className="bg-orange-500 text-white font-bold py-2 px-4 rounded-full">
							Create Voucher
						</button>
					</div>
				</form>
			</div>
		</div>
	);
};

export default AddVoucherModal;
