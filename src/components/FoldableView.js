import React, { useCallback, useEffect, useState } from "react";
import "./FoldableView.css";

export default function FoldableView({ init = false, title, children }) {
  const [open, setOpen] = useState(false);

  const handleSetOpen = useCallback(() => {
    setOpen(!open);
  }, [open]);

  useEffect(() => {
    setOpen(init);
  }, [init]);

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
          <span className="foldable-label">{title}</span>
        </button>
      </div>

      {open && children}
    </div>
  );
}
