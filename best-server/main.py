# Main entry point for FastAPI server
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.templating import Jinja2Templates
from api.member import router as member_router
from api.auth import router as auth_router
import logging

logging.basicConfig(level=logging.INFO)

logger=logging.getLogger(__name__)

#4. FastAPI앱 생성
app=FastAPI()

# 5. 모델에 근거한 db 테이블 자동 생성
# Base.metadata.create_all(bind=engine)

#6. React와 통신을 위한 CORS 설정
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], #  테스트용이므로 모두 허용
    allow_methods=["*"],
    allow_headers=["*"]
)
# Static / Templates-------------------------------
from fastapi.staticfiles import StaticFiles
import os

static_dir = os.path.join(os.path.dirname(__file__), "static")

app.mount("/static", StaticFiles(directory=static_dir), name="static")
templates = Jinja2Templates(directory="/templates")

# API Router ------------------------------------------
#from api.member import router as member_router
app.include_router(member_router) #회원관련 라우터 연결
app.include_router(auth_router, prefix="/auth") # 회원 인증/인가 관련 라우터
# /auth/login,  /auth/logout
