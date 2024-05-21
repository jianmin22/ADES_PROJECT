import React, { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";
import Loading from "../components/Utilities/Loading";
import ViewVoucherModal from "../components/managerRewards/ViewVoucherModal";
import DeleteVoucherModal from "../components/managerRewards/DeleteVoucherModal";
import AddVoucherModal from "../components/managerRewards/AddVoucherModal";
import UserPointsModal from "../components/managePoints/UserPointsModal";
import AlterPointsModal from "../components/managePoints/AlterPointsModal";
import useAxiosPrivate from "../hooks/useAxiosPrivate";

const ManagerViewPoints = () => {
	const axiosPrivate = useAxiosPrivate();
	const [loading, setLoading] = useState(true);
	const [showUserModal, setShowUserModal] = useState(false);
	const [allUser, setAllUser] = useState();
	const [searchInput, setSearchInput] = useState("");
	const [selectedUser, setSelectedUser] = useState(null);
	const [openAlterModal, setOpenAlterModal] = useState(false);
	const getAllUsers = () => {
		setLoading(true);
		axiosPrivate.get("/points/allusers").then((results) => {
			setAllUser(results.data);
			setLoading(false);
		});
	};
	const searchUsers = () => {
		if (searchInput == "") {
			getAllUsers();
			return;
		}
		setLoading(true);
		axiosPrivate
			.get(`/points/search/username/${searchInput}`)
			.then((results) => {
				console.log(results);
				setAllUser(results.data);
				setLoading(false);
			});
	};

	useEffect(() => {
		getAllUsers();
	}, []);

	useEffect(() => {
		if (selectedUser != null) {
			setShowUserModal(true);
		}
	}, [selectedUser]);

	const handleOnChangeSearch = (event) => {
		setSearchInput(event.target.value);
	};

	const handleKeyDown = (event) => {
		if (event.key === "Enter") {
			searchUsers();
		}
	};

	const closeUserModal = () => {
		setSelectedUser(null);
		setShowUserModal(false);
		getAllUsers();
	};

	const openAlterModalFunction = () => {
		setShowUserModal(false);
		setOpenAlterModal(true);
	};

	const closeAlterModalFunction = () => {
		setSelectedUser(null);
		setOpenAlterModal(false);
		getAllUsers();
	};

	const goBackToPointsModal = () => {
		setOpenAlterModal(false);
		setShowUserModal(true);
	};

	return (
		<div className="flex flex-col grow h-screen">
			{showUserModal ? (
				<UserPointsModal
					userInput={selectedUser}
					closeUserModal={closeUserModal}
					alterPointsModal={openAlterModalFunction}
				/>
			) : (
				""
			)}
			{openAlterModal ? (
				<AlterPointsModal
					userInput={selectedUser}
					closeAlterModal={closeAlterModalFunction}
					goBack={goBackToPointsModal}
				/>
			) : (
				""
			)}

			<div className="grow m-5 bg-white drop-shadow-2xl rounded-xl flex flex-col items-center py-5">
				<div className="flex items-center w-1/2 justify-center basis-1 min-w-fit">
					<input
						type="text"
						className="shadow-md border-2 h-10 grow pl-4 rounded-l-lg"
						placeholder="Search User"
						value={searchInput}
						onChange={handleOnChangeSearch}
						onKeyDown={handleKeyDown}
					/>
					<div
						className="hover:bg-orange-600 hover:text-white transition duration-300 bg-white h-10 flex items-center w-14 hover:cursor-pointer border-l-2 justify-center rounded-r-lg shadow-md border-2"
						onClick={searchUsers}>
						<FontAwesomeIcon icon={faMagnifyingGlass} size="lg" />
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
								<p className="text-black basis-1/6">User Name</p>
								<p className="text-black basis-3/6 flex justify-end">
									Points Left
								</p>
								<p className="text-black basis-1/6 flex justify-end">
									Points Used
								</p>
								<p className="text-black basis-1/6 flex justify-end">
									Total Points
								</p>
							</div>

							{allUser.map((user) => (
								<div
									className="hover:cursor-pointer duration-200 hover:bg-orange-300 flex border-b border-slate-300 py-4 px-3"
									onClick={() => {
										setSelectedUser(user);
									}}>
									<div className="text-slate-500 basis-1/6">
										{user.username}
									</div>
									<p className="text-slate-500 basis-3/6 flex justify-end">
										{user.totalPoints - user.pointsUsed}
									</p>
									<p className="text-slate-500 basis-1/6 flex justify-end">
										{user.pointsUsed}
									</p>
									<p className="text-slate-500 basis-1/6 flex justify-end">
										{user.totalPoints}
									</p>
								</div>
							))}
						</div>
					)}
				</div>
			</div>
		</div>
	);
};

export default ManagerViewPoints;
