import React, { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";
import Loading from "../components/Utilities/Loading";
import useAxiosPrivate from "../hooks/useAxiosPrivate";
import ViewVoucherModal from "../components/managerRewards/ViewVoucherModal";
import DeleteVoucherModal from "../components/managerRewards/DeleteVoucherModal";
import AddVoucherModal from "../components/managerRewards/AddVoucherModal";

const ManagerViewRewards = () => {
	const axiosPrivate = useAxiosPrivate();
	const [loading, setLoading] = useState(true);
	const [vouchers, setVouchers] = useState();
	const [openVoucher, setOpenVoucher] = useState(false);
	const [selectedVoucher, setSelectedVoucher] = useState(null);
	const [deleteVoucher, setDeleteVoucher] = useState(false);
	const [addVoucher, setAddVoucher] = useState(false);
	const [searchInput, setSearchInput] = useState("");
	const handleOnChangeSearch = (event) => {
		setSearchInput(event.target.value);
	};

	useEffect(() => {
		if (searchInput != "") {
			axiosPrivate.get(`/voucher/search/${searchInput}`).then((results) => {
				setVouchers(results.data);
				setLoading(false);
			});
			return;
		}
		axiosPrivate.get("/voucher").then((results) => {
			setVouchers(results.data);
			setLoading(false);
		});
	}, []);

	useEffect(() => {
		if (selectedVoucher != null) {
			setOpenVoucher(true);
		}
	}, [selectedVoucher]);

	const reloadVouchers = () => {
		if (searchInput != "") {
			axiosPrivate.get(`/voucher/search/${searchInput}`).then((results) => {
				setVouchers(results.data);
				setLoading(false);
			});
			return;
		}
		axiosPrivate.get("/voucher").then((results) => {
			setVouchers(results.data);
			setLoading(false);
		});
	};

	const handleKeyDown = (event) => {
		if (event.key === "Enter") {
			reloadVouchers();
		}
	};

	return (
		<div className="flex flex-col grow h-screen">
			{addVoucher ? (
				<AddVoucherModal
					closeAddVoucher={() => {
						setAddVoucher(false);
						reloadVouchers();
					}}
				/>
			) : (
				""
			)}
			{deleteVoucher ? (
				<DeleteVoucherModal
					voucher={selectedVoucher}
					closeDeleteVoucher={() => {
						setDeleteVoucher(false);
						setSelectedVoucher(null);
						reloadVouchers();
					}}
				/>
			) : (
				""
			)}
			{openVoucher ? (
				<ViewVoucherModal
					voucher={selectedVoucher}
					closeVoucher={() => {
						setOpenVoucher(false);
						setSelectedVoucher(null);
						reloadVouchers();
					}}
					deleteVoucher={() => {
						setDeleteVoucher(true);
						setOpenVoucher(false);
					}}
				/>
			) : (
				""
			)}
			<div className="grow m-5 bg-white drop-shadow-2xl rounded-xl flex flex-col items-center py-5">
				<div className="flex items-center w-1/2 justify-center basis-1 ml-44 min-w-fit">
					<input
						type="text"
						className="shadow-md border-2 h-10 grow pl-4 rounded-l-lg"
						placeholder="Search Voucher"
						value={searchInput}
						onChange={handleOnChangeSearch}
						onKeyDown={handleKeyDown}
					/>
					<div
						className="hover:bg-orange-600 hover:text-white transition duration-300 bg-white h-10 flex items-center w-14 hover:cursor-pointer border-l-2 justify-center rounded-r-lg shadow-md border-2"
						onClick={reloadVouchers}>
						<FontAwesomeIcon icon={faMagnifyingGlass} size="lg" />
					</div>
					<div
						className="min-w-fit px-5 rounded-lg flex ml-20 bg-orange-500 h-10 items-center hover:scale-105 duration-300 text-white hover:cursor-pointer"
						onClick={() => setAddVoucher(true)}>
						Create Voucher
					</div>
				</div>
				<div className="grow flex w-full mt-10">
					{loading ? (
						<div className="flex grow justify-center items-center">
							<Loading />
						</div>
					) : (
						<div className="mx-10 grow rounded-xl px-5">
							<div className="flex border-b-2 py-2 px-3">
								<p className="text-black basis-1/5">Voucher ID</p>
								<p className="text-black basis-2/5">Voucher Name</p>
								<p className="text-black basis-1/5 flex justify-end">
									Redemptions
								</p>
								<p className="text-black basis-1/5 flex justify-end">Expires</p>
							</div>
							{vouchers.map((voucher) => (
								<div
									className="hover:cursor-pointer duration-200 hover:bg-orange-300 flex border-b border-slate-300 py-4 px-3"
									onClick={() => setSelectedVoucher(voucher)}>
									<div className="text-slate-500 basis-1/5">
										{voucher.voucherID}
									</div>
									<p className="text-slate-500 basis-2/5">
										{voucher.voucherName}
									</p>
									<p className="text-slate-500 basis-1/5 flex justify-end">
										{voucher.redeemedQty}/{voucher.limitVoucher}
									</p>
									{new Date(voucher.expiryDate) > new Date() ? (
										<p className="text-slate-500 basis-1/5 flex justify-end">
											{new Date(voucher.expiryDate).toLocaleDateString()}{" "}
											{new Date(voucher.expiryDate).toLocaleTimeString()}
										</p>
									) : (
										<p className="text-red-500 basis-1/5 flex justify-end">
											{new Date(voucher.expiryDate).toLocaleDateString()}{" "}
											{new Date(voucher.expiryDate).toLocaleTimeString()}
										</p>
									)}
								</div>
							))}
						</div>
					)}
				</div>
			</div>
		</div>
	);
};

export default ManagerViewRewards;
