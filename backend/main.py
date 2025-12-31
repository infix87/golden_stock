from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from database import engine, Base, SessionLocal
from models import Stock, News
from services.stock_collector import fetch_golden_cross_stocks
from services.news_scraper import fetch_news
from apscheduler.schedulers.background import BackgroundScheduler
from sqlalchemy.orm import Session
from datetime import datetime
import threading

# Create DB tables
Base.metadata.create_all(bind=engine)

app = FastAPI()

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # Allow all for development/debugging
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Dependency
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# Scheduler
scheduler = BackgroundScheduler()

def update_job():
    print(f"[{datetime.now()}] Starting scheduled update...")
    db = SessionLocal()
    try:
        stocks_data = fetch_golden_cross_stocks()
        print(f"[{datetime.now()}] Fetched {len(stocks_data)} stocks from scraper.")
        
        for item in stocks_data:
            existing = db.query(Stock).filter(Stock.code == item['code']).first()
            if not existing:
                print(f"Adding new stock: {item['name']}")
                new_stock = Stock(
                    code=item['code'],
                    name=item['name'],
                    price=item['price'],
                    golden_cross_date=datetime.now().date().isoformat()
                )
                db.add(new_stock)
            else:
                print(f"Updating stock: {item['name']}")
                existing.price = item['price']
                existing.golden_cross_date = datetime.now().date().isoformat() # Update date
        db.commit()
        print(f"[{datetime.now()}] Database update complete.")
    except Exception as e:
        print(f"Update job failed: {e}")
    finally:
        db.close()

scheduler.add_job(update_job, 'interval', hours=1)
scheduler.start()

@app.get("/api/stocks")
def get_stocks():
    db = SessionLocal()
    stocks = db.query(Stock).all()
    db.close()
    return stocks

@app.get("/api/stocks/{code}")
def get_stock_detail(code: str):
    db = SessionLocal()
    stock = db.query(Stock).filter(Stock.code == code).first()
    if not stock:
        db.close()
        raise HTTPException(status_code=404, detail="Stock not found")
    
    # Lazy load news if empty or old?
    # For prototype, fetch on demand if empty
    news_items = db.query(News).filter(News.stock_id == stock.id).all()
    if not news_items:
        # Fetch news
        scraped_news = fetch_news(stock.code)
        for n in scraped_news:
            new_news = News(
                stock_id=stock.id,
                title=n['title'],
                url=n['url'],
                published_at=n['published_at'],
                summary=n['summary']
            )
            db.add(new_news)
        db.commit()
        news_items = db.query(News).filter(News.stock_id == stock.id).all()

    db.close()
    return {"stock": stock, "news": news_items}

@app.post("/api/refresh")
def refresh_data():
    # Run synchronously for debugging/immediate feedback
    update_job()
    return {"status": "Update completed"}

@app.post("/api/stocks/{code}/favorite")
def toggle_favorite(code: str):
    db = SessionLocal()
    stock = db.query(Stock).filter(Stock.code == code).first()
    if not stock:
        db.close()
        raise HTTPException(status_code=404, detail="Stock not found")
    
    stock.is_favorite = not stock.is_favorite
    db.commit()
    is_fav = stock.is_favorite
    db.close()
    return {"code": code, "is_favorite": is_fav}
