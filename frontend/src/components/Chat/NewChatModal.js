import React, { useState } from "react";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";
import Loading from "../Utilities/Loading";
import useAuth from "../../hooks/useAuth";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleXmark } from "@fortawesome/free-regular-svg-icons";

const NewChatModal = ({ closeChatModal }) => {
	const { auth } = useAuth();
	const axiosPrivate = useAxiosPrivate();

	const [topic, setTopic] = useState("");
	const [error, setError] = useState(null);

	const createNewTopic = async () => {
		setError(null);
		if (topic == "") {
			setError("Please enter a topic!");
			return;
		}
		try {
			const results = await axiosPrivate.post(`/chat/${auth.userId}`, {
				topic: topic,
			});

			closeChatModal(results.data.topic, results.data.chatId);
		} catch (error) {
			setError("Internal Server Error, Try again later!");
		}
	};
	return (
		<div className="fixed inset-0 z-50 flex justify-center items-center bg-black bg-opacity-50">
			<div className="w-96 p-6 bg-white rounded-lg shadow-md">
				<div className="flex justify-end">
					<button
						onClick={() => {
							closeChatModal();
						}}>
						<FontAwesomeIcon
							size="xl"
							className="text-mainOrange"
							icon={faCircleXmark}
						/>
					</button>
				</div>
				<h2 className="mb-4 text-xl font-bold text-center">
					Create New Inquiry
				</h2>
				<div className="flex justify-center">
					<p className="mr-10">Topic</p>
					<input
						className="border-2 rounded pl-2"
						value={topic}
						onChange={(event) => {
							setTopic(event.target.value);
						}}
					/>
				</div>
				<div className="flex justify-center mt-5">
					<button
						onClick={createNewTopic}
						onChange={(event) => {
							setTopic(event.target.value);
						}}
						value={topic}
						className="text-white font-semibold bg-mainOrange rounded-lg py-1 px-2">
						Create Inquiry
					</button>
				</div>
				<div className="flex justify-center mt-3 ">
					<p className="text-red-500">{error}</p>
				</div>
			</div>
		</div>
	);
};

export default NewChatModal;
