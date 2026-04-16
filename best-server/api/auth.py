# auth.py
from fastapi import APIRouter,HTTPException, Depends
from schemas.member_schema import LoginRequest
from sqlalchemy.orm import Session
from core.database import get_db
import logging
from models.member_model import Member
from schemas.member_schema import EmailCheck, RefreshRequest

from core.jwt_handler import create_access_token, create_refresh_token
from core.config import settings
from jose import JWTError,jwt
import bcrypt

router=APIRouter()

logger=logging.getLogger(__name__)


@router.post('/login')
def login(tmpUser: LoginRequest, db:Session=Depends(get_db)):
    logger.info("email: %s, passwd: %s", tmpUser.email, tmpUser.passwd)
    
    user = db.query(Member).filter(Member.email==tmpUser.email).first()

    #날것의 비밀번호(111)를 str-> byte로 인코딩
    plain_passwd=tmpUser.passwd.encode()

    #DB에서 가져온 해시 비번도 byte로 인코등
    hashed_passwd=user.passwd.encode()


    # 사용자가 입력한 이메일 값이 db에 있는지 체크
    if not user:
        raise HTTPException(status_code=401, detail="ID(email) 또는 비밀번호가 일치하지 않아요1")
    # 사용자가 입력한 비번과 DB에거 가져온 비번이 일치하는지 체크
    if not bcrypt.checkpw(plain_passwd, hashed_passwd):
        raise HTTPException(status_code=401, detail="ID(email) 또는 비밀번호가 일치하지 않아요2")
    
    # 사용자가 맞다면 프런트쪽에 사용자정보(id,name,email,role)와 accessToken,refreshToken을 
    # 보내자
    payload={
        "id": user.id,
        "name": user.name,
        "email":user.email,
        "role": user.role
    }
    # 토큰 발급--------------------
    # [1] 억세스토큰/리프레시토큰을 생성
    access_token= create_access_token(payload)
    refresh_token = create_refresh_token(payload)
    
    # [2] members테이블에 refresh_token값을 update
    user.refresh_token=refresh_token #update문 수행 => DB에 refresh_token 을 수정해서 저장
    db.commit()
    db.refresh(user)

    response={
        "result":"success",
        "message":"로그인 테스트 중",
        "data":{
            "accessToken":access_token,
            "refreshToken":refresh_token,
            **payload
        }
    }
    return  response

# logout 요청 처리 => email로 refreshToken 제거
@router.post("/logout")
def logout(emailReq: EmailCheck, db:Session=Depends(get_db)):
    logger.info("emailReq: %s", emailReq)
    user = db.query(Member).filter(Member.email==emailReq.email).first()
    if not user:
        raise HTTPException(status_code=400, detail="잘못된 요청입니다")
    user.refresh_token=None
    db.commit()
    db.refresh(user)
    return {"result":"success","message":"로그아웃 처리되었습니다"}


@router.post("/refresh")
def refresh_token(body: RefreshRequest, db: Session = Depends(get_db)):
    print(">> refresh_token() body:", body)  # 디버깅용 출력
    try:
        decoded = jwt.decode(body.refreshToken, settings.REFRESH_SECRET, algorithms=["HS256"])
    except JWTError:
        raise HTTPException(status_code=403, detail="유효하지 않은 refreshToken")

    user = db.query(Member).filter(Member.refresh_token == body.refreshToken).first()
    if not user:
        raise HTTPException(status_code=403, detail="유효하지 않은 refreshToken")
    # 이 부분이 없으면 안됨
    new_access = create_access_token({
        "id": user.id,
        "name": user.name,
        "email": user.email,
        "role": user.role,
    })
    return {"accessToken": new_access}