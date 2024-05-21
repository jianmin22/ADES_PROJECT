import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";

const Back = () => {
    const navigate = useNavigate();
    const handleBackButton = () => {
        navigate(-1);
    };
    return (
        <button
            className="flex justify-start items-center space-x-2 text-xl"
            onClick={handleBackButton}
        >
            <FontAwesomeIcon icon={faArrowLeft} />
            <h1 className="font-bold">Back</h1>
        </button>
    );
};

export default Back;
