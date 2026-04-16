# member_schema.py
from pydantic import BaseModel
from typing import Optional
from datetime import datetime

#3. Pydantic 모델 정의 (React에서 봰 데이터 검증)  
class EmailCheck(BaseModel): # 이메일 중복체크, 로그아웃시 활용
    email:str

class LoginRequest(BaseModel): #로그인 요청시 사용
    email:str
    passwd:str    
    
class RefreshRequest(BaseModel): #리프레시 토큰 요청시
    refreshToken: str    

class SignUpRequest(BaseModel): #회원가입 요청시
    name: str
    email: str
    passwd: str
    role: str="USER"
class MemberResponse(BaseModel):
    id: int
    name: str
    email: str
    role: str
    create_at: datetime

    class Config:
        orm_mode = True

from typing  import Optional

class MemberUpdate(BaseModel):
    name: Optional[str]=None
    email: Optional[str]=None
    passwd: Optional[str]=None
    role: Optional[str]=None
    # 회원정보 수정시 선택적으로 수정하도록 Optional로 주자.
