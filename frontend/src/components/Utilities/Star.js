import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStar } from "@fortawesome/free-solid-svg-icons";

const Star = ({ count }) => {
    let arr = [];
    for (let i = 1; i <= parseInt(count); i++) arr.push(i);
    return (
        <div>
            {arr.map((i) => (
                <FontAwesomeIcon key={i} icon={faStar} color="orange" />
            ))}
        </div>
    );
};

export default Star;
