import React from 'react';
import './MyPage.css';
import { useAuthStore } from '../../stores/authStore';

const MyPage = () => {
    // 실제 데이터는 추후 props 또는 상태로 전달 예정
    const user = useAuthStore(s=>s.authUser)
    //인증받은 사용자 authUser를 받아 user에 할당

    if(!user){
        return (
            <div className="mypage-container">
                <h2 className='text-danger my-4'>
                    로그인한 사용자만 확인할 수 있습니다
                </h2>
            </div>
        )
    }


    return (
        <div className="mypage-container">
        <h2>마이페이지</h2>
        <div className="mypage-info">
            <div className="mypage-row">
            <span className="mypage-label">ID:</span>
            <span className="mypage-value">{user.id}</span>
            </div>
            <div className="mypage-row">
            <span className="mypage-label">이름:</span>
            <span className="mypage-value">{user.name}</span>
            </div>
            <div className="mypage-row">
            <span className="mypage-label">이메일:</span>
            <span className="mypage-value">{user.email}</span>
            </div>
            <div className="mypage-row">
            <span className="mypage-label">권한:</span>
            <span className="mypage-value">{user.role}</span>
            </div>
        </div>
        </div>
    );
};

export default MyPage;
