import React from "react";
import { colorMap } from "../constants";

export const RenderItems = ({ structuredData }) => {
  return (
    <div
      style={{
        border: "1px solid #dddddd4d",
        padding: 10,
      }}
    >
      <div
        style={{
          display: "flex",
          gap: "6px",
          alignItems: "start",
          overflowX: "auto",
          padding: "3px 10px",
          backgroundImage: `
            repeating-linear-gradient(
                to bottom,
                #2f2f2f,
                #2f2f2f 1px,
                transparent 1px,
                transparent 26px,
                #2f2f2f 26px,
                #2f2f2f 27px,
                #2f2f2f 27px,
                #2f2f2f 52px
            )
          `,
          backgroundSize: "100% 52px",
        }}
      >
        {structuredData.map((group, colIdx) => (
          <div
            key={colIdx}
            style={{
              display: "grid",
              gridAutoRows: "20px",
              rowGap: "6px",
              justifyItems: "center",
            }}
          >
            {group.map((item) => (
              <RenderItem key={item.roundId} item={item} />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};

const RenderItem = ({ item }) => {
  const title = item.betColor
    ? `\nBet Color: ${item.betColor}\nBet Amount: ${item.betAmount}\n${
        item.won ? "Won" : "Lose"
      } Profit: ${item.profit}`
    : ``;
  const dt = item.dt ? `\n${new Date(Number(item.dt)).toLocaleString()}` : ``;

  return (
    <div
      title={`Round ${item.roundId}\nColor: ${item.color}\nMultiplier: ${item.multiplier}${title}${dt}`}
      style={{
        width: 16,
        height: 16,
        borderRadius: "50%",
        border: `3px solid ${
          item.betColor ? (item.won ? "white" : "black") : "#0b1020a9"
        }`,
        outline: `1px solid ${item.betColor ? "white" : "gray"}`,
        backgroundColor:
          colorMap[item.color === "moon" ? "moon" : item.color] || "lightblue",
      }}
    />
  );
};
