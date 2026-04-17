import os
import requests
import yfinance as yf
from bs4 import BeautifulSoup
from typing import Dict, Any, List
import time

# Create a robust session for all requests
session = requests.Session()
session.headers.update({
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/119.0.0.0 Safari/537.36',
    'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8',
    'Accept-Language': 'en-US,en;q=0.9',
})

def get_stock_data(ticker_symbol: str) -> Dict[str, Any]:
    """
    Fetches real-time market data and fundamentals.
    Uses yfinance as primary, falls back to raw chart API if blocked.
    """
    # Initialize yf Ticker with our custom session
    stock = yf.Ticker(ticker_symbol, session=session)
    
    try:
        # Attempt to get full info
        info = stock.info
        if not info or 'regularMarketPrice' not in info and 'currentPrice' not in info:
            raise Exception("Empty or invalid info received from yfinance")
            
        return {
            "symbol": ticker_symbol,
            "company_name": info.get("longName") or info.get("shortName") or ticker_symbol,
            "current_price": info.get("currentPrice") or info.get("regularMarketPrice") or info.get("previousClose") or 0.0,
            "market_cap": info.get("marketCap", 0),
            "pe_ratio": info.get("trailingPE"),
            "forward_pe": info.get("forwardPE"),
            "debt_to_equity": info.get("debtToEquity"),
            "return_on_equity": info.get("returnOnEquity"),
            "eps": info.get("trailingEps"),
            "52_week_high": info.get("fiftyTwoWeekHigh"),
            "52_week_low": info.get("fiftyTwoWeekLow")
        }
    except Exception as e:
        print(f"yfinance failed for {ticker_symbol}, trying robust fallback: {e}")
        # Robust fallback: Use the chart endpoint which is often more accessible
        return get_stock_data_fallback(ticker_symbol)

def get_stock_data_fallback(ticker_symbol: str) -> Dict[str, Any]:
    """Fallback using the /v8/finance/chart endpoint (no crumb required)"""
    try:
        url = f"https://query2.finance.yahoo.com/v8/finance/chart/{ticker_symbol}?interval=1d&range=1d"
        response = session.get(url, timeout=10)
        response.raise_for_status()
        data = response.json()
        
        result = data['chart']['result'][0]
        meta = result['meta']
        
        return {
            "symbol": ticker_symbol,
            "company_name": meta.get("longName") or meta.get("shortName") or ticker_symbol,
            "current_price": meta.get("regularMarketPrice") or 0.0,
            "market_cap": meta.get("marketCap") or 0, # Note: Market cap might be missing in some v8 results
            "pe_ratio": None, # Complex to get from chart meta
            "forward_pe": None,
            "debt_to_equity": None,
            "return_on_equity": None,
            "eps": None,
            "52_week_high": meta.get("fiftyTwoWeekHigh"),
            "52_week_low": meta.get("fiftyTwoWeekLow")
        }
    except Exception as e:
        print(f"Fallback also failed for {ticker_symbol}: {e}")
        raise Exception(f"Real-time data for {ticker_symbol} is currently unavailable. Yahoo Finance is rate limiting requests.")

def get_stock_news(ticker_symbol: str) -> List[Dict[str, Any]]:
    """Fetches news via yfinance or RSS fallback."""
    try:
        stock = yf.Ticker(ticker_symbol, session=session)
        news = stock.news
        if news:
            return [{
                "title": n.get("title"),
                "publisher": n.get("publisher"),
                "link": n.get("link"),
                "published_at": n.get("providerPublishTime")
            } for n in news[:5]]
    except Exception as e:
        print(f"yfinance news failed for {ticker_symbol}, trying RSS: {e}")
        
    return get_stock_news_rss(ticker_symbol)

def get_stock_news_rss(ticker_symbol: str) -> List[Dict[str, Any]]:
    """Fallback: Fetch news from Yahoo RSS feed."""
    try:
        url = f"https://feeds.finance.yahoo.com/rss/2.0/headline?s={ticker_symbol}"
        response = session.get(url, timeout=10)
        response.raise_for_status()
        
        soup = BeautifulSoup(response.content, 'xml')
        items = soup.find_all('item')
        
        news_list = []
        for item in items[:5]:
            news_list.append({
                "title": item.title.text if item.title else "News Link",
                "publisher": "Yahoo Finance (RSS)",
                "link": item.link.text if item.link else "#",
                "published_at": int(time.time()) # RSS pubDate parsing is messy, using current time as approximation
            })
        return news_list
    except Exception as e:
        print(f"RSS news failed for {ticker_symbol}: {e}")
        return []
