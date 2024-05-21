const ErrorModal = ({ closeModal }) => {
	return (
		<div className="fixed inset-0 z-50 flex justify-center items-center bg-white bg-opacity-40">
			<div className="w-96 p-6 bg-white rounded-lg shadow-md">
				<div>
					<p className="text-xl text-center font-semibold">
						You do not have Sufficient Points
					</p>
				</div>
				<div className="mt-5 flex justify-center">
					<button
						onClick={closeModal}
						className="hover:scale-105 bg-orange-500 text-white font-bold py-2 px-4 rounded-full">
						Close
					</button>
				</div>
			</div>
		</div>
	);
};
export default ErrorModal;
