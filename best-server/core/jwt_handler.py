#core/jwt_handler.py
from core.config import settings
from jose import jwt
from datetime import datetime, timedelta

def create_access_token(data:dict):
    exp=datetime.utcnow()+timedelta(minutes=settings.ACCESS_EXPIRE_MINUTES) #15분 유효시간
    return jwt.encode({**data,"exp":exp}, settings.ACCESS_SECRET, algorithm="HS256")

def create_refresh_token(data:dict):
    exp=datetime.utcnow()+timedelta(hours=settings.REFRESH_EXPIRE_HOURES) #1시간 유효시간
    return jwt.encode({**data,"exp":exp}, settings.REFRESH_SECRET,algorithm="HS256")
