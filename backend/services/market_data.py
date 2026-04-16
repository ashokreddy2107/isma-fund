import os
import yfinance as yf
from typing import Dict, Any

def get_stock_data(ticker_symbol: str) -> Dict[str, Any]:
    """
    Fetches real-time/near real-time market data and fundamentals using yfinance.
    For NSE stocks, append '.NS'. For BSE, append '.BO'.
    Example: 'RELIANCE.NS'
    """
    yf.set_tz_cache_location(f"/tmp/yf_cache_{os.getpid()}")

    try:
        stock = yf.Ticker(ticker_symbol)
        info = stock.info

        # Extract key fundamentals
        fundamentals = {
            "symbol": ticker_symbol,
            "company_name": info.get("longName", "N/A"),
            "current_price": info.get("currentPrice", 0.0),
            "market_cap": info.get("marketCap", 0),
            "pe_ratio": info.get("trailingPE", None),
            "forward_pe": info.get("forwardPE", None),
            "debt_to_equity": info.get("debtToEquity", None),
            "return_on_equity": info.get("returnOnEquity", None),
            "eps": info.get("trailingEps", None),
            "52_week_high": info.get("fiftyTwoWeekHigh", None),
            "52_week_low": info.get("fiftyTwoWeekLow", None)
        }

        return fundamentals
    except Exception as e:
        print(f"Error fetching data for {ticker_symbol}: {e}")
        # fallback mock data due to rate limiting from Yahoo Finance
        return {
            "symbol": ticker_symbol,
            "company_name": f"{ticker_symbol} Mock Company",
            "current_price": 100.0,
            "market_cap": 1000000000,
            "pe_ratio": 20.0,
            "forward_pe": 18.0,
            "debt_to_equity": 0.5,
            "return_on_equity": 0.15,
            "eps": 5.0,
            "52_week_high": 120.0,
            "52_week_low": 80.0
        }

def get_stock_news(ticker_symbol: str) -> list:
    """
    Fetches recent news for a given ticker using yfinance.
    Note: yfinance news can sometimes be limited, but serves as a good starter.
    """
    yf.set_tz_cache_location(f"/tmp/yf_cache_{os.getpid()}")

    try:
        stock = yf.Ticker(ticker_symbol)
        news = stock.news

        formatted_news = []
        for article in news[:5]: # Get top 5 news items
            formatted_news.append({
                "title": article.get("title"),
                "publisher": article.get("publisher"),
                "link": article.get("link"),
                "published_at": article.get("providerPublishTime")
            })
        return formatted_news
    except Exception as e:
        print(f"Error fetching news for {ticker_symbol}: {e}")
        # fallback mock news
        return [{
            "title": f"Mock News about {ticker_symbol}",
            "publisher": "Mock Publisher",
            "link": "https://example.com",
            "published_at": 1672531200
        }]
