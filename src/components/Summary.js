import React, { useState } from "react";
import { RenderItems } from "./RenderItems";
import "./Summary.css";

export const Summary = ({ structuredData }) => {
  const [current, setCurrent] = useState(0);
  const [limit, setLimit] = useState(20);

  if (!structuredData || !structuredData.length) return <p>No data</p>;

  const limited = structuredData.slice(
    Math.max(structuredData.length - limit * current - limit, 0),
    structuredData.length - limit * current
  );

  // Count colors
  let red = 0,
    green = 0,
    moon = 0,
    totalBet = 0,
    totalWin = 0,
    earn = 0,
    winHistory = [],
    profitState = [];

  limited.forEach((col) => {
    col.forEach((item) => {
      if (item.color === "red") red++;
      else if (item.color === "moon") moon++;
      else if (item.color === "green") green++;
      if (item.betColor) {
        totalBet++;
        if (item.won) {
          totalWin++;
        }
        winHistory.push(item);
        earn += item.profit;
      }
    });
  });

  winHistory = winHistory.map((item, index) => ({
    ...item,
    state: winHistory
      .filter((_, _index) => _index <= index)
      .map((_item) => _item.profit)
      .reduce((a, b) => a + b, 0),
  }));

  profitState = winHistory.map((item) => item.state);

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
    if (n === "max") {
      setCurrent(0);
      setLimit(structuredData.length);
    } else {
      setCurrent(Math.floor((limit * current) / n));
      setLimit(n);
    }
  };

  const handleClickPrev = () => {
    setCurrent(
      current * limit + limit < structuredData.length ? current + 1 : current
    );
  };

  const handleClickNext = () => {
    setCurrent(current > 0 ? current - 1 : 0);
  };

  return (
    <div
      style={{
        border: "1px solid #dddddd4d",
        padding: 10,
        marginTop: 10,
        marginBottom: 10,
        display: "flex",
        flexDirection: "column",
        gap: 12,
      }}
    >
      <h3>
        Summary ({Math.max(structuredData.length - limit * current - limit, 0)}
        {" to "}
        {structuredData.length - current * limit})
      </h3>
      <div style={{ display: "flex", gap: 8 }}>
        {[10, 20, 50, 100, 1000, 1500, 3000].map((n) => (
          <button
            key={n}
            onClick={() => handleLimit(n)}
            style={limit === n ? { borderColor: "white" } : {}}
          >
            {n}
          </button>
        ))}
        <button onClick={() => handleLimit("max")}>Max</button>
        <button onClick={handleClickPrev}>Prev</button>
        <button onClick={handleClickNext}>Next</button>
      </div>

      <RenderItems structuredData={limited} />

      <table>
        <tbody>
          <tr>
            <td>green</td>
            <th>{green}</th>
            <td>red</td>
            <th>{red}</th>
            <td>moon</td>
            <th>{moon}</th>
            <td>total</td>
            <th>{green + red + moon}</th>
          </tr>
        </tbody>
      </table>
      <table>
        <tbody>
          <tr>
            <td>total bet</td>
            <th>{totalBet}</th>
            <td>win</td>
            <th>{totalWin}</th>
            <td>earn</td>
            <th>{earn.toFixed(4)}</th>
          </tr>
        </tbody>
      </table>
      <div style={{ maxWidth: "100%", overflowX: "auto" }}>
        <table>
          <tbody>
            <tr>
              <td></td>
              {[...Array(18)].map((_, index) => (
                <th key={index}>{index + 1}</th>
              ))}
              <td></td>
            </tr>
            <tr>
              <td>green/moon</td>
              {countConsecutive.gres.map((item, index) => (
                <th
                  key={index}
                  title={countConsecutive.gres
                    .filter((_, _index) => _index >= index)
                    .reduce((a, b) => a + b, 0)}
                >
                  {item === 0 ? "" : item}
                </th>
              ))}
              <td>
                {countConsecutive.gres
                  .map((item, index) => item * (index + 1))
                  .reduce((a, b) => a + b, 0)}
              </td>
            </tr>
            <tr>
              <td>red</td>
              {countConsecutive.rres.map((item, index) => (
                <th
                  key={index}
                  title={countConsecutive.rres
                    .filter((_, _index) => _index >= index)
                    .reduce((a, b) => a + b, 0)}
                >
                  {item === 0 ? "" : item}
                </th>
              ))}
              <td>
                {countConsecutive.rres
                  .map((item, index) => item * (index + 1))
                  .reduce((a, b) => a + b, 0)}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <table>
        <tbody>
          <tr>
            <td>profit</td>
            <th>{floatToFixed(profitState[profitState.length - 1], 3)}</th>
            <td>min</td>
            <th>{floatToFixed(Math.min(...profitState), 3)}</th>
            <td>max</td>
            <th>{floatToFixed(Math.max(...profitState), 3)}</th>
          </tr>
        </tbody>
      </table>
      <details>
        <summary>win history</summary>
        <div style={{ maxHeight: "40vh", overflowY: "auto" }}>
          <table>
            <thead>
              <tr>
                <td>mult</td>
                <td>bet</td>
                <td>profit</td>
                <td>stick</td>
                <td></td>
                <td></td>
              </tr>
            </thead>
            <tbody>
              {winHistory.map((item, index) => (
                <tr key={index}>
                  <td
                    style={{
                      backgroundColor:
                        item.color === "moon" ? "yellow" : item.color,
                      color: "black",
                    }}
                  >
                    {item.multiplier}
                  </td>
                  <td style={{ backgroundColor: item.betColor }}>
                    {item.betAmount}
                  </td>
                  <td>{item.profit}</td>
                  <td>{item.stick}</td>
                  <td>{floatToFixed(item.state, 3)}</td>
                  <td>{new Date(item.dt).toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </details>
      <DetailView data={countConsecutive} />
    </div>
  );
};

function DetailView({ data }) {
  if (!data || !data.gres || !data.rres) return <></>;

  return (
    <>
      <details>
        <summary>Green</summary>
        <div>
          <table>
            <thead>
              <tr>
                <th>count</th>
                <th>bet</th>
                <th>red win</th>
                <th>profit</th>
                <th>green win</th>
                <th>profit</th>
              </tr>
            </thead>
            <tbody>
              {data.gres.map(
                (item, index) =>
                  index < 17 && (
                    <DetailViewItem
                      color={"green"}
                      data={item}
                      nextData={data.gres
                        .filter((_, _index) => _index >= index + 1)
                        .reduce((a, b) => a + b, 0)}
                      count={index + 1}
                      key={index}
                    />
                  )
              )}
            </tbody>
          </table>
        </div>
      </details>
      <details open>
        <summary>Red</summary>
        <div>
          <table>
            <thead>
              <tr>
                <th>count</th>
                <th>bet</th>
                <th>red win</th>
                <th>profit</th>
                <th>green win</th>
                <th>profit</th>
              </tr>
            </thead>
            <tbody>
              {data.rres.map(
                (item, index) =>
                  index < 17 && (
                    <DetailViewItem
                      color={"red"}
                      data={data.rres
                        .filter((_, _index) => _index >= index + 1)
                        .reduce((a, b) => a + b, 0)}
                      nextData={item}
                      count={index + 1}
                      key={index}
                    />
                  )
              )}
            </tbody>
          </table>
        </div>
      </details>
    </>
  );
}

function DetailViewItem({ color, count, data, nextData }) {
  if (data === 0 && nextData === 0) return <></>;
  const bet = data + nextData;
  const rprofit = floatToFixed(data * 0.96 - nextData);
  const gprofit = nextData - data;
  return (
    <tr>
      <th style={{ color }}>{count}</th>
      <td>{bet}</td>
      <td>{data}</td>
      <td
        style={{
          backgroundColor: rprofit > 0.0 ? "#800" : "transparent",
        }}
      >
        {rprofit}
      </td>
      <td>{nextData}</td>
      <td
        style={{
          backgroundColor: gprofit > 0.0 ? "#080" : "transparent",
        }}
      >
        {gprofit}
      </td>
    </tr>
  );
}

function floatToFixed(data, count = 2) {
  return Math.round(data * Math.pow(10, count)) / Math.pow(10, count);
}
