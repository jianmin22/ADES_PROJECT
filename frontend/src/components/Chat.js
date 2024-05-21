import React, { useRef, useEffect, useState } from "react";
import io from "socket.io-client";
import useAuth from "../hooks/useAuth.js";
import useAxiosPrivate from "../hooks/useAxiosPrivate";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPaperPlane } from "@fortawesome/free-regular-svg-icons";
import Loading from "./Utilities/Loading.js";
import NewChatModal from "./Chat/NewChatModal.js";
const socketURL = process.env.REACT_APP_SOCKET_IO_BACKEND_URL;
var socket;

const Chat = () => {
	const { auth } = useAuth();
	const axiosPrivate = useAxiosPrivate();

	const [message, setMessage] = useState("");
	const [topic, setTopic] = useState();
	const [status, setStatus] = useState();
	const [msgArr, setMsgArr] = useState(null);
	const [chats, setChats] = useState(null);
	const [currentChatId, setCurrentChatId] = useState(null);
	const [currentChatTopic, setCurrentChatTopic] = useState(null);
	const [newChatModalOpen, setNewChatModalOpen] = useState(false);
	const chatContainerRef = useRef(null);

	function formatDateTime(date) {
		const year = date.getFullYear();
		const month = String(date.getMonth() + 1).padStart(2, "0");
		const day = String(date.getDate()).padStart(2, "0");
		const hours = String(date.getHours()).padStart(2, "0");
		const minutes = String(date.getMinutes()).padStart(2, "0");
		const seconds = String(date.getSeconds()).padStart(2, "0");

		return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
	}

	const createChat = () => {
		socket.emit("createNewRoom", { userId: auth.userId, topic: topic });
	};
	const closeNewChatModal = (topic, chatId) => {
		setNewChatModalOpen(false);
		getChats();
		if (topic != undefined && chatId != undefined) {
			setCurrentChatId(chatId);
			setCurrentChatTopic(topic);
			joinChat(chatId);
			fetchMessages(chatId);
			setStatus(1);
		}
	};
	const openNewChatModal = () => {
		setNewChatModalOpen(true);
	};
	const joinChat = () => {
		socket.emit("joinRoom", currentChatId);
	};
	const sendMessage = async () => {
		if (message != null && message != "") {
			let dateTime = formatDateTime(new Date());

			const messageData = {
				chatId: currentChatId,
				message: message,
				userId: auth.userId,
				sentAt: dateTime,
			};
			socket.emit("send_message", messageData);
			setMsgArr((previousMsg) => [...previousMsg, messageData]);
			setMessage("");
		}
	};
	const fetchMessages = async (chatId) => {
		setMsgArr(null);
		const results = await axiosPrivate.get(`/chat/messages/${chatId}`);
		setMsgArr(results.data);
	};
	async function getChats() {
		const results = await axiosPrivate.get(`/chat/${auth.userId}`);
		setChats(results.data);
	}
	async function closeChats() {
		const results = await axiosPrivate.put(`/chat/close/${currentChatId}`);
		setStatus(0);
		getChats();
	}
	useEffect(() => {
		socket = io(socketURL);
		console.log("runned");
		socket.on("received_message", (data) => {
			setMsgArr((previousMsg) => [...previousMsg, data]);
		});

		socket.on("close_chat", () => {
			getChats();
		});

		getChats();
	}, []);

	useEffect(() => {
		// Scroll to the bottom whenever messages are updated
		scrollToBottom();
	}, [msgArr]);

	const scrollToBottom = () => {
		const chatContainer = chatContainerRef.current;
		if (chatContainer) {
			chatContainer.scrollTop = chatContainer.scrollHeight;
		}
	};
	return (
		<div className="flex flex-col my-7 mx-20">
			{newChatModalOpen ? (
				<NewChatModal
					closeChatModal={(topic, chatId) => closeNewChatModal(topic, chatId)}
				/>
			) : null}
			{chats != null && chats.length != 0 ? (
				<div>
					<div className="mb-3">
						<button
							onClick={() => {
								openNewChatModal();
							}}
							className="rounded-lg px-3 py-1 font-semibold bg-mainOrange text-white">
							Create New Inquiry
						</button>
					</div>
					<div className="flex justify-center shadow-lg rounded-lg h-[488px]">
						<div className="w-1/4 bg-lightOrange rounded-l-xl flex flex-col overflow-auto">
							<div className="flex mx-3 mt-2 font-semibold px-1 border-b-2 pb-2 border-black">
								<div className="w-1/2 flex justify-start">Inquiry</div>
								<div className="w-1/2 justify-end flex">Status</div>
							</div>
							{chats != null
								? chats.map((data) => (
										<button
											onClick={async () => {
												setStatus(data.status);
												setCurrentChatId(data.chatId);
												setCurrentChatTopic(data.topic);
												joinChat(data.chatId);
												fetchMessages(data.chatId);
											}}
											className="flex mx-3 py-2 px-1 border-b border-gray-400 hover:bg-mainOrange">
											<div className="w-1/2 flex justify-start">
												{data.topic}
											</div>
											<div className="w-1/2 justify-end flex">
												{data.status == 1 ? "Active" : "Closed"}
											</div>
										</button>
								  ))
								: null}
						</div>
						<div className=" flex flex-col w-3/4">
							{currentChatId != null ? (
								<div className="rounded-r-lg bg-white">
									<div className="flex px-3 items-center h-14 bg-orange-200 rounded-tr-lg">
										<div className="w-1/2">
											<p className="font-semibold text-lg">
												{currentChatTopic}
											</p>
										</div>
										{status == 1 ? (
											<div className="w-1/2 flex justify-end">
												<button
													className="bg-mainOrange text-white font-semibold py-1 px-2 rounded-lg"
													onClick={() => {
														closeChats();
													}}>
													Close Inquiry
												</button>
											</div>
										) : null}
									</div>
									<div className="flex flex-col w-full">
										<div className="flex flex-col border-r-2 border-orange-200">
											<div
												ref={chatContainerRef}
												className="h-96 flex flex-col overflow-auto px-10">
												{msgArr != null ? (
													msgArr.map((data) =>
														data.userId == auth.userId ? (
															<div className="flex justify-end">
																<div className="bg-blue-200 my-2 flex flex-col rounded-md max-w-md">
																	<div className="flex pl-2 pr-7">
																		{data.message}
																	</div>

																	<div className="flex flex-col h-[11px] items-end justify-center pr-2 opacity-50 text-[11px]">
																		{new Date(data.sentAt).toLocaleString(
																			"en-US",
																			{
																				hour: "numeric",
																				minute: "numeric",
																				hour12: true,
																			}
																		)}
																	</div>
																</div>
															</div>
														) : (
															<div className="flex justify-start">
																<div className="bg-orange-400 my-2 flex flex-col rounded-md max-w-md">
																	<div className="flex pl-2 pr-7">
																		{data.message}
																	</div>

																	<div className="flex flex-col h-[11px] items-end justify-center pr-2 opacity-50 text-[11px]">
																		{new Date(data.sentAt).toLocaleString(
																			"en-US",
																			{
																				hour: "numeric",
																				minute: "numeric",
																				hour12: true,
																			}
																		)}
																	</div>
																</div>
															</div>
														)
													)
												) : (
													<div className="flex grow justify-center items-center">
														<Loading />
													</div>
												)}
											</div>
											{status == 1 ? (
												<div className="flex h-12 py-2 px-1 bg-orange-400">
													<input
														className="grow pl-2 bg-orange-200 border border-grey-800 rounded-l-md"
														value={message}
														onChange={(value) => {
															setMessage(value.target.value);
														}}
														onKeyDown={(event) => {
															if (event.key === "Enter") {
																sendMessage();
															}
														}}
													/>
													<button
														className="px-2 border-2 rounded-r-md"
														onClick={() => {
															sendMessage();
														}}>
														<FontAwesomeIcon
															className="opacity-50"
															icon={faPaperPlane}
														/>
													</button>
												</div>
											) : (
												<div className="flex justify-center font-semibold items-center h-12 py-2 px-1 bg-orange-400">
													This Chat is closed
												</div>
											)}
										</div>
									</div>
								</div>
							) : (
								<div className="h-96 flex flex-col items-center justify-center">
									<p className="text-xl font-semibold">Please choose a chat!</p>
									<p className="my-4">or</p>
									<button
										onClick={() => {
											openNewChatModal();
										}}
										className="bg-mainOrange font-semibold py-2 px-4 text-white rounded-lg">
										Create New Inquiry
									</button>
								</div>
							)}
						</div>
					</div>
				</div>
			) : (
				<div className="self-center flex flex-col items-center mt-20 bg-lightOrange p-20 rounded-lg">
					<p className="font-semibold text-lg mb-4">You have no inquiries</p>
					<div className="mb-3">
						<button
							onClick={() => {
								openNewChatModal();
							}}
							className="rounded-lg px-3 py-1 font-semibold bg-mainOrange text-white">
							Create New Inquiry
						</button>
					</div>
				</div>
			)}
		</div>
	);
};

export default Chat;
