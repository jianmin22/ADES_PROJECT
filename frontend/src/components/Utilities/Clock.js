import React, { useState, useEffect } from "react";

const Clock = () => {
    const [currentTime, setCurrentTime] = useState(new Date());

    const updateCurrentTime = () => {
        setCurrentTime(new Date());
    };

    useEffect(() => {
        const timerId = setInterval(updateCurrentTime, 1000);

        return () => clearInterval(timerId);
    }, []);

    // Format the time as HH:mm:ss
    const weekday = currentTime.toLocaleDateString([], {
        weekday: "long",
    });
    const formattedDate = currentTime.toLocaleDateString([], {
        month: "long",
        day: "numeric",
        year: "numeric",
    });

    const formattedTime = currentTime.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
    });

    return (
        <div className="normal-case text-xl flex flex-col items-center justify-center space-x-4 space-y-4">
            <div className="flex flex-col space-y-4 md:space-y-0 md:flex-row items-center justify-center md:space-x-4 text-center">
                <p>{formattedTime}</p>
                <p>{formattedDate}</p>
                <p className="btn btn-primary btn-outline normal-case">
                    {weekday}
                </p>
            </div>
        </div>
    );
};

export default Clock;
