import React, { useCallback, useState, useMemo } from "react";

function TimeDetailMain({ data }) {
  const [shows, setShows] = useState(["green", "red"]);
  const [crit, setCrit] = useState(false);

  const handleClickShowCrit = useCallback(() => {
    setCrit(!crit);
  }, [crit]);

  const handleClickShowItem = useCallback(
    (color) => {
      if (shows.includes(color))
        setShows(shows.filter((item) => item !== color));
      else setShows([...shows, color]);
    },
    [shows]
  );

  const convertDt2time = useCallback((dt) => {
    const d = new Date(dt);
    return d.getHours() * 60 * 60 + d.getMinutes() * 60 + d.getSeconds();
  }, []);

  const dtTime2time = useCallback((data) => {
    const sec = data % 60;
    const min = ((data - sec) / 60) % 60;
    const hr = (data - sec - min * 60) / 3600;
    return `${hr}:${min}:${sec}`;
  }, []);

  const dataTime = useMemo(() => {
    if (data && data.length > 0) {
      let resArray = [];
      data.forEach((item) => {
        const color = item[0].color === "moon" ? "green" : item[0].color;
        if (
          item[0].dt &&
          ((color === "red" && item.length >= 12) ||
            (color === "green" && item.length >= 8))
        ) {
          resArray.push({
            color: color,
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
  }, [data, convertDt2time]);

  return (
    dataTime &&
    dataTime.length > 0 && (
      <>
        <table style={{ marginBottom: 12 }}>
          <tbody>
            <tr>
              <td
                className="td-btn"
                style={{
                  color: shows.includes("green") ? "lightgreen" : "gray",
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
                  color: shows.includes("red") ? "red" : "gray",
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
                  color: crit ? "gold" : "gray",
                }}
                onClick={handleClickShowCrit}
              >
                critical
              </td>
            </tr>
          </tbody>
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
                      <td
                        style={{
                          color: item.color,
                        }}
                      >
                        {item.color}
                      </td>
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

function TimeDetail({ data }) {
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
          <span className="foldable-label">times</span>
        </button>
      </div>

      {open && <TimeDetailMain data={data} />}
    </div>
  );
}

export default TimeDetail;
