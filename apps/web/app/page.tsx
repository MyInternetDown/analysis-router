"use client";

import { useState } from "react";

type StockRow = {
  date: string;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
};

type StockHistoryResponse = {
  ticker: string;
  period: string;
  rows: StockRow[];
  message?: string;
};

function formatNumber(value: number) {
  return value.toLocaleString(undefined, {
    maximumFractionDigits: 2,
  });
}

function formatDate(value: string) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleDateString();
}

export default function Home() {
  const [ticker, setTicker] = useState("MSFT");
  const [data, setData] = useState<StockHistoryResponse | null>(null);
  const [error, setError] = useState<string>("");
  const [loading, setLoading] = useState(false);

  const fetchStockHistory = async () => {
    setLoading(true);
    setError("");

    try {
      const response = await fetch(
        `http://127.0.0.1:8000/stocks/history?ticker=${ticker}&period=1mo`
      );

      if (!response.ok) {
        throw new Error("Request failed");
      }

      const result: StockHistoryResponse = await response.json();
      setData(result);
    } catch {
      setError("Failed to fetch stock history");
      setData(null);
    } finally {
      setLoading(false);
    }
  };

  const latestRow = data?.rows?.length ? data.rows[data.rows.length - 1] : null;

  return (
    <main className="min-h-screen bg-black text-white p-8">
      <h1 className="text-2xl font-bold mb-4">Stock Data Test</h1>

      <div className="flex gap-3 mb-6">
        <input
          value={ticker}
          onChange={(e) => setTicker(e.target.value.toUpperCase())}
          className="border border-gray-500 bg-zinc-900 text-white rounded px-3 py-2"
          placeholder="Enter ticker"
        />
        <button
          onClick={fetchStockHistory}
          className="px-4 py-2 border border-gray-500 bg-zinc-800 text-white rounded hover:bg-zinc-700"
        >
          {loading ? "Loading..." : "Fetch Stock History"}
        </button>
      </div>

      {error && (
        <div className="mb-4 rounded border border-red-700 bg-red-950 px-4 py-3 text-red-200">
          {error}
        </div>
      )}

      {data && (
        <>
          <div className="mb-6 rounded border border-gray-700 bg-zinc-900 p-4">
            <h2 className="text-xl font-semibold mb-2">
              {data.ticker} — {data.period}
            </h2>

            {data.message && (
              <p className="text-yellow-300 mb-2">{data.message}</p>
            )}

            <div className="text-sm text-gray-300 space-y-1">
              <p>Rows returned: {data.rows.length}</p>
              {latestRow && (
                <>
                  <p>Latest date: {formatDate(latestRow.date)}</p>
                  <p>Latest close: {formatNumber(latestRow.close)}</p>
                </>
              )}
            </div>
          </div>

          <div className="overflow-auto rounded border border-gray-700 bg-zinc-900">
            <table className="min-w-full text-sm">
              <thead className="bg-zinc-800 text-gray-200">
                <tr>
                  <th className="px-4 py-3 text-left">Date</th>
                  <th className="px-4 py-3 text-right">Open</th>
                  <th className="px-4 py-3 text-right">High</th>
                  <th className="px-4 py-3 text-right">Low</th>
                  <th className="px-4 py-3 text-right">Close</th>
                  <th className="px-4 py-3 text-right">Volume</th>
                </tr>
              </thead>
              <tbody>
                {data.rows.map((row, index) => (
                  <tr
                    key={`${row.date}-${index}`}
                    className="border-t border-gray-800"
                  >
                    <td className="px-4 py-3">{formatDate(row.date)}</td>
                    <td className="px-4 py-3 text-right">
                      {formatNumber(row.open)}
                    </td>
                    <td className="px-4 py-3 text-right">
                      {formatNumber(row.high)}
                    </td>
                    <td className="px-4 py-3 text-right">
                      {formatNumber(row.low)}
                    </td>
                    <td className="px-4 py-3 text-right">
                      {formatNumber(row.close)}
                    </td>
                    <td className="px-4 py-3 text-right">
                      {formatNumber(row.volume)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </main>
  );
}