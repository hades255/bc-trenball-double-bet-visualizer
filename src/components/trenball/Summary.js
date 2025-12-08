import React, { useCallback, useEffect, useMemo, useState } from "react";
import clsx from "clsx";
import DateTimeRangeSelector from "../DateTimeRangeSelector";
import ManualBet from "./ManualBet";
import MaxStickView from "./MaxStickView";
import RenderItems from "./RenderItems";
import TimeDetail from "./TimeDetail";
import WinHistory from "./WinHistory";
import "./Summary.css";
import ConsView from "./ConsView";
import PeriodView from "./PeriodView";

export const Summary = ({ structuredData, rawData }) => {
  const [current, setCurrent] = useState(0);
  const [filtered, setFiltered] = useState([]);
  const [filteredRaw, setFilteredRaw] = useState([]);
  const [limit, setLimit] = useState(3000);
  const [range, setRange] = useState({ start: "", end: "" });

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

  useEffect(() => {
    if (structuredData && structuredData.length) {
      const _filtered = structuredData.filter((item) =>
        item[0].dt
          ? (range.start
              ? item[0].dt >= new Date(range.start).getTime()
              : true) &&
            (range.end ? item[0].dt < new Date(range.end).getTime() : true)
          : range.start || range.end
          ? false
          : true
      );
      setFiltered(_filtered);
      setLimit(_filtered.length);
    }
  }, [structuredData, range]);

  useEffect(() => {
    if (rawData && rawData.length) {
      const _filtered = rawData.filter((item) =>
        item.dt
          ? (range.start ? item.dt >= new Date(range.start).getTime() : true) &&
            (range.end ? item.dt < new Date(range.end).getTime() : true)
          : range.start || range.end
          ? false
          : true
      );
      setFilteredRaw(_filtered);
    }
  }, [rawData, range]);

  const handleDateTimeChange = useCallback((newRange) => {
    setCurrent(0);
    setRange(newRange);
  }, []);

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

  const countConsecutive = useMemo(() => {
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
  }, [limited]);

  const handleLimit = useCallback(
    (n) => {
      if (n === "max") {
        setCurrent(0);
        setLimit(filtered.length);
      } else {
        setCurrent(Math.floor((limit * current) / n));
        setLimit(n);
      }
    },
    [filtered, limit, current]
  );

  const handleClickPrev = useCallback(() => {
    setCurrent(
      current * limit + limit < filtered.length ? current + 1 : current
    );
  }, [current, limit, filtered]);

  const handleClickNext = useCallback(() => {
    setCurrent(current > 0 ? current - 1 : 0);
  }, [current]);

  const exportStJSON = useCallback(() => {
    const data = filtered;
    const start = range.start.substring(0, range.start.length - 3);
    const end = range.end.substring(0, range.end.length - 3);
    const blob = new Blob([JSON.stringify(data, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${start}_${end}_st.json`;
    a.click();
    URL.revokeObjectURL(url);
  }, [filtered, range]);

  const exportJSON = useCallback(() => {
    const data = filtered.flat().sort((a, b) => {
      if (a > b) return -1;
      if (a < b) return 1;
      return 0;
    });
    const start = range.start.substring(0, range.start.length - 3);
    const end = range.end.substring(0, range.end.length - 3);
    const blob = new Blob([JSON.stringify(data, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${start}_${end}_raw.json`;
    a.click();
    URL.revokeObjectURL(url);
  }, [filtered, range]);

  return structuredData && structuredData.length > 0 ? (
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
      <h3 className="flex">
        Summary {Math.max(filtered.length - limit * current - limit, 0)}
        {" to "}
        {filtered.length - current * limit} ({limited.length})
        <div style={{ marginLeft: 8 }}>
          <button
            style={{ marginLeft: 4, display: "none" }}
            onClick={exportStJSON}
          >
            structured export
          </button>
          <button style={{ marginLeft: 4 }} onClick={exportJSON}>
            raw export
          </button>
        </div>
      </h3>
      <DateTimeRangeSelector onChange={handleDateTimeChange} />
      <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
        {[10, 20, 50, 100, 1000, 1500, 3000].map((n) => (
          <button
            key={n}
            onClick={() => handleLimit(n)}
            className={clsx({ active: limit === n })}
          >
            {n}
          </button>
        ))}
        <button
          onClick={() => handleLimit("max")}
          className={clsx({ active: limit === filtered.length })}
        >
          Max
        </button>
        <button onClick={handleClickPrev}>Prev</button>
        <button onClick={handleClickNext}>Next</button>
      </div>

      <RenderItems data={limited} />

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
      {/* <BetOptionView green={green} moon={moon} red={red} /> */}
      <div className="responsible">
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
                  {/* <br />
                  {item === 0 ? "" : floatToFixed(item * 0.96, 2)} */}
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
            <td>bet</td>
            <th>{totalBet}</th>
            <td>win</td>
            <th>{totalWin}</th>
            <td>earn</td>
            <th>{floatToFixed(earn, 3)}</th>
            <td>min/max</td>
            <th>
              {floatToFixed(Math.min(...profitState), 3)}
              {" / "}
              {floatToFixed(Math.max(...profitState), 3)}
            </th>
          </tr>
          <BetCase data={countConsecutive} />
        </tbody>
      </table>
      <WinHistory data={winHistory} />
      <MaxStickView data={limited} />
      <ConsView data={limited} />
      {/* <DetailView data={countConsecutive} adata={limited} /> */}
      {false && filteredRaw && (
        <ManualBet
          data={filteredRaw.filter((item) =>
            item.dt
              ? (range.start
                  ? item.dt >= new Date(range.start).getTime()
                  : true) &&
                (range.end ? item.dt < new Date(range.end).getTime() : true)
              : range.start || range.end
              ? false
              : true
          )}
        />
      )}
      <TimeDetail data={limited} />
      <PeriodView data={filteredRaw} />
    </div>
  ) : (
    <div>No Data available</div>
  );
};

const gMulti = [0.96, 0.92, 0.84, 0.68, 0.36, -0.28];

function BetCase({ data }) {
  const result = useMemo(() => {
    let gres = 0;
    let greCounts = 0;
    let glose = 0;
    let ghis = [];
    data.gres.forEach((item, index) => {
      if (index >= 7 && index < 12 && gMulti[index - 7]) {
        const m = gMulti[index - 7] * item;
        gres += m;
        ghis.push(`${gMulti[index - 7]} * ${item} = ${floatToFixed(m)}`);
        greCounts += item;
      } else if (index >= 12 && item) {
        glose += item;
      }
    });
    let rres = 0;
    let overMax = 0;
    data.rres.forEach((item, index) => {
      if (index >= 16) overMax += item;
      else if (index >= 11) rres += item;
    });
    return (
      <>
        <tr>
          <td style={{ color: "red" }}>red</td>
          <td>12{"<"}16</td>
          <td>{rres}</td>
          <td>{">"}16</td>
          <td>{overMax}*(-31)</td>
          <td>sum</td>
          <td>{rres - overMax * 31}</td>
          <td></td>
        </tr>
        <tr>
          <td style={{ color: "lightgreen" }}>green {">"}8</td>
          <td>8{"<"}12</td>
          <td>
            <p>{greCounts}</p>
            <p>{floatToFixed(gres)}</p>
            {/* <p>({floatToFixed(gres * 2)})</p> */}
          </td>
          <td>{">"}12</td>
          <td>{glose}*(-31)</td>
          <td>sum</td>
          <td>
            <p style={{ fontWeight: "bold" }}>
              {floatToFixed(gres - glose * 31)}
            </p>
            <p>TOTAL</p>
            <p>{floatToFixed(rres - overMax * 31 + gres - glose * 31)}</p>
            {/* <p>({floatToFixed((gres - glose * 31) * 2)})</p> */}
          </td>
          <td style={{ textAlign: "left", textWrap: "nowrap" }}>
            {ghis.map((item, index) => (
              <div key={index}>{item}</div>
            ))}
          </td>
        </tr>
      </>
    );
  }, [data]);

  return <>{result}</>;
}

export function floatToFixed(data, count = 2) {
  return Math.round(data * Math.pow(10, count)) / Math.pow(10, count);
}
