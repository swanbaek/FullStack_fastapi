#core/config.py
# 환경설정, 환경변수 관리
import os
from dotenv import load_dotenv
from pydantic_settings import BaseSettings

load_dotenv()

class Settings(BaseSettings):
    ACCESS_SECRET:str
    REFRESH_SECRET:str
    ACCESS_EXPIRE_MINUTES: int = 15 #15분 유효시간
    REFRESH_EXPIRE_HOURES: int = 1  #1시간 유효시간

    model_config={
        "env_file":".env",
        "extra":"allow"
    }

settings=Settings()