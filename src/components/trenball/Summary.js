import React, { useEffect, useMemo, useState } from "react";
import clsx from "clsx";
import DateTimeRangeSelector from "../DateTimeRangeSelector";
import FoldableView from "../FoldableView";
import ManualBet from "./ManualBet";
import { RenderItems } from "./RenderItems";
import "./Summary.css";

export const Summary = ({ structuredData, rawData }) => {
  const [range, setRange] = useState({ start: "", end: "" });
  const [current, setCurrent] = useState(0);
  const [limit, setLimit] = useState(3000);
  const [filtered, setFiltered] = useState([]);

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

  const handleDateTimeChange = (newRange) => {
    setCurrent(0);
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

  const exportStJSON = () => {
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
  };

  const exportJSON = () => {
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
      <FoldableView title={"win history"}>
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
      </FoldableView>
      <MaxStickView data={limited} />
      {/* <DetailView data={countConsecutive} adata={limited} /> */}
      {false && rawData && (
        <ManualBet
          data={rawData.filter((item) =>
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
      <FoldableView title={"times"} init>
        <TimeDetail data={limited} />
      </FoldableView>
    </div>
  );
};

// function BetOptionView({ green, moon, red }) {
//   return (
//     <FoldableView title={"bet options"}>
//       <table>
//         <tbody>
//           <tr>
//             <td>green</td>
//             <th>{green + moon}</th>
//             <td>earn</td>
//             <th>{(green + moon) * 2}</th>
//             <td>lose</td>
//             <th>{green + moon + red}</th>
//             <td>profit</td>
//             <th>{green + moon - red}</th>
//           </tr>
//           <tr>
//             <td>red</td>
//             <th>{red}</th>
//             <td>earn</td>
//             <th>{floatToFixed(red * 1.96)}</th>
//             <td>lose</td>
//             <th>{green + moon + red}</th>
//             <td>profit</td>
//             <th>{floatToFixed(red * 0.96 - green - moon)}</th>
//           </tr>
//           <tr>
//             <td>moon</td>
//             <th>{moon}</th>
//             <td>earn</td>
//             <th>{moon * 10}</th>
//             <td>lose</td>
//             <th>{green + moon + red}</th>
//             <td>profit</td>
//             <th>{moon * 9 - green - red}</th>
//           </tr>
//           <tr>
//             <td>green+red</td>
//             <th>{green + moon + red}</th>
//             <td>earn</td>
//             <th>{floatToFixed((green + moon) * 2 + red * 1.96)}</th>
//             <td>lose</td>
//             <th>{(green + moon + red) * 2}</th>
//             <td>profit</td>
//             <th>{-floatToFixed(red * 0.04)}</th>
//           </tr>
//           <tr>
//             <td>green+moon</td>
//             <th>{green + moon + moon}</th>
//             <td>earn</td>
//             <th>{green * 2 + moon * 12}</th>
//             <td>lose</td>
//             <th>{(green + moon + red) * 2}</th>
//             <td>profit</td>
//             <th>{moon * 10 - red * 2}</th>
//           </tr>
//           <tr>
//             <td>red+moon</td>
//             <th>{red + moon}</th>
//             <td>earn</td>
//             <th>{floatToFixed(red * 1.96 + moon * 10)}</th>
//             <td>lose</td>
//             <th>{(green + moon + red) * 2}</th>
//             <td>profit</td>
//             <th>{floatToFixed(moon * 8 - red * 0.04 - green * 2)}</th>
//           </tr>
//           <tr>
//             <td>green+red+moon</td>
//             <th>{green + moon + red}</th>
//             <td>earn</td>
//             <th>{floatToFixed(green * 2 + moon * 10 + red * 1.96)}</th>
//             <td>lose</td>
//             <th>{(green + moon + red) * 3}</th>
//             <td>profit</td>
//             <th>{floatToFixed(moon * 7 - green - red * 1.04)}</th>
//           </tr>
//         </tbody>
//       </table>
//     </FoldableView>
//   );
// }

// function DetailView({ data, adata }) {
//   if (!data || !data.gres || !data.rres) return <></>;

//   return (
//     <>
//       <GreenDetailViewTable data={data} />
//       <RedDetailViewTable data={data} />
//       <FoldableView title={"Red Details"}>
//         <SDetails data={adata} />
//       </FoldableView>
//     </>
//   );
// }

// function GreenDetailViewTable({ data }) {
//   return (
//     <FoldableView title={"Green"}>
//       <div>
//         <table>
//           <thead>
//             <tr>
//               <th>count</th>
//               <th>bet</th>
//               <th>red win</th>
//               <th>profit</th>
//               <th>green win</th>
//               <th>profit</th>
//             </tr>
//           </thead>
//           <tbody>
//             {data.gres.map(
//               (item, index) =>
//                 index < 17 && (
//                   <DetailViewItem
//                     color={"green"}
//                     data={item}
//                     nextData={data.gres
//                       .filter((_, _index) => _index >= index + 1)
//                       .reduce((a, b) => a + b, 0)}
//                     count={index + 1}
//                     key={index}
//                   />
//                 )
//             )}
//           </tbody>
//         </table>
//       </div>
//     </FoldableView>
//   );
// }

// function RedDetailViewTable({ data }) {
//   return (
//     <FoldableView title={"Red"}>
//       <div>
//         <table>
//           <thead>
//             <tr>
//               <th>count</th>
//               <th>bet</th>
//               <th>red win</th>
//               <th>profit</th>
//               <th>green win</th>
//               <th>profit</th>
//             </tr>
//           </thead>
//           <tbody>
//             {data.rres.map(
//               (item, index) =>
//                 index < 17 && (
//                   <DetailViewItem
//                     color={"red"}
//                     data={data.rres
//                       .filter((_, _index) => _index >= index + 1)
//                       .reduce((a, b) => a + b, 0)}
//                     nextData={item}
//                     count={index + 1}
//                     key={index}
//                   />
//                 )
//             )}
//           </tbody>
//         </table>
//       </div>
//     </FoldableView>
//   );
// }

// function DetailViewItem({ color, count, data, nextData }) {
//   if (data === 0 && nextData === 0) return <></>;
//   const bet = data + nextData;
//   const rprofit = floatToFixed(data * 0.96 - nextData);
//   const gprofit = nextData - data;
//   return (
//     <tr>
//       <th style={{ color }}>{count}</th>
//       <td>{bet}</td>
//       <td>{data}</td>
//       <td
//         style={{
//           backgroundColor: rprofit > 0.0 ? "#800" : "transparent",
//         }}
//       >
//         {rprofit}
//       </td>
//       <td>{nextData}</td>
//       <td
//         style={{
//           backgroundColor: gprofit > 0.0 ? "#080" : "transparent",
//         }}
//       >
//         {gprofit}
//       </td>
//     </tr>
//   );
// }

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
                      item[0].color !== "red" && item.length > 12 && item[0].dt
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
                      : item.length > 12) &&
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

const gMulti = [0.96, 0.92, 0.84, 0.68, 0.36, -0.28];

function BetCase({ data }) {
  const result = useMemo(() => {
    let gres = 0;
    let greCounts = 0;
    let glose = 0;
    let ghis = [];
    // let gres7 = 0;
    // let gresCount7 = 0;
    // let glose7 = 0;
    // let ghis7 = [];
    data.gres.forEach((item, index) => {
      // if (index >= 6 && index < 12 && gMulti[index - 6]) {
      //   const m = gMulti[index - 6] * item;
      //   gres7 += m;
      //   ghis7.push(`${gMulti[index - 6]} * ${item} = ${floatToFixed(m)}`);
      //   gresCount7 += item;
      // } else if (index >= 12 && item) {
      //   glose7 += item;
      // }
      if (index >= 7 && index < 12 && gMulti[index - 7]) {
        const m = gMulti[index - 7] * item;
        gres += m;
        ghis.push(`${gMulti[index - 7]} * ${item} = ${floatToFixed(m)}`);
        greCounts += item;
      } else if (index >= 12 && item) {
        glose += item;
      }
    });
    // return `${gres} - ${glose}`;
    let rres = 0;
    let overMax = 0;
    data.rres.forEach((item, index) => {
      if (index >= 16) overMax += item;
      else if (index >= 11) rres += item;
    });
    return (
      <>
        <tr>
          <td></td>
          <td></td>
          <td></td>
          <td></td>
          <td></td>
          <td></td>
          <td></td>
          <td></td>
        </tr>
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
        {/* <tr>
          <td style={{ color: "lightgreen" }}>green {">"}7</td>
          <td>7{"<"}12</td>
          <td>
            <p>{gresCount7}</p>
            <p>{floatToFixed(gres7)}</p>
          </td>
          <td>{">"}12</td>
          <td>{glose7}*(-63)</td>
          <td>sum</td>
          <th>{floatToFixed(gres7 - glose7 * 63)}</th>
          <td style={{ textAlign: "left" }}>
            {ghis7.map((item, index) => (
              <div key={index}>{item}</div>
            ))}
          </td>
        </tr> */}
        <tr>
          <td style={{ color: "lightgreen" }}>green {">"}8</td>
          <td>8{"<"}12</td>
          <td>
            <p>{greCounts}</p>
            <p>{floatToFixed(gres)}</p>
            <p>({floatToFixed(gres * 2)})</p>
          </td>
          <td>{">"}12</td>
          <td>{glose}*(-31)</td>
          <td>sum</td>
          <td>
            <p style={{ fontWeight: "bold" }}>
              {floatToFixed(gres - glose * 31)}
            </p>
            <p>({floatToFixed((gres - glose * 31) * 2)})</p>
          </td>
          <td style={{ textAlign: "left" }}>
            {ghis.map((item, index) => (
              <div key={index}>{item}</div>
            ))}
          </td>
        </tr>
      </>
    );
    // `${rres} - ${overMax * 31}, ${floatToFixed(gres, 2)} - ${glose}`;
  }, [data]);

  return <>{result}</>;
}

export function floatToFixed(data, count = 2) {
  return Math.round(data * Math.pow(10, count)) / Math.pow(10, count);
}

function TimeDetail({ data }) {
  const [shows, setShows] = useState(["green", "red"]);
  const [crit, setCrit] = useState(false);

  const handleClickShowCrit = () => {
    setCrit(!crit);
  };

  const handleClickShowItem = (color) => {
    if (shows.includes(color)) setShows(shows.filter((item) => item !== color));
    else setShows([...shows, color]);
  };

  const convertDt2time = (dt) => {
    const d = new Date(dt);
    return d.getHours() * 60 * 60 + d.getMinutes() * 60 + d.getSeconds();
  };

  const dtTime2time = (data) => {
    const sec = data % 60;
    const min = ((data - sec) / 60) % 60;
    const hr = (data - sec - min * 60) / 3600;
    return `${hr}:${min}:${sec}`;
  };

  const dataTime = useMemo(() => {
    if (data && data.length > 0) {
      let resArray = [];
      data.forEach((item) => {
        if (
          (item[0].color === "red" && item.length >= 12) ||
          (item[0].color === "green" && item.length >= 8)
        ) {
          resArray.push({
            color: item[0].color,
            count: item.length,
            start: convertDt2time(item[0].dt),
            end: convertDt2time(item[item.length - 1].dt),
          });
        }
      });
      resArray.sort((a, b) => {
        if (a.start > b.start) return 1;
        if (a.start < b.start) return -1;
        return 0;
      });
      return resArray;
    }
    return [];
  }, [data]);

  return (
    dataTime &&
    dataTime.length > 0 && (
      <>
        <table style={{ marginBottom: 12 }}>
          <tr>
            <td
              className="td-btn"
              style={{
                color: shows.includes("green") ? "green" : "white",
              }}
              onClick={() => handleClickShowItem("green")}
            >
              green
            </td>
            <td>
              {
                dataTime.filter(
                  (item) =>
                    item.color === "green" && (crit ? item.count > 12 : true)
                ).length
              }
            </td>
            <td
              className="td-btn"
              style={{
                color: shows.includes("red") ? "red" : "white",
              }}
              onClick={() => handleClickShowItem("red")}
            >
              red
            </td>
            <td>
              {
                dataTime.filter(
                  (item) =>
                    item.color === "red" && (crit ? item.count > 16 : true)
                ).length
              }
            </td>
            <td
              className="td-btn"
              style={{
                color: crit ? "gold" : "white",
              }}
              onClick={handleClickShowCrit}
            >
              critical
            </td>
          </tr>
        </table>
        <div style={{ maxHeight: "40vh", overflowY: "auto" }}>
          <table>
            <tbody>
              {dataTime.map(
                (item, index) =>
                  shows.includes(item.color) &&
                  (crit
                    ? (item.color === "green" && item.count > 12) ||
                      (item.color === "red" && item.count > 16)
                    : true) && (
                    <tr key={index}>
                      <td>{item.color}</td>
                      <td>{item.count}</td>
                      <td>{dtTime2time(item.start)}</td>
                      <td>{dtTime2time(item.end)}</td>
                    </tr>
                  )
              )}
            </tbody>
          </table>
        </div>
      </>
    )
  );
}
