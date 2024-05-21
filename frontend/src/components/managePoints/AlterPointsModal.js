import { useEffect, useState } from "react";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";
import Loading from "../Utilities/Loading";

const AlterPointsModal = ({ closeAlterModal, goBack, userInput }) => {
	const axiosPrivate = useAxiosPrivate();
	const [user, setUser] = useState();
	const [action, setAction] = useState("Deduct");
	const [loading, setLoading] = useState(true);
	const [pointsToAlter, setPointsToAlter] = useState();
	const [remarks, setRemarks] = useState();
	const [error, setError] = useState(null);

	const loadUser = async () => {
		setLoading(true);
		await axiosPrivate
			.get(`/points/user/${userInput.userId}`)
			.then((results) => {
				setUser(results.data[0]);
				setLoading(false);
			});
	};
	useEffect(() => {
		loadUser();
	}, []);

	const handleInputAction = (event) => {
		setAction(event.target.value);
	};
	const handleInputPTA = (event) => {
		if (
			event.target.value < 1 &&
			event.target.value != null &&
			event.target.value != ""
		) {
			setError("Points to alter must be 1 or more!");
		} else {
			setError(null);
		}
		setPointsToAlter(event.target.value);
	};
	const handleInputRemarks = (event) => {
		setRemarks(event.target.value);
	};
	const alterPoints = (event) => {
		setError(null);
		event.preventDefault();
		if (pointsToAlter < 1) {
			setError("Points to alter must be 1 or more!");
			return;
		}
		let type;
		switch (action) {
			case "Deduct":
				type = 0;
				break;
			case "Add":
				type = 1;
				break;
		}
		axiosPrivate
			.post("/points/alterpoints", {
				userId: user.userId,
				points: pointsToAlter,
				type: type,
				remarks: remarks,
			})
			.then((results) => {
				loadUser();
				setAction("Add");
				setPointsToAlter("");
				setRemarks("");
			})
			.catch((error) => {
				if (error.response.status == 403) {
					setError("Insufficient Points to deduct from");
					return;
				}
				setError("An Unexpected Error Occured. Please Try Later.");
			});
	};
	return (
		<div className="fixed inset-0 z-50 flex justify-center items-center bg-black bg-opacity-50">
			<div className="w-1/3 p-6 bg-white rounded-lg shadow-md">
				<div className="flex flex-col">
					<div className="flex">
						<button
							onClick={goBack}
							className="hover:scale-105 bg-orange-500 text-white font-bold py-2 px-4 rounded-full">
							Back
						</button>
					</div>
					{loading ? (
						<div className="flex justify-center mt-5">
							<Loading />
						</div>
					) : (
						<div className="flex flex-col mt-5">
							<div className="flex flex-col w-1/2">
								<p className="text-2xl font-semibold">{user.username}</p>
								<p className="mt-3">Points Used: {user.pointsUsed}</p>
								<p className="">
									Points Left: {user.totalPoints - user.pointsUsed}
								</p>
								<p className="">Points Total: {user.totalPoints}</p>
							</div>
						</div>
					)}

					<div className="mt-7 flex flex-col items-center">
						<form onSubmit={alterPoints}>
							<div className="flex gap-3 mt-2">
								<p className="w-20">Action: </p>
								<select
									value={action}
									onChange={handleInputAction}
									className="border-2 pl-2 rounded-md">
									<option value={"Add"}>Add</option>
									<option value={"Deduct"}>Deduct</option>
								</select>
							</div>
							<div className="flex gap-3 mt-2">
								<p className="w-20">Points: </p>
								<input
									value={pointsToAlter}
									onChange={handleInputPTA}
									required
									step={1}
									type="number"
									className="border-2 rounded-lg pl-2"
								/>
							</div>
							<div className="flex gap-3 mt-2">
								<p className="w-20">Remarks: </p>
								<input
									value={remarks}
									onChange={handleInputRemarks}
									required
									maxLength={30}
									type="text"
									className="border-2 rounded-lg pl-2"
								/>
							</div>
							<div className="flex justify-center mt-7 gap-3">
								<button
									onClick={closeAlterModal}
									type="button"
									className="hover:scale-105 bg-red-500 text-white font-bold py-2 px-4 rounded-full">
									Back
								</button>
								<button
									type="submit"
									className="hover:scale-105 bg-orange-500 text-white font-bold py-2 px-4 rounded-full">
									Alter Points
								</button>
							</div>
						</form>
						{error != null ? (
							<div className="mt-5">
								<p className="text-red-500">{error}</p>
							</div>
						) : (
							""
						)}
					</div>
				</div>
			</div>
		</div>
	);
};

export default AlterPointsModal;
