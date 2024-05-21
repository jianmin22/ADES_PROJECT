import huang from "../../assets/huang.png";
const LoadingError = ({ message }) => {
    return (
        <div className="flex items-center justify-center h-screen space-x-8">
            <img
                src={huang}
                className="h-32 shadow-2xl rounded-lg border border-slate-900 border-opacity-50"
                alt="huang image"
            />
            <div className="text-3xl flex space-x-4">
                <h1 className=" italic">Meow~ !</h1>
                <h1>{message}</h1>
            </div>
        </div>
    );
};

export default LoadingError;
