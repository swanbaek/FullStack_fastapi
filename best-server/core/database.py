# database.py
from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker, Session
from dotenv import load_dotenv
import os
import logging

load_dotenv()
DB_URL=os.getenv("DB_URL")

logger=logging.getLogger(__name__)
logger.info("DB_URL: %s", DB_URL)

engine = create_engine(DB_URL, pool_pre_ping=True,echo=True) #DB연결 및 커넥션 풀링 등 관리함
SessionLocal = sessionmaker(bind=engine, autocommit=False, autoflush=False)
Base = declarative_base()

def get_db():
    session = SessionLocal()
    try:
        yield session
    finally:
        session.close()
