import React, { useState } from "react";

const SlideSwitch = ({ isChecked, onCheckedChange }) => {
  const [checked, setChecked] = useState(true);

  const handleClick = () => {
    const newChecked = !checked;
    setChecked(newChecked);
    onCheckedChange(newChecked);
  };

  return (
    <button
      type="button"
      style={{
        background: checked ? "white	" : "lavender",
        color: checked ? "black" : "white",
        border: checked ? "1px solid black" : "1px solid lavender	",
        borderRadius: 5,
        fontWeight: "bold",
        fontSize: "16px",
        padding: "10px 15px",
        marginBottom: "10px",
      }}
      onClick={handleClick}
    >
      {checked ? "All Exchange" : "My Exchange"}
    </button>
  );
};

export default SlideSwitch;
