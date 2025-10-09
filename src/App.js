import React, { useEffect, useState } from "react";
import { RenderItems } from "./components/RenderItems";
import { Summary } from "./components/Summary";
import Container from "./components/Container";

const App = () => {
  const [data, setData] = useState([]);
  const [status, setStatus] = useState("No files loaded.");
  const [structuredData, setStructuredData] = useState([]);

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

    const sorted = Array.from(roundMap.values()).sort(
      (a, b) => parseInt(a.roundId) - parseInt(b.roundId)
    );
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
    const rows = [];
    let currentRow = [];
    let lastColor = null;
    let lastRoundId = 0;

    for (let i = 0; i < data.length; i++) {
      const item = data[i];
      const color = item.color === "moon" ? "green" : item.color;
      const roundId = item.roundId;

      if (
        lastColor !== null &&
        color === lastColor &&
        Number(lastRoundId) + 1 === Number(roundId)
      ) {
        currentRow.push(item);
      } else {
        if (currentRow.length) rows.push(currentRow);
        currentRow = [item];
        lastColor = color;
      }
      lastRoundId = roundId;
    }
    if (currentRow.length) rows.push(currentRow);
    setStructuredData(rows);
  }, [data]);

  return (
    <Container>
      <h2>BC.Game Trenball Visualizer</h2>
      <p>Status: {status}</p>
      <input
        type="file"
        accept="application/json"
        multiple
        onChange={handleInput}
        style={{ marginBottom: 16 }}
      />
      <br />
      <button
        onClick={exportJSON}
        disabled={!data.length}
        style={{ marginBottom: 20 }}
      >
        Export Final JSON
      </button>
      {structuredData.length > 0 ? (
        <RenderItems structuredData={structuredData} />
      ) : (
        <p>No data to visualize yet.</p>
      )}
      {structuredData && <Summary structuredData={structuredData} />}
    </Container>
  );
};

export default App;
