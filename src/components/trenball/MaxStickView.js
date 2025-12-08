import { useCallback, useState } from "react";
import { floatToFixed } from "./Summary";

function MaxStickViewMain({ data }) {
  const [select, setSelect] = useState(["green", "red"]);

  const handleClickSelectItem = useCallback(
    (color) => {
      if (select.includes(color))
        setSelect(select.filter((item) => item !== color));
      else setSelect([...select, color]);
    },
    [select]
  );

  return (
    <>
      <table style={{ marginBottom: 12 }}>
        <tbody>
          <tr>
            <td
              className="td-btn"
              style={{ color: select.includes("green") ? "lightgreen" : "gray" }}
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
              style={{ color: select.includes("red") ? "red" : "gray" }}
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
      <div style={{ maxHeight: "60vh", overflowY: "auto" }}>
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

function MaxStickView({ data }) {
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
          <span className="foldable-label">max bets</span>
        </button>
      </div>

      {open && <MaxStickViewMain data={data} />}
    </div>
  );
}

export default MaxStickView;
