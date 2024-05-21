import React, { useEffect, useState } from "react";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";
import Loading from "../Utilities/Loading";
import useAuth from "../../hooks/useAuth";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";
import OpenInquiryModal from "./OpenInquiryModal";
const ManagerInquiryModal = () => {
	const axiosPrivate = useAxiosPrivate();
	const [selectedInquiry, setSelectedInquiry] = useState();
	const [inquiryList, setInquiryList] = useState([]);
	const [openInquiry, setOpenInquiry] = useState(false);
	const [searchInput, setSearchInput] = useState();

	async function getInquiryList() {
		const result = await axiosPrivate.get("/inquiry/all");
		setInquiryList(result.data);
	}
	function openInquiryFunction() {
		setOpenInquiry(true);
	}
	function closeInquiryFunction() {
		setOpenInquiry(false);
		if (searchInput != undefined && searchInput != "") {
			searchInquiries();
		} else getInquiryList();
	}
	async function searchInquiries() {
		const result = await axiosPrivate.get(`/inquiry/search/${searchInput}`);

		setInquiryList(result.data);
	}

	function handleSearchInput(event) {
		setSearchInput(event.target.value);
	}

	useEffect(() => {
		getInquiryList();
	}, []);
	useEffect(() => {});
	return (
		<div className="grow h-full">
			{openInquiry ? (
				<OpenInquiryModal
					closeInquiryModal={closeInquiryFunction}
					inquiryId={selectedInquiry}
				/>
			) : null}
			<div className="flex justify-center">
				<input
					onKeyDown={(event) => {
						if (event.key == "Enter") {
							searchInquiries();
						}
					}}
					onChange={handleSearchInput}
					value={searchInput}
					type="text"
					className="rounded-l border bg-gray-200 pl-2 w-1/3"
					placeholder="Search"
				/>
				<div
					onClick={searchInquiries}
					className="bg-gray-200 rounded-r hover:cursor-pointer hover:bg-gray-300 px-2 border-l border-gray-300">
					<FontAwesomeIcon icon={faMagnifyingGlass} />
				</div>
			</div>
			<div className="flex mx-10 font-semibold border-b-2 py-2">
				<p className="basis-1/3">Subject</p>
				<p className="basis-1/3 flex justify-end">Status</p>
				<p className="basis-1/3 flex justify-end">Quick Reply</p>
			</div>
			<div className="flex flex-col">
				{inquiryList.map((data) => (
					<div
						className="flex mx-10 border-b-2 py-2 hover:bg-orange-400"
						onClick={() => {
							setSelectedInquiry(data.inquiryId);
							openInquiryFunction();
						}}>
						<p className="basis-1/3">{data.subject}</p>

						{data.status == 1 ? (
							<p className="basis-1/3 flex justify-end text-red-500">
								Unreplied
							</p>
						) : (
							<p className="basis-1/3 flex justify-end text-green-600">
								Replied
							</p>
						)}

						<p className="basis-1/3 flex justify-end">{data.email}</p>
					</div>
				))}
			</div>
		</div>
	);
};

export default ManagerInquiryModal;
