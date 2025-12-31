from sqlalchemy import Column, Integer, String, ForeignKey, Boolean
from sqlalchemy.orm import relationship
from database import Base

class Stock(Base):
    __tablename__ = "stocks"

    id = Column(Integer, primary_key=True, index=True)
    code = Column(String, unique=True, index=True)
    name = Column(String)
    price = Column(String) # Storing as string for simplicity like "10,000"
    golden_cross_date = Column(String)
    is_favorite = Column(Boolean, default=False)

    news = relationship("News", back_populates="stock")

class News(Base):
    __tablename__ = "news"

    id = Column(Integer, primary_key=True, index=True)
    stock_id = Column(Integer, ForeignKey("stocks.id"))
    title = Column(String)
    url = Column(String)
    published_at = Column(String)
    summary = Column(String, nullable=True)

    stock = relationship("Stock", back_populates="news")
