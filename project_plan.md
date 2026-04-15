# Fundamental Stock Screener and Insight Platform for Indian Markets

## 1. Tech Stack Recommendations

To build a scalable, real-time, and modern financial platform, the following stack is recommended:

### Frontend
- **Framework:** **Next.js (React)**
  - Why: Great for SEO, Server-Side Rendering (SSR) for fast initial loads, and overall modern developer experience. Perfect for dashboards and real-time data viewing.
- **Styling:** **Tailwind CSS**
  - Why: Rapid UI development and easy to maintain.
- **State Management:** **Zustand** or **Redux Toolkit**
  - Why: Simple yet powerful state management for handling complex market data on the client side.

### Backend
- **Framework:** **Python / FastAPI**
  - Why: FastAPI is extremely fast, asynchronous, and natively supports Python which is the leading language for data science, AI, and financial analysis.
- **Database:** **PostgreSQL**
  - Why: Reliable, ACID-compliant relational database, excellent for storing user data, watchlists, and structured fundamental data. (Consider TimescaleDB extension if dealing with heavy time-series tick data).
- **Caching & Message Broker:** **Redis**
  - Why: Essential for caching frequent queries (like stock prices/news) to avoid lagging the frontend and API rate limits. Can also be used as a message broker for background tasks.
- **Background Jobs:** **Celery** or **APScheduler**
  - Why: To handle cron-jobs, automated newsletters, and heavy AI processing asynchronously without blocking the main API threads.

### Third-Party APIs
- **Indian Market Data (NSE/BSE) & Fundamentals:**
  - **Kite Connect API (Zerodha):** Best for real-time market data if you have an account.
  - **Screener.in (Web Scraping/Unofficial APIs) or Trendlyne API:** Excellent for Indian fundamental data.
  - **Yahoo Finance (`yfinance` python library):** Great free starter for historical data and basics (use `.NS` for NSE and `.BO` for BSE).
- **Financial News:**
  - **NewsAPI** (with queries filtered by stock/India).
  - **Google News RSS Feeds** (Free and specific).
- **AI Insights Engine:**
  - **OpenAI API (GPT-4/GPT-3.5) or Anthropic Claude:** For analyzing news, earnings reports, and generating short/long-term insights.

---

## 2. System Architecture Layout

### Handling Scheduled Data Fetching and Newsletters without Lagging the Frontend

1. **Client-Server Separation:**
   - The Next.js frontend only communicates with the FastAPI backend via REST/GraphQL endpoints. It does *not* do heavy lifting.
2. **Asynchronous API (FastAPI):**
   - User requests (e.g., "load my dashboard") hit FastAPI endpoints. If data is fresh, it is served from **Redis cache** instantly. If stale, FastAPI fetches it, updates Redis, and returns it.
3. **Background Workers (Celery/APScheduler):**
   - Heavy tasks (like scraping 50 stocks, sending 1000 emails, or pinging the OpenAI API for insights) are offloaded to background workers.
   - **Newsletter Generation Flow:**
     - A cron job runs at 6:00 AM IST.
     - The worker fetches user watchlists from PostgreSQL.
     - For each stock, it gathers the latest fundamentals and aggregated news from the database/APIs.
     - It calls the AI Insight Engine (OpenAI API) to generate the summaries.
     - It compiles the email and sends it via an SMTP service (e.g., SendGrid, AWS SES).
4. **Data Aggregation Pipeline:**
   - A separate scheduled task runs periodically (e.g., every 15 mins during market hours) to fetch the latest news and price updates for all stocks present in *any* user's watchlist, storing them in PostgreSQL/Redis.

This architecture ensures the user-facing API remains completely responsive while the heavy data processing and AI work happens behind the scenes.
