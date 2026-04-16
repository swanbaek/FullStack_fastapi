//stores/authStore.js
import {create } from 'zustand'
import { devtools } from 'zustand/middleware'

export const useAuthStore = create(
    devtools((set)=>({
        authUser:null, //인증받은 사용자 정보
        loginAuthUser: (user)=>set({authUser:user}),//로그인 유저정보를 authUser에 설정
        logout:()=>set({authUser:null})//로그아웃 처리
    }))
)