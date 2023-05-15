import React, { useState } from "react";

const RadioButton = () => {
  const [selectedOption, setSelectedOption] = useState("");

  const handleOptionChange = (event) => {
    setSelectedOption(event.target.value);
  };

  return (
    <div>
      <label>
        <input
          type="radio"
          value="Year"
          checked={selectedOption === "Year"}
          onChange={handleOptionChange}
        />
        Year
      </label>

      <label>
        <input
          type="radio"
          value="Date"
          checked={selectedOption === "Date"}
          onChange={handleOptionChange}
        />
        Date
      </label>
    </div>
  );
};

export default RadioButton;
