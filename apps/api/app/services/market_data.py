import yfinance as yf


def get_stock_history(ticker: str, period: str = "1mo") -> dict:
    df = yf.Ticker(ticker.upper()).history(period=period)

    if df.empty:
        return {
            "ticker": ticker.upper(),
            "period": period,
            "rows": [],
            "message": "No data found",
        }

    rows = []
    for _, row in df.reset_index().iterrows():
        rows.append(
            {
                "date": str(row["Date"]),
                "open": float(row["Open"]),
                "high": float(row["High"]),
                "low": float(row["Low"]),
                "close": float(row["Close"]),
                "volume": float(row["Volume"]),
            }
        )

    return {
        "ticker": ticker.upper(),
        "period": period,
        "rows": rows,
    }