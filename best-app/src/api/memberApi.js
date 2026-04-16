//src/api/memberApi.js
//백엔드에 회원관련 api요청을 보내는 함수들의 모음
import axiosInstance from "./axiosInstance"
// /api/users => 일반 회원관련
// /api/admin/users => 관리자페이지 (회원전체 목록)
// /auth/login => 회원인증 요청(로그인처리)
// /auth/logout => 로그아웃 요청
export const apiSignIn = async (loginUser)=>{
    const res = await axiosInstance.post(`/auth/login`, loginUser)
    //vite.config.js에 proxy설정해야 함
    return res.data
}//--------------------------------------

export const apiSignOut = async (email)=>{
    const res = await axiosInstance.post(`/auth/logout`, email)
    return res.data
}//--------------------------------------