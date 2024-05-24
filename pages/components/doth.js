import React from "react";

const Doth = ({ left, right }) => {
  return (
    <div
      style={{
        left,
        right,
        width: "32px",
        height: "3px",
        background: "#f86070",
        position: "absolute",
        borderRadius: "8px",
        bottom: "-7px",
      }}
    ></div>
  );
};

export default Doth;
