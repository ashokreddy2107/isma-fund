from fastapi import FastAPI
import uvicorn
from contextlib import asynccontextmanager

from tasks.newsletter import start_scheduler

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup logic
    print("Starting background scheduler...")
    scheduler = start_scheduler()
    yield
    # Shutdown logic
    print("Shutting down background scheduler...")
    if scheduler:
        scheduler.shutdown()

app = FastAPI(
    title="Fundamental Stock Screener API",
    description="API for Indian Markets Stock Data, Insights, and Newsletters",
    version="1.0.0",
    lifespan=lifespan
)

@app.get("/")
def read_root():
    return {"message": "Welcome to the Fundamental Stock Screener API"}

# Include routers here in the future
# from routers import market
# app.include_router(market.router)

if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)