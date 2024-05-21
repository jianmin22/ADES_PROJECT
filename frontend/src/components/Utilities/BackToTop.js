import { useState, useEffect } from "react";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronUp } from "@fortawesome/free-solid-svg-icons";

const BackToTopButton = () => {
    const [isVisible, setIsVisible] = useState(false);

    const handleScroll = () => {
        const scrollTop =
            window.pageYOffset || document.documentElement.scrollTop;
        setIsVisible(scrollTop > 0);
    };

    const scrollToTop = () => {
        window.scrollTo({
            top: 0,
            behavior: "smooth",
        });
    };

    useEffect(() => {
        window.addEventListener("scroll", handleScroll);
        return () => {
            window.removeEventListener("scroll", handleScroll);
        };
    }, []);

    return (
        <button
            className={`${
                isVisible ? "show" : "hide"
            } bg-white px-3 py-2 rounded-full border border-mainOrange shadow-xxl`}
            onClick={scrollToTop}
            style={{
                position: "fixed",
                bottom: "20px",
                right: "20px",
            }}
        >
            <FontAwesomeIcon icon={faChevronUp} color="orange" />
        </button>
    );
};

export default BackToTopButton;
