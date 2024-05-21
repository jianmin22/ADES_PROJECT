import React from "react";

function TabItem({title, current, onClick}) {
    return <button className={`tab tab-md tab-bordered ${current === title ? "tab-active !border-mainOrange" : ""}`} onClick={() => onClick(title)}>{title}</button>;
}

export default TabItem;
