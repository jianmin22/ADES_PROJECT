import React, { useEffect, useState } from "react";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";
import Loading from "../Utilities/Loading";
import useAuth from "../../hooks/useAuth";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleXmark } from "@fortawesome/free-regular-svg-icons";

const OpenInquiryModal = ({ closeInquiryModal, inquiryId }) => {
	const { auth } = useAuth();
	const axiosPrivate = useAxiosPrivate();
	const [data, setData] = useState(null);

	async function getInquiryData() {
		let results = await axiosPrivate.get(`/inquiry/${inquiryId}`);
		console.log(results.data);
		setData(results.data);
	}

	async function markAsReplied() {
		let results = await axiosPrivate.put(`/inquiry/replied/${inquiryId}`);
		getInquiryData();
	}
	useEffect(() => {
		console.log(data);
		getInquiryData();
	}, []);
	return (
		<div className="fixed inset-0 z-50 flex justify-center items-center bg-black bg-opacity-50">
			<div className="w-1/3 2xl:w-96 p-6 bg-white rounded-lg shadow-md">
				{data != null ? (
					<div>
						<div className="flex">
							<div className="grow">
								{data.status == 1 ? (
									<p className="font-semibold text-red-500">Unreplied</p>
								) : (
									<p className="font-semibold text-green-600">Replied</p>
								)}
							</div>
							<div className="flex justify-end">
								<button onClick={closeInquiryModal}>
									<FontAwesomeIcon
										size="xl"
										className="text-mainOrange"
										icon={faCircleXmark}
									/>
								</button>
							</div>
						</div>
						<h2 className="my-4 text-xl font-bold text-center">
							{data.subject}
						</h2>
						<p className="text-center">{data.inquiry}</p>
						<p className="text-center mt-3">
							Reply:{" "}
							<a
								onClick={markAsReplied}
								className="text-mainOrange hover:text-darkOrange"
								href={
									"mailto:" +
									data.email +
									"?subject=Inquiry Response: " +
									data.subject
								}>
								{data.email}
							</a>
						</p>
					</div>
				) : (
					<div className="flex flex-col">
						<div className="flex justify-end">
							<button onClick={closeInquiryModal}>
								<FontAwesomeIcon
									size="xl"
									className="text-mainOrange"
									icon={faCircleXmark}
								/>
							</button>
						</div>
						<div className="flex justify-center">
							<Loading />
						</div>
					</div>
				)}
			</div>
		</div>
	);
};

export default OpenInquiryModal;
