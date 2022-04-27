import { useState } from "react";

const fmt = (n) => {
  const strN = String(n);
  return strN.length < 4 ? strN : `${strN.slice(0, -3)},${strN.slice(-3)}`;
};

const PAGE_LENGTH = 100;

export const DataTable = ({ data, summary }) => {
  const [page, setPage] = useState(0);
  const headers = data[0] ? Object.keys(data[0]).slice(1) : [];

  const pageData = data;

  return (
    <div>
      <div>
        <button onClick={() => setPage(Math.max(0, page - 1))} disabled>
          prev
        </button>
        <span>page {page}</span>
        <button
          disabled
          onClick={() =>
            setPage(
              Math.min(page + 1, Math.ceil(data.length / PAGE_LENGTH) - 1)
            )
          }
        >
          next
        </button>
      </div>
      <table>
        <thead>
          <tr>
            {headers.map((th) => (
              <th key={th}>{th}</th>
            ))}
          </tr>
          <tr>
            {headers.map((th) => (
              <th key={th}>{fmt(summary[th])}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {pageData.map((tr) => (
            <tr key={`tr-${tr.id}`}>
              {headers.map((td) => (
                <td
                  key={td}
                  style={{ textAlign: td === "stationName" ? "left" : "right" }}
                >
                  {tr[td]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
