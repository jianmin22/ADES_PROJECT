import React, { useEffect, useState } from "react";
import useAuth from "../hooks/useAuth.js";
import useAxiosPrivate from "../hooks/useAxiosPrivate.js";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faComments } from "@fortawesome/free-regular-svg-icons";

function ContactUs() {
	const axiosPrivate = useAxiosPrivate();

	const [error, setError] = useState(null);
	const [success, setSuccess] = useState(null);
	const [email, setEmail] = useState("");
	const [subject, setSubject] = useState("");
	const [inquiry, setInquiry] = useState("");

	const handleChangeEmail = (event) => {
		setEmail(event.target.value);
	};
	const handleChangeSubject = (event) => {
		setSubject(event.target.value);
	};
	const handleChangeInquiry = (event) => {
		setInquiry(event.target.value);
	};
	//To get their email if they are signed in
	const { auth } = useAuth();
	useEffect(() => {
		const fetchUserDetails = async () => {
			const userData = await axiosPrivate.get("userinfo/personal");
			if (userData.data.email != undefined) {
				setEmail(userData.data.email);
			}
		};

		if (auth.userId != null) {
			fetchUserDetails();
		}
	}, []);

	const submitInquiry = async () => {
		setError(null);
		setSuccess(null);
		//Validation
		if (email == "" || subject == "" || inquiry == "") {
			setError("All fields are required!");
		} else {
			try {
				await axiosPrivate.post(`/inquiry/create`, {
					email: email,
					subject: subject,
					inquiry: inquiry,
				});
				setSuccess("Inquiry Sent!");
			} catch (error) {
				setError("An error occurred");
				setSuccess(null);
			}
		}
	};

	return (
		<div className="flex flex-col items-center justify-center grow">
			<div className="bg-lightOrange rounded-md">
				<div className="">
					<h1 className="ml-16 text-xl font-semibold my-10">
						Make an Inquiry!
					</h1>
					<div className="mx-32 w-96">
						<div className="mb-4 flex">
							<div className="w-1/4">
								<label>Email:</label>
							</div>
							<div className="w-3/4 flex justify-end">
								<input
									onChange={handleChangeEmail}
									value={email}
									type="text"
									className="rounded-lg pl-3 w-full"
								/>
							</div>
						</div>
						<div className="mb-4 flex">
							<div className="w-1/4">
								<label>Subject:</label>
							</div>
							<div className="w-3/4 flex justify-end">
								<input
									value={subject}
									onChange={handleChangeSubject}
									type="text"
									className="rounded-lg w-full pl-3 "
								/>
							</div>
						</div>
						<div className="flex flex-col mb-7">
							<label>Inquiry:</label>
							<textarea
								value={inquiry}
								onChange={handleChangeInquiry}
								type="text"
								className="rounded-lg px-3"
							/>
						</div>
						<div className="flex flex-col items-center mb-5">
							<div className="text-red-500">{error}</div>
							<div className="text-green-500">{success}</div>
							<button
								onClick={submitInquiry}
								className="text-white text-lg bg-mainOrange px-8 rounded-md"
								type="button">
								Submit
							</button>
						</div>
					</div>
				</div>
				<div className="flex justify-center">
					<p>OR</p>
				</div>
				<div className="my-7 flex flex-col items-center">
					<a
						href="/chat"
						className="text-white text-lg flex items-center justify-center bg-mainOrange px-8 py-1 rounded-md">
						<FontAwesomeIcon
							size="lg"
							className="text-white mr-3"
							icon={faComments}
						/>
						<p className="text-lg">Chat With Us!</p>
					</a>
				</div>
			</div>
		</div>
	);
}

export default ContactUs;
