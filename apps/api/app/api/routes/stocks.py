from fastapi import APIRouter, Query
from app.services.market_data import get_stock_history

router = APIRouter(prefix="/stocks", tags=["stocks"])


@router.get("/history")
def stock_history(
    ticker: str = Query(..., description="Stock ticker, e.g. AAPL"),
    period: str = Query("1mo", description="History period, e.g. 1mo, 6mo, 1y"),
):
    return get_stock_history(ticker=ticker, period=period)