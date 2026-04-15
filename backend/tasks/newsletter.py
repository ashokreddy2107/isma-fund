from apscheduler.schedulers.background import BackgroundScheduler
from datetime import datetime
import pytz

from services.market_data import get_stock_data, get_stock_news
from services.insights import generate_insights

# Example Hardcoded Watchlist (in a real app, fetch from PostgreSQL)
USER_WATCHLIST = ["RELIANCE.NS", "TCS.NS", "HDFCBANK.NS"]

def generate_daily_newsletter():
    """
    Job that runs daily to compile insights for the user's watchlist and
    (mock) sends an email.
    """
    print(f"\n--- Starting Daily Newsletter Generation at {datetime.now()} ---")
    newsletter_content = "Morning Market Updates & Insights\n"
    newsletter_content += "="*40 + "\n\n"

    for ticker in USER_WATCHLIST:
        print(f"Processing data for {ticker}...")
        fundamentals = get_stock_data(ticker)
        news = get_stock_news(ticker)
        insights = generate_insights(fundamentals, news)

        newsletter_content += f"Stock: {fundamentals.get('company_name', ticker)} ({ticker})\n"
        newsletter_content += f"Price: {fundamentals.get('current_price')} | P/E: {fundamentals.get('pe_ratio')}\n"
        newsletter_content += f"Short-Term: {insights['short_term']}\n"
        newsletter_content += f"Long-Term: {insights['long_term']}\n"
        newsletter_content += "-"*40 + "\n"

    print("Newsletter Compiled Successfully! Sending email...")
    # Mock sending email
    # e.g., send_email(to="user@example.com", subject="Your Daily Insights", body=newsletter_content)
    print("Email Sent! Preview of content:")
    print(newsletter_content)
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
