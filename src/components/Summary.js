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
            <td>total bet</td>
            <td>{totalBet}</td>
            <td>win</td>
            <td>{totalWin}</td>
            <td>earn</td>
            <td>{earn.toFixed(8)}</td>
          </tr>
        </tbody>
      </table>
      <div style={{ maxWidth: "100%", overflowX: "auto" }}>
        <table>
          <tbody>
            <tr>
              <td>color</td>
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
      <DetailView data={countConsecutive} />
    </div>
  );
};

function DetailView({ data }) {
  if (!data || !data.gres || !data.rres) return <></>;

  return (
    <>
      {true && (
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
      )}
      {true && (
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
      )}
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

function floatToFixed(data) {
  return Math.round(data * 100) / 100;
}
