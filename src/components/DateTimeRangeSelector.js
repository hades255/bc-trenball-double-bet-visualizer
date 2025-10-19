import React, { useEffect, useState } from "react";
import clsx from "clsx";
import "./DateTimeRangeSelector.css";

export default function DateTimeRangeSelector({ onChange }) {
  const [range, setRange] = useState({ start: "", end: "" });
  const [mode, setMode] = useState("week");

  const formatLocal = (date) => {
    const pad = (n) => String(n).padStart(2, "0");
    return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(
      date.getDate()
    )}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
  };

  const getWeekRange = (date) => {
    const day = date.getDay();
    const start = new Date(date);
    start.setDate(date.getDate() - day);
    start.setHours(0, 0, 0, 0);

    const end = new Date(start);
    end.setDate(start.getDate() + 6);
    end.setHours(23, 59, 0, 0);
    return { start, end };
  };

  const getMonthRange = (date) => {
    const start = new Date(date.getFullYear(), date.getMonth(), 1, 0, 0, 0, 0);
    const end = new Date(
      date.getFullYear(),
      date.getMonth() + 1,
      0,
      23,
      59,
      0,
      0
    );
    return { start, end };
  };

  const getDayRange = (date) => {
    const start = new Date(date);
    start.setHours(0, 0, 0, 0);
    const end = new Date(date);
    end.setHours(23, 59, 0, 0);
    return { start, end };
  };

  const updateRange = (newStart, newEnd) => {
    const newRange = {
      start: formatLocal(newStart),
      end: formatLocal(newEnd),
    };
    setRange(newRange);
    if (onChange) onChange(newRange);
  };

  const handleModeChange = (newMode) => {
    setMode(newMode);
    const now = new Date();
    if (newMode === "day") {
      const { start, end } = getDayRange(now);
      updateRange(start, end);
    } else if (newMode === "week") {
      const { start, end } = getWeekRange(now);
      updateRange(start, end);
    } else if (newMode === "month") {
      const { start, end } = getMonthRange(now);
      updateRange(start, end);
    }
  };

  const shiftRange = (direction) => {
    const sign = direction === "next" ? 1 : -1;
    let start = new Date(range.start);
    let end = new Date(range.end);

    if (mode === "day") {
      start.setDate(start.getDate() + sign * 1);
      end.setDate(end.getDate() + sign * 1);
    } else if (mode === "week") {
      start.setDate(start.getDate() + sign * 7);
      end.setDate(end.getDate() + sign * 7);
    } else if (mode === "month") {
      start.setMonth(start.getMonth() + sign * 1);
      end.setMonth(end.getMonth() + sign * 1);
    }

    updateRange(start, end);
  };

  useEffect(() => {
    handleModeChange("week");
  }, []);

  return (
    <div
      className="datetime-range"
      style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem" }}
    >
      <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}>
        <div className="datetime-group">
          <label htmlFor="start">Start</label>
          <input
            id="start"
            type="datetime-local"
            value={range.start}
            onChange={(e) =>
              updateRange(new Date(e.target.value), new Date(range.end))
            }
          />
        </div>

        <div className="datetime-group">
          <label htmlFor="end">End</label>
          <input
            id="end"
            type="datetime-local"
            value={range.end}
            onChange={(e) =>
              updateRange(new Date(range.start), new Date(e.target.value))
            }
          />
        </div>
      </div>
      <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
        <button
          onClick={() => handleModeChange("month")}
          className={clsx({ active: mode === "month" })}
        >
          Month
        </button>

        <button
          onClick={() => handleModeChange("week")}
          className={clsx({ active: mode === "week" })}
        >
          Week
        </button>

        <button
          onClick={() => handleModeChange("day")}
          className={clsx({ active: mode === "day" })}
        >
          Day
        </button>

        <button onClick={() => shiftRange("prev")}>Prev</button>
        <button onClick={() => shiftRange("next")}>Next</button>
      </div>
    </div>
  );
}
