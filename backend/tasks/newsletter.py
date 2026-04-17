from apscheduler.schedulers.background import BackgroundScheduler
from datetime import datetime
import pytz

from services.market_data import get_stock_data, get_stock_news
from services.insights import generate_insights
import redis
import os

# Initialize Redis client. Assumes Redis is accessible via REDIS_URL or default localhost
REDIS_URL = os.getenv("REDIS_URL", "redis://localhost:6379/0")
redis_client = redis.from_url(REDIS_URL, decode_responses=True)

# Example Hardcoded Watchlist (in a real app, fetch from PostgreSQL)
USER_WATCHLIST = ["RELIANCE.NS", "TCS.NS", "HDFCBANK.NS"]

import json

def generate_daily_newsletter():
    """
    Job that runs daily to compile insights for the user's watchlist.
    Stores structured JSON in Redis.
    """
    print(f"\n--- Starting Daily Newsletter Generation at {datetime.now()} ---")
    stocks_data = []

    for ticker in USER_WATCHLIST:
        print(f"Processing data for {ticker}...")
        try:
            fundamentals = get_stock_data(ticker)
            news = get_stock_news(ticker)
            insights = generate_insights(fundamentals, news)

            stocks_data.append({
                "ticker": ticker,
                "name": fundamentals.get("company_name", ticker),
                "price": fundamentals.get("current_price"),
                "pe": fundamentals.get("pe_ratio"),
                "short_term": insights['short_term'],
                "long_term": insights['long_term'],
                "news": news[:2],
                "status": "success"
            })
        except Exception as e:
            stocks_data.append({
                "ticker": ticker,
                "status": "error",
                "error": str(e)
            })

    payload = {
        "generated_at": datetime.now().isoformat(),
        "stocks": stocks_data
    }

    print("Newsletter Compiled Successfully! Saving JSON to Redis...")
    redis_client.set("latest_newsletter_json", json.dumps(payload))
    
    # Also keep the legacy string for backward compatibility or logs
    legacy_content = f"Morning Market Updates & Insights ({datetime.now().date()})\n" + "="*40 + "\n"
    for s in stocks_data:
        if s["status"] == "success":
            legacy_content += f"{s['name']} ({s['ticker']}): ₹{s['price']}\n"
        else:
            legacy_content += f"{s['ticker']}: Error {s['error']}\n"
    redis_client.set("latest_newsletter", legacy_content)
    
    print("Newsletter Saved! Count:", len(stocks_data))
    print("--- Newsletter Generation Complete ---\n")

def start_scheduler():
    """
    Initializes and starts the APScheduler.
    """
    scheduler = BackgroundScheduler()
    # Schedule to run every morning at 8:00 AM IST
    ist_tz = pytz.timezone('Asia/Kolkata')

    # For demonstration/testing purposes, we'll also schedule it to run in 5 seconds
    # so we can see it work when we run the app.
    # In production, remove the interval and keep only the cron.
    scheduler.add_job(generate_daily_newsletter, 'cron', hour=8, minute=0, timezone=ist_tz)

    scheduler.start()
    return scheduler
