import React, { useCallback, useMemo, useState } from "react";
import { floatToFixed } from "./Summary";
import FoldableView from "./FoldableView";

const ManualBet = ({ data }) => {
  const [bet, setBet] = useState(1);

  const win = useMemo(
    () => data.filter((item) => item.multiplier >= bet).length,
    [bet, data]
  );

  const handleBetChange = useCallback(
    ({ target: { value } }) => setBet(value),
    []
  );

  return (
    <FoldableView title={"manual bet"}>
      <table>
        <tbody>
          <tr>
            <td style={{ padding: 0 }}>
              <input
                name="bet"
                type="number"
                step={0.1}
                min={1}
                max={50}
                value={bet}
                onChange={handleBetChange}
              />
            </td>
            <td></td>
            <td>win</td>
            <td>{win}</td>
            <td>earn</td>
            <td>{floatToFixed(win * (bet - 1))}</td>
          </tr>
          <tr>
            <td>Total</td>
            <td>{data.length}</td>
            <td>lose</td>
            <td>{data.length - win}</td>
            <td>profit</td>
            <td>{floatToFixed(win * bet - data.length)}</td>
          </tr>
        </tbody>
      </table>
    </FoldableView>
  );
};

export default ManualBet;
