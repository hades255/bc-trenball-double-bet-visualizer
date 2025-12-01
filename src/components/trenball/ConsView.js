import { useCallback, useMemo, useState } from "react";
import { floatToFixed } from "./Summary";

function ConsViewMain({ data }) {
  const resultData = useMemo(() => {
    let res = [];
    if (data && data.length > 1) {
      for (let i = 1; i < data.length; i++) {
        const data0 = data[i - 1];
        const data1 = data[i];
        if (data0 && data0.length > 0 && data1 && data1.length > 0) {
          const id0_s = Number(data0[0].roundId);
          const id0_l = Number(data0[data0.length - 1].roundId);
          const id1_s = Number(data1[0].roundId);
          const id1_l = Number(data1[data1.length - 1].roundId);
          const dt = new Date(data0[0].dt);
          const missing_time = floatToFixed(
            Number(data1[0].dt - data0[data0.length - 1].dt) / 1000,
            0
          );
          if (id0_l && id1_s) {
            if (id1_s > id0_l + 1) {
              res.push({
                id0_s,
                id0_l,
                id1_s,
                id1_l,
                color0: data0[0].color === "moon" ? "green" : data0[0].color,
                color1: data1[0].color === "moon" ? "green" : data1[0].color,
                len0: data0.length,
                len1: data1.length,
                dt,
                missing_time,
                missing: id1_s - id0_l - 1,
              });
            }
          }
        }
      }
    }
    return res;
  }, [data]);

  return (
    <div style={{ maxHeight: "40vh", overflowY: "auto" }}>
      <table>
        <thead>
          <tr>
            <th>{resultData.length}</th>
          </tr>
        </thead>
        <tbody>
          {resultData.map((item, index) => (
            <tr key={index}>
              <td style={{ color: item.color0 }}>
                <span>
                  {item.id0_s === item.id0_l
                    ? item.id0_s
                    : `${item.id0_s}-${item.id0_l}`}
                </span>
                <b> ({item.len0})</b>
              </td>
              <td style={{ color: item.color1 }}>
                <span>
                  {item.id1_s === item.id1_l
                    ? item.id1_s
                    : `${item.id1_s}-${item.id1_l}`}
                </span>
                <b> ({item.len1})</b>
              </td>
              <td>{item.missing}</td>
              <td>{item.missing_time}</td>
              <td>{item.dt?.toLocaleDateString()}</td>
              <td>{item.dt?.toLocaleTimeString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function ConsView({ data }) {
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
          <span className="foldable-label">cons view</span>
        </button>
      </div>

      {open && <ConsViewMain data={data} />}
    </div>
  );
}

export default ConsView;
