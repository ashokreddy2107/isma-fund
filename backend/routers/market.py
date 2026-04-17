from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import Dict, Any, List

from services.market_data import get_stock_data, get_stock_news
from services.insights import generate_insights

router = APIRouter(
    prefix="/api/market",
    tags=["market"]
)

class MarketDataResponse(BaseModel):
    fundamentals: Dict[str, Any]
    news: List[Dict[str, Any]]
    insights: Dict[str, str]

@router.get("/{ticker}", response_model=MarketDataResponse)
async def get_market_data(ticker: str):
    try:
        fundamentals = get_stock_data(ticker)
        if not fundamentals:
            raise HTTPException(status_code=404, detail="Stock not found or data unavailable")

        news = get_stock_news(ticker)
        insights = generate_insights(fundamentals, news)

        return MarketDataResponse(
            fundamentals=fundamentals,
            news=news,
            insights=insights
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

from tasks.newsletter import generate_daily_newsletter, redis_client

@router.post("/newsletter/trigger")
async def trigger_newsletter():
    try:
        generate_daily_newsletter()
        return {"message": "Newsletter generated, sent, and cached successfully"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/newsletter/latest")
async def get_latest_newsletter():
    try:
        # Prefer JSON structured data
        json_content = redis_client.get("latest_newsletter_json")
        if json_content:
            import json
            return json.loads(json_content)
            
        content = redis_client.get("latest_newsletter")
        if not content:
            return {"content": "No newsletter has been generated yet today.", "stocks": []}
        return {"content": content, "stocks": []}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
