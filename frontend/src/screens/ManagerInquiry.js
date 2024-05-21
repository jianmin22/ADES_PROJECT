import React, { useState, useEffect } from "react";
import ManagerInquiryModal from "../components/Chat/ManagerInquiryModal";
import ManagerChatsModal from "../components/Chat/ManagerChatsModal";
const ManagerInquiry = () => {
	const [selected, setSelected] = useState("Inquiry");
	return (
		<div className="flex flex-col grow h-screen">
			<div className="bg-white h-[70px] flex items-end">
				{selected == "Inquiry" ? (
					<div className="flex ml-10 shadow-xl">
						<button className="bg-mainOrange text-white py-1 px-4 border border-gray-200 rounded-l-lg">
							Inquiry
						</button>
						<button
							className="hover:bg-mainOrange hover:text-white transition duration-300 bg-orange-200 text-gray-500 py-1 px-4 border border-gray-200 rounded-r-lg"
							onClick={() => {
								setSelected("LiveChats");
							}}>
							Live Chats
						</button>
					</div>
				) : (
					<div className="flex ml-10 shadow-xl">
						<button
							className="hover:bg-mainOrange hover:text-white transition duration-300 bg-orange-200 text-gray-500 bg-mainOrange text-white py-1 px-4 border border-gray-200 rounded-l-lg"
							onClick={() => {
								setSelected("Inquiry");
							}}>
							Inquiry
						</button>
						<button className="bg-mainOrange text-white py-1 px-4 border border-gray-200 rounded-r-lg">
							Live Chats
						</button>
					</div>
				)}
			</div>
			<div className="grow">
				{selected == "Inquiry" ? (
					<ManagerInquiryModal />
				) : (
					<ManagerChatsModal />
				)}
			</div>
		</div>
	);
};

export default ManagerInquiry;
