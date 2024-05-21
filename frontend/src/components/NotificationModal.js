import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark } from "@fortawesome/free-solid-svg-icons";

const NotifModal = ({ showInput, closeMessage, message }) => {
	return (
		<>
			{
				<div
					className={`transition-opacity duration-500 pointer-events-none fixed inset-0 z-50 flex ${
						showInput ? "opacity-100" : "opacity-0"
					} `}>
					<div className="absolute bottom-0 right-0 w-96 pb-2 px-2 bg-white rounded-lg shadow-md mb-5 mr-5 opacity-70 pointer-events-auto">
						<div className="flex justify-end mr-1 mt-1">
							<button onClick={closeMessage} className="text-white font-bold">
								<FontAwesomeIcon
									icon={faXmark}
									size="lg"
									style={{ color: "#474747" }}
								/>
							</button>
						</div>

						<h2 className="mb-1 text-center text-xl font-bold">{message}</h2>
					</div>
				</div>
			}
		</>
	);
};

export default NotifModal;
