# api/member.py
from fastapi import APIRouter, Depends,HTTPException
from models.member_model import Member
from schemas.member_schema import SignUpRequest,MemberResponse,MemberUpdate
from sqlalchemy.orm import Session
from core.database import get_db
from datetime import datetime
from core.deps import get_current_user_jwt
import bcrypt

router=APIRouter()

#7. 회원가입 API Endpoint
@router.post("/api/users")
async def signup(user: SignUpRequest, db:Session= Depends(get_db)):
    try:
        # 이메일 중복여부 확인
        existing_user = db.query(Member).filter(Member.email ==user.email).first()
        if(existing_user):
            # 이미 해당 이메일을 사용 중인 경우 에러 발생시키자
            raise HTTPException(status_code=400, detail="이미 존재하는 이메일입니다. 다시 입력하세요")
        
        # 비밀번호 해싱처리 bcrypt모듈 import
        hashed_pw = bcrypt.hashpw(user.passwd.encode(), bcrypt.gensalt()).decode()
        print('hashed_pw: ', hashed_pw)
        
        #새 회원 객체 생성
        new_user=Member(
            name=user.name,
            email=user.email,
            passwd=hashed_pw, #암호화된 비번으로 저장
            role=user.role
        )
        db.add(new_user) # insert문을 수행함
        db.commit() # 트랜잭션 처리
        db.refresh(new_user)

        return {"result":"success", "message":"회원가입 성공!", "id": new_user.id}
    except Exception as ex:
        db.rollback()
        raise HTTPException(status_code=500, detail=str(ex))

from schemas.member_schema import EmailCheck

# 이메일 중복 체크
@router.post('/api/users/check-email')    
def check_email(data: EmailCheck, db: Session=Depends(get_db)):
    exists=db.query(Member).filter(Member.email== data.email).first()
    return {"exists": exists is not None}

from sqlalchemy import desc    
# 모든 회원 조회
@router.get('/api/users', response_model=list[MemberResponse])
def get_all_users(db:Session= Depends(get_db)):
    return db.query(Member).order_by(desc(Member.id)).all()

@router.get('/api/users/me')
def get_my_info(uid=Depends(get_current_user_jwt), db:Session=Depends(get_db)):
    user = db.query(Member).filter(Member.id==uid['id']).first()
    return user

# 회원번호로 조회
@router.get("/api/users/{id}", response_model=MemberResponse)
def get_user(id:int, db:Session=Depends(get_db)):
    user =db.query(Member).filter(Member.id== id).first()
    if not user:
        raise HTTPException(status_code=404, detail="해당 회원은 존재하지 않습니다")
    return user

# 회원번호로 삭제
@router.delete("/api/users/{id}")
def delete_user(id: int, db:Session = Depends(get_db)):
    user = db.query(Member).filter(Member.id==id).first()
    if not user:
        raise HTTPException(status_code=404, detail="해당 회원은 존재하지 않습니다")
    #해당 회원이 있다면 삭제 처리
    db.delete(user)
    db.commit()
    return {
        "result":"success",
        "message":str(id)+"번 회원정보를 삭제했습니다"
    }
# 회원정보 수정 (비밀번호, 이름 수)
@router.put("/api/users/{id}")
def update_user(id:int, user: MemberUpdate, db:Session=Depends(get_db)):
    print('id: ', id, 'user: ', user)
    existUser=db.query(Member).filter(Member.id== id).first()
    if not existUser:
        raise HTTPException(status_code=404, detail="수정할 회원정보가 존재하지 않아요")
    if user.name:
        existUser.name=user.name
    if user.email:
        existUser.email=user.email
    
    if user.passwd:
        existUser.passwd=user.passwd
    if user.role:
        existUser.role=user.role        
    existUser.update_at=datetime.now()
    db.commit()
    db.refresh(existUser)
    return {
        "result":"success",
        "message": str(id)+"번 회원정보를 수정했습니다"
    }