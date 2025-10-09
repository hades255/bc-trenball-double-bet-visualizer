import React, { useState } from "react";
import "./Summary.css";

export const Summary = ({ structuredData }) => {
  const [limit, setLimit] = useState(20);

  if (!structuredData || !structuredData.length) return <p>No data</p>;

  const limited = structuredData.slice(-limit);

  // Count colors
  let red = 0,
    green = 0,
    moon = 0,
    totalBet = 0,
    totalWin = 0,
    earn = 0;

  limited.forEach((col) => {
    col.forEach((item) => {
      if (item.color === "red") red++;
      else if (item.color === "moon") moon++;
      else if (item.color === "green") green++;
      if (item.betColor) {
        totalBet++;
        if (item.won) totalWin++;
        earn += item.profit;
      }
    });
  });

  const calculateCountConsecutive = () => {
    let gres = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
    let rres = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
    limited.forEach((item) => {
      if (item && item.length > 0) {
        const color = item[0].color;
        const count = item.length - 1;
        if (color === "red") rres[count]++;
        else gres[count]++;
      }
    });
    return { gres, rres };
  };

  const countConsecutive = calculateCountConsecutive();

  const handleLimit = (n) => {
    if (n === "max") setLimit(structuredData.length);
    else setLimit(n);
  };

  return (
    <div
      style={{
        border: "1px solid #ccc",
        padding: 10,
        marginTop: 10,
        display: "flex",
        flexDirection: "column",
        gap: 12,
      }}
    >
      <h3>Summary (last {limit})</h3>
      <div style={{ display: "flex", gap: 8 }}>
        {[10, 20, 50, 100].map((n) => (
          <button key={n} onClick={() => handleLimit(n)}>
            {n}
          </button>
        ))}
        <button onClick={() => handleLimit("max")}>Max</button>
      </div>

      <table>
        <tbody>
          <tr>
            <td>green</td>
            <td>{green}</td>
            <td>red</td>
            <td>{red}</td>
            <td>moon</td>
            <td>{moon}</td>
          </tr>
        </tbody>
      </table>
      <table>
        <tbody>
          <tr>
            <td>color</td>
            {[...Array(18)].map((_, index) => (
              <td key={index}>{index + 1}</td>
            ))}
          </tr>
          <tr>
            <td>green/moon</td>
            {countConsecutive.gres.map((item, index) => (
              <td key={index}>{item === 0 ? "" : item}</td>
            ))}
          </tr>
          <tr>
            <td>red</td>
            {countConsecutive.rres.map((item, index) => (
              <td key={index}>{item === 0 ? "" : item}</td>
            ))}
          </tr>
        </tbody>
      </table>
      <table>
        <tbody>
          <tr>
            <td>total bet</td>
            <td>{totalBet}</td>
            <td>win</td>
            <td>{totalWin}</td>
            <td>earn</td>
            <td>{earn.toFixed(8)}</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};
