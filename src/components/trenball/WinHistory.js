import { useCallback, useState } from "react";
import { floatToFixed } from "./Summary";

function WinHistoryMain({ data }) {
  return (
    <div style={{ maxHeight: "40vh", overflowY: "auto" }}>
      <table>
        <thead>
          <tr>
            <td></td>
            <td>bet</td>
            <td>mult</td>
            <td>profit</td>
            <td>stick</td>
            <td></td>
            <td></td>
          </tr>
        </thead>
        <tbody>
          {data
            .filter((item) => item.dt)
            .map((item, index) => (
              <tr key={index}>
                <td>{index + 1}</td>
                <th style={{ color: item.betColor }}>
                  {floatToFixed(item.betAmount, 3)}
                </th>
                <th
                  style={{
                    color: item.color === "moon" ? "yellow" : item.color,
                  }}
                >
                  {item.multiplier}
                </th>
                <td
                  style={{
                    color: item.won ? "gold" : "white",
                  }}
                >
                  {floatToFixed(item.profit, 3)}
                </td>
                <td>{item.stick}</td>
                <td>{floatToFixed(item.state, 3)}</td>
                <td>{new Date(item.dt).toLocaleString()}</td>
              </tr>
            ))}
        </tbody>
      </table>
    </div>
  );
}

function WinHistory({ data }) {
  const [open, setOpen] = useState(false);

  const handleSetOpen = useCallback(() => {
    setOpen(!open);
  }, [open]);

  return (
    <div className="foldable-container">
      <div className="foldable-header">
        <button onClick={handleSetOpen} className="foldable-button">
          <svg
            className={`foldable-icon ${open ? "open" : ""}`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 9l-7 7-7-7"
            />
          </svg>
          <span className="foldable-label">wins</span>
        </button>
      </div>

      {open && <WinHistoryMain data={data} />}
    </div>
  );
}

export default WinHistory;
