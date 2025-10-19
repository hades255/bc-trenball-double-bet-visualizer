import React, { useState } from "react";
import "./DateTimeRangeSelector.css";

export default function DateTimeRangeSelector({ onChange }) {
  const [range, setRange] = useState({
    start: "",
    end: "",
  });

  const handleChange = (key, value) => {
    const newRange = { ...range, [key]: value };
    setRange(newRange);
    if (onChange) onChange(newRange); // notify parent
  };

  return (
    <div className="datetime-range">
      <div className="datetime-group">
        <label htmlFor="start">Start</label>
        <input
          id="start"
          type="datetime-local"
          value={range.start}
          onChange={(e) => handleChange("start", e.target.value)}
        />
      </div>

      <div className="datetime-group">
        <label htmlFor="end">End</label>
        <input
          id="end"
          type="datetime-local"
          value={range.end}
          onChange={(e) => handleChange("end", e.target.value)}
        />
      </div>
    </div>
  );
}
