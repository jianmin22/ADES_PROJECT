import React from "react";

const arrowStyle = {
  width: "30px",
  height: "30px",
  backgroundColor: "#fff",
  color: "#000",
  fontSize: "90px",
  display: "inline-block",
  justifyContent: "center",
  alignItems: "center",
  cursor: "pointer",
  position: "absolute",
  top: "50%",
  transform: "translateY(-50%)", // Center vertically
};

const CustomArrow = ({ onClick, arrowType }) => {
  const arrowPosition =
    arrowType === "next" ? { right: "-40px" } : { left: "-40px" };

  return (
    <div style={{ ...arrowStyle, ...arrowPosition }} onClick={onClick}>
      {arrowType === "prev" ? "<" : ">"}
    </div>
  );
};

export default CustomArrow;
