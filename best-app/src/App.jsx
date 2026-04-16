
import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Row, Col } from "react-bootstrap";
import Header from "./components/Header";
import Side from "./components/Side";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import './App.css'
import SignUp from "./components/users/SignUp";
import Counter from "./components/Counter";
import MemberList from "./components/users/MemberList";
import LoginModal from "./components/users/LoginModal";
import MyPage from "./components/users/MyPage";

import { useState, useEffect } from 'react'

//import axiosInstance from "./api/axiosInstance";//일반 axios인스턴스
import axiosAuthInstance from "./api/axiosAuthInstance"; //인증처리가 필요할때 사용하는 axios 인스턴스
//==> interceptor를 통해 요청 사전처리와 응답 사전처리를 함
import { useAuthStore } from "./stores/authStore";

function App() {

    const [showLogin, setShowLogin]=useState(false)
    //true=> LoginModal보여주기, false=>로그인 모달 감추기

    const loginAuthUser = useAuthStore(s=>s.loginAuthUser)
    useEffect(()=>{
        //서버쪽에 accessToken으로 요청 인증받은 사용자 정보 받아 authUser에 setting
        requestAuthUser();
    },[])

    const requestAuthUser=async()=>{
        try{
            const accessToken=sessionStorage.getItem('accessToken')
            if(accessToken){
                const res = await axiosAuthInstance.get(`/api/users/me`,{
                    headers:{
                        Authorization:`Bearer ${accessToken}`
                    }
                })
                const authUser= await res.data
                loginAuthUser(authUser)
                //인증 사용자 정보 전역 state에 설정
            }

        }catch(err){
            console.error('accessToken토큰 유효하지 않음: ',err)
            sessionStorage.removeItem('accessToken')
            localStorage.removeItem('refreshToken')
            alert(err.message)
        }

    }//-------------------------------


    return (
        <>
            <div className="container fluid py-5">
                <BrowserRouter>
                    <Row>
                        <Col className="mb-5">
                            <Header />
                        </Col>
                    </Row>
                    <Row className="main">
                        <Col xs={12} sm={4} md={4} lg={3} className="d-none d-sm-block mt-3">
                            <Side setShowLogin={setShowLogin} />
                        </Col>
                        <Col xs={12} sm={8} md={8} lg={9}>
                            {/* 로그인 모달 포함시키기 showLogin state로 보여줄지 여부 설정 ---- */}
                            <LoginModal show={showLogin} setShowLogin={setShowLogin} />

                            {/* 라우트 ------- */}
                            <Routes>
                                <Route path="/" element={<Home />} />
                                <Route path="/signup"  element={<SignUp/>}  />
                                <Route path="/count" element={<Counter/>} />
                                <Route path="/admin/users" element={<MemberList/>} />
                                <Route path="/mypage" element={<MyPage/>} />
                            </Routes>
                        </Col>
                    </Row>
                    <Row>
                        <Col lg={12}></Col>
                    </Row>
                </BrowserRouter>
            </div>
            <Footer />
        </>
    );
}

export default App;
