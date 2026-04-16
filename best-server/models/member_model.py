# member_model.py
from core.database import Base
from sqlalchemy import Column,Integer,String,DateTime,Identity
from datetime import datetime

#2. SQLAlchemy 모델 정의 (DB 테이블 매핑)
class Member(Base):
    __tablename__="members" # 테이블명 지정

    #컬럼 정의
    id = Column(Integer, Identity(start=1, cycle=False),primary_key=True)
    name = Column(String(50), nullable=False)
    email= Column(String(100), unique=True, nullable=False)
    passwd= Column(String(100), nullable=False)
    role=Column(String(20), default="USER")
    refresh_token=Column(String(250))
    create_at= Column(DateTime, default=datetime.now)
    update_at= Column(DateTime)