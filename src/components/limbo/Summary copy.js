import React, { useMemo, useState } from "react";
import clsx from "clsx";
import { RenderItems } from "./RenderItems";
import FoldableView from "../FoldableView";
import DateTimeRangeSelector from "../DateTimeRangeSelector";
import "./Summary.css";
import ManualBet from "./ManualBet";

export const Summary = ({ structuredData, rawData, multi }) => {
  const [range, setRange] = useState({ start: "", end: "" });
  const [current, setCurrent] = useState(0);
  const [limit, setLimit] = useState(3000);

  const filtered = useMemo(
    () =>
      structuredData && structuredData.length
        ? structuredData.filter((item) =>
            item[0].dt
              ? (range.start
                  ? item[0].dt >= new Date(range.start).getTime()
                  : true) &&
                (range.end ? item[0].dt < new Date(range.end).getTime() : true)
              : range.start || range.end
              ? false
              : true
          )
        : [],
    [structuredData, range]
  );

  const limited = useMemo(
    () =>
      filtered && filtered.length
        ? filtered.slice(
            Math.max(filtered.length - limit * current - limit, 0),
            filtered.length - limit * current
          )
        : [],
    [filtered, limit, current]
  );

  const handleDateTimeChange = (newRange) => {
    setCurrent(0);
    setLimit(3000);
    setRange(newRange);
  };

  if (!structuredData || !structuredData.length) return <p>No data</p>;

  // Count colors
  let red = 0,
    green = 0,
    moon = 0,
    totalBet = 0,
    totalWin = 0,
    earn = 0,
    winHistory = [],
    profitState = [],
    totalBetAmount = 0,
    totalBetEarn = 0;

  limited.forEach((col) => {
    col.forEach((item) => {
      if (item.color === "red") red++;
      else if (item.color === "moon") moon++;
      else if (item.color === "green") green++;
      if (item.betAmount) {
        totalBet++;
        totalBetAmount += item.betAmount;
        if (item.won) {
          totalWin++;
          totalBetEarn += item.betAmount;
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
    let gres = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
    let rres = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
    limited.forEach((item) => {
      if (item && item.length > 0) {
        const color = item[0].color;
        const count = Math.min(item.length - 1, 20);
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
      setLimit(filtered.length);
    } else {
      setCurrent(Math.floor((limit * current) / n));
      setLimit(n);
    }
  };

  const handleClickPrev = () => {
    setCurrent(
      current * limit + limit < filtered.length ? current + 1 : current
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
        Summary {Math.max(filtered.length - limit * current - limit, 0)}
        {" to "}
        {filtered.length - current * limit} ({limited.length})
      </h3>
      <DateTimeRangeSelector onChange={handleDateTimeChange} />
      <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
        {[10, 20, 50, 100, 500, 1000, 1500, 3000].map((n) => (
          <button
            key={n}
            onClick={() => handleLimit(n)}
            className={clsx({ active: limit === n })}
          >
            {n}
          </button>
        ))}
        <button onClick={() => handleLimit("max")}>Max</button>
        <button onClick={handleClickPrev}>Prev</button>
        <button onClick={handleClickNext}>Next</button>
      </div>

      {/* <RenderItems structuredData={limited} /> */}

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
      <div className="responsible">
        <table>
          <tbody>
            <tr>
              <td></td>
              {[...Array(21)].map((_, index) => (
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
            <td>total bet</td>
            <th>{totalBet}</th>
            <td>win</td>
            <th>{totalWin}</th>
            <td>max</td>
            <td style={{ padding: 0 }}>
              <BetCase data={countConsecutive} />
            </td>
          </tr>
          <tr>
            <td>earn</td>
            <th>{floatToFixed(earn, 3)}</th>
            <td>min</td>
            <th>{floatToFixed(Math.min(...profitState), 3)}</th>
            <th>{floatToFixed(Math.max(...profitState), 3)}</th>
            <td>RED - 16384 * MAX</td>
          </tr>
          <tr>
            <td>toal bet amount</td>
            <th>{floatToFixed(totalBetAmount, 3)}</th>
            <td>total win amount</td>
            <th>{floatToFixed(totalBetEarn, 3)}</th>
            <th></th>
            <td></td>
          </tr>
        </tbody>
      </table>
      {/* <FoldableView title={"win history"}>
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
              {winHistory
                .filter((item) => item.dt)
                .map((item, index) => (
                  <tr key={index}>
                    <td>{index + 1}</td>
                    <th style={{ color: "green" }}>
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
      </FoldableView> */}
      <MaxStickView data={limited} />
      {/* <ManualBet
        data={rawData.filter((item) =>
          !item.stick && item.dt
            ? (range.start
                ? item.dt >= new Date(range.start).getTime()
                : true) &&
              (range.end ? item.dt < new Date(range.end).getTime() : true)
            : range.start || range.end
            ? false
            : true
        )}
      /> */}
    </div>
  );
};

function MaxStickView({ data }) {
  const [select, setSelect] = useState(["green", "red"]);

  const handleClickSelectItem = (color) => {
    if (select.includes(color))
      setSelect(select.filter((item) => item !== color));
    else setSelect([...select, color]);
  };

  return (
    <>
      <FoldableView title="max sticks">
        <table style={{ marginBottom: 12 }}>
          <tbody>
            <tr>
              <td
                className="td-btn"
                style={{ color: select.includes("green") ? "green" : "white" }}
                onClick={() => handleClickSelectItem("green")}
              >
                green
              </td>
              <td>
                {
                  data.filter(
                    (item) =>
                      item[0].color !== "red" && item.length >= 12 && item[0].dt
                  ).length
                }
              </td>
              <td
                className="td-btn"
                style={{ color: select.includes("red") ? "red" : "white" }}
                onClick={() => handleClickSelectItem("red")}
              >
                red
              </td>
              <td>
                {
                  data.filter(
                    (item) =>
                      item[0].color === "red" && item.length >= 12 && item[0].dt
                  ).length
                }
              </td>
            </tr>
          </tbody>
        </table>
        <div style={{ maxHeight: "40vh", overflowY: "auto" }}>
          <table>
            <tbody>
              {data
                .filter(
                  (item) =>
                    select.includes(
                      item[0].color === "moon" ? "green" : item[0].color
                    ) &&
                    (item[0].color === "red"
                      ? item.length >= 12
                      : item.length >= 12) &&
                    item[0].dt
                )
                .map((item, index) => (
                  <MaxStickViewItem key={index} data={item} index={index} />
                ))}
            </tbody>
          </table>
        </div>
      </FoldableView>
    </>
  );
}

function MaxStickViewItem({ index, data }) {
  const bet = data
    .map((item) => item.betAmount || 0)
    .reduce((a, b) => a + b, 0);

  const profit = data
    .map((item) => item.profit || 0)
    .reduce((a, b) => a + b, 0);

  return (
    <>
      <tr>
        <th>{index + 1}</th>
        <th
          style={{
            color: data[0].color === "moon" ? "green" : data[0].color,
          }}
        >
          {data.length}
        </th>
        <th>{floatToFixed(profit, 3)}</th>
        <th>{floatToFixed(bet, 3)}</th>
        <td>{new Date(data[0].dt).toLocaleString()}</td>
      </tr>
    </>
  );
}

function BetCase({ data }) {
  const result = useMemo(() => {
    let rres = 0;
    let overMax = 0;
    data.rres.forEach((item, index) => {
      if (index >= 16) overMax += item;
      else if (index >= 2) rres += item;
    });
    return `${rres} - 16384 * ${overMax} = ${rres - 16384 * overMax}`;
  }, [data]);

  return <>{result}</>;
}

export function floatToFixed(data, count = 2) {
  return Math.round(data * Math.pow(10, count)) / Math.pow(10, count);
}
