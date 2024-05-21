// {
//     "reviewId": "d3e20324-ce9b-47d1-8430-3e2c3fafd649",
//     "createdAt": "2023-05-22T07:57:50.000Z",
//     "rating": "5.0",
//     "description": "good",
//     "username": "super-admin"
// }
import Star from "../Utilities/Star";
const Review = ({ reviewData }) => {
    const posted = new Date(reviewData.createdAt);
    var options = {
        weekday: "short",
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "numeric",
        minute: "numeric",
        hour12: true,
    };

    return (
        <div className="w-full bg-white border border-mainOrange rounded-lg  p-3 flex flex-col justify-between space-y-4 hover:shadow-lg hover:-translate-x-1 transition-all">
            <div className="py-2">{reviewData.description}</div>
            <div>
                <div className="flex space-x-2 italic text-slate-500">
                    <h1>Rating: </h1>
                    <h1>{reviewData.rating}/5</h1>
                    <Star count={reviewData.rating} />
                </div>
                <div className="flex justify-between">
                    <h1>Posted by: {reviewData.username}</h1>
                    <h1 className="text-slate-700 italic">
                        {posted.toLocaleString("en-SG", options)}
                    </h1>
                </div>
            </div>
        </div>
    );
};

export default Review;
