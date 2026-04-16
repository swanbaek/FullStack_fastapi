# core/deps.py
from fastapi import Depends,HTTPException
from fastapi.security import HTTPBearer
from jose import jwt, JWTError,ExpiredSignatureError
from core.config import settings

bearer=HTTPBearer()

# 클이 Bearer accessToken을 보내면 유효한지 체크
def get_current_user_jwt(token:str = Depends(bearer)):
    try:
        decoded=jwt.decode(token.credentials,
                        settings.ACCESS_SECRET,
                        algorithms=["HS256"])
        print('decoded: ',decoded)
        uid=decoded.get('id')
        role=decoded.get('role')
        if not uid:
            raise HTTPException(status_code=401, detail="토큰에 id가 없습니다")
        
        return {"id": uid, "role":role}
    except ExpiredSignatureError:
        #만료된 토큰일 경우=>401 에러
        raise HTTPException(status_code=401, detail="토큰이 만료되었습니다")
    except JWTError:
        #위변조 등 유효하지 않은 토큰 => 403 로 구분
        raise HTTPException(status_code=403, detail="유효하지 않은 토큰입니다")


#관리자 권한 체크
def admin_only(user = Depends(get_current_user_jwt)):
    if user["role"] != "ADMIN":
        raise HTTPException(status_code=403, detail="관리자 권한 필요")
    return user
