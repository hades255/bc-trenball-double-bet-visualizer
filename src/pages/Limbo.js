import React, { useCallback, useEffect, useState } from "react";
import { Summary } from "../components/limbo/Summary";

const Limbo = () => {
  const [data, setData] = useState([]);
  const [status, setStatus] = useState("No files loaded.");
  const [structuredData, setStructuredData] = useState([]);
  const [multi, setMulti] = useState(2);

  const handleInput = async (e) => {
    const files = Array.from(e.target.files);
    if (!files.length) return;

    setStatus("Reading files...");
    const roundMap = new Map();

    for (const file of files) {
      try {
        const text = await file.text();
        const json = JSON.parse(text);
        json.forEach((item) => {
          if (item && item.roundId && !roundMap.has(item.roundId)) {
            roundMap.set(item.roundId, item);
          }
        });
      } catch (err) {
        console.warn("Failed to parse", file.name, err);
      }
    }

    const sorted = Array.from(roundMap.values())
      .sort((a, b) => parseInt(a.roundId) - parseInt(b.roundId))
      .map((item) => {
        item.dt = item.dt || 1760022000000;
        if (item.multiplier && isNaN(item.multiplier)) {
          const match = item.multiplier.match(/-?[\d,]*\.?\d+/);
          if (match) {
            const num = parseFloat(match[0]);
            item.multiplier = num;
          }
        }
        return item;
      });

    setData(sorted);
    setStatus(`${sorted.length} rounds loaded.`);
  };

  const exportJSON = () => {
    const blob = new Blob([JSON.stringify(data, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `merged_trenball_${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  useEffect(() => {
    let lastColor = "green";
    let lastStick = 0;
    let items = [];
    data.forEach((item) => {
      if (item.multiplier && !isNaN(item.multiplier)) {
        const color = item.multiplier >= multi ? "green" : "red";
        if (lastColor === color) {
          lastStick++;
        } else {
          lastStick = 1;
        }
        lastColor = color;
        items.push({ ...item, color, stick: lastStick });
      }
    });

    const rows = [];
    let currentRow = [];

    for (let i = 0; i < items.length; i++) {
      const item = items[i];
      const color = item.color === "moon" ? "green" : item.color;

      if (lastColor !== null && color === lastColor) {
        currentRow.push(item);
      } else {
        if (currentRow.length) rows.push(currentRow);
        currentRow = [item];
        lastColor = color;
      }
    }
    if (currentRow.length) rows.push(currentRow);
    setStructuredData(rows);
  }, [data, multi]);

  const handleMultiChange = useCallback(({ target: { value } }) => {
    setMulti(value);
  }, []);

  return (
    <>
      {/* <h2>Limbo Visualizer</h2> */}
      <p>Status: {status}</p>
      <div>
        <input
          type="file"
          accept="application/json"
          multiple
          onChange={handleInput}
          style={{ marginBottom: 16 }}
        />
        <button
          onClick={exportJSON}
          disabled={!data.length}
          style={{ marginBottom: 20 }}
        >
          Export Final JSON
        </button>
      </div>
      <div>
        <input
          name="multi"
          value={multi}
          onChange={handleMultiChange}
          type="number"
          min={1}
          max={100}
          step={0.01}
        />
      </div>
      {structuredData && (
        <Summary structuredData={structuredData} rawData={data} multi={multi} />
      )}
    </>
  );
};

export default Limbo;
