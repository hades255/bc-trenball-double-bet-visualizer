import { useEffect, useState } from "react";
import { floatToFixed } from "./Summary";

const SDetails = ({ data }) => {
  const [ng, setNg] = useState([0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]);
  const [nr, setNr] = useState([0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]);

  useEffect(() => {
    let _ng = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
    let _nr = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
    data.forEach((row) => {
      row.forEach((item, index) => {
        if (item.color !== "red" || index !== 0) return;
        for (let i = 0; i <= 10; i++) {
          if (item.multiplier <= 1 + i * 0.1) {
            if (index + 1 === row.length) _ng[i]++;
            else _nr[i]++;
          }
        }
      });
    });
    setNg(_ng);
    setNr(_nr);
  }, [data]);

  return (
    <>
      <div className="responsible">
        <table>
          <thead>
            <tr>
              <td>next</td>
              {[...Array(11)].map((_, index) => (
                <th key={index}>{floatToFixed(1 + index * 0.1, 1)}</th>
              ))}
              <td></td>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>green</td>
              {ng.map((item, index) => (
                <td key={index}>{item}</td>
              ))}
              <td>{ng.reduce((a, b) => a + b, 0)}</td>
            </tr>
            <tr>
              <td>red</td>
              {nr.map((item, index) => (
                <td key={index}>{item}</td>
              ))}
              <td>{nr.reduce((a, b) => a + b, 0)}</td>
            </tr>
            <tr>
              <td>next</td>
              {[...Array(11)].map((_, index) => (
                <td key={index}>{nr[index] - ng[index]}</td>
              ))}
              <td></td>
            </tr>
          </tbody>
        </table>
      </div>
    </>
  );
};

export default SDetails;
