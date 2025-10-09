import React from "react";
import { colorMap } from "../constants";

export const RenderItems = ({ structuredData }) => {
  return (
    <div
      style={{
        border: "1px solid #ddd",
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
                darkgray,
                darkgray 1px,
                transparent 1px,
                transparent 26px,
                darkgray 26px,
                darkgray 27px,
                lightgray 27px,
                lightgray 52px
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
  return (
    <div
      title={`Round ${item.roundId}\nColor: ${item.color}\nMultiplier: ${item.multiplier}`}
      style={{
        width: 16,
        height: 16,
        borderRadius: "50%",
        border: `2px solid ${item.betColor ? "pink" : "white"}`,
        outline: `2px solid ${
          item.betColor
            ? colorMap[item.betColor === "moon" ? "moon" : item.betColor]
            : "lightblue"
        }`,
        backgroundColor:
          colorMap[item.color === "moon" ? "moon" : item.color] || "lightblue",
      }}
    />
  );
};
