import { useCallback, useEffect, useMemo, useState } from "react";

function PeriodViewMain({ data }) {
  const [showTable, setShowTable] = useState(false);
  const [mult, setMult] = useState(49.99);
  const [lvlCt, setlvlCt] = useState(100);

  const sortedData = useMemo(() => {
    let res = [];
    let last = null;
    data
      .filter((item) => item.multiplier >= mult)
      .forEach((item) => {
        res.push({
          multiplier: item.multiplier,
          roundId: item.roundId,
          dt: item.dt,
          ct: last ? item.roundId - last : 0,
        });
        last = item.roundId;
      });
    return res;
  }, [data, mult]);

  const avgCt = useMemo(
    () =>
      sortedData.map(({ ct }) => ct).reduce((a, b) => a + b, 0) /
      (sortedData.length - 1),
    [sortedData]
  );

  const handleChangeMultChange = useCallback(
    ({ target: { value } }) => setMult(value),
    []
  );

  const handleChangeLvlCtChange = useCallback(
    ({ target: { value } }) => setlvlCt(value),
    []
  );

  useEffect(() => {
    setlvlCt(Math.round(avgCt));
  }, [avgCt]);

  return (
    <div>
      <table>
        <tbody>
          <tr>
            <td width="30%"></td>
            <td width="30%"></td>
            <td width="30%"></td>
          </tr>
          <tr>
            <td>
              <input
                value={mult}
                onChange={handleChangeMultChange}
                name="mult"
                type="number"
              />
            </td>
            <td>{data.length}</td>
            <td>{sortedData.length}</td>
          </tr>
          <tr>
            <td>
              <input
                value={lvlCt}
                onChange={handleChangeLvlCtChange}
                name="lvlCt"
                type="number"
              />
            </td>
            <td>{avgCt}</td>
            <td>{sortedData.filter(({ ct }) => ct > lvlCt).length}</td>
          </tr>
        </tbody>
      </table>
      <div>
        <button onClick={() => setShowTable(!showTable)}>show table</button>
      </div>
      {showTable && (
        <div style={{ maxHeight: "60vh", overflowY: "auto" }}>
          <table>
            <tbody>
              {sortedData
                .filter(({ ct }) => ct >= lvlCt)
                .map((item, index) => (
                  <tr key={index}>
                    <td>{item.multiplier}</td>
                    <td>{item.roundId}</td>
                    <td>{item.ct}</td>
                    <td>{new Date(item.dt).toLocaleString()}</td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

function PeriodView({ data }) {
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
          <span className="foldable-label">period view</span>
        </button>
      </div>

      {open && <PeriodViewMain data={data} />}
    </div>
  );
}

export default PeriodView;
