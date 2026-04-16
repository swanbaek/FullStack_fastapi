import React from "react";
import { Stack, Button, ListGroup } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import { useAuthStore } from "../stores/authStore";
import { apiSignOut } from "../api/memberApi";

const Side = ({setShowLogin}) => {

    //const {authUser, logout} = useAuthStore()

    const authUser = useAuthStore((state)=>state.authUser)
    const logout = useAuthStore((s)=>s.logout)
    const navigate= useNavigate()

    const handleLogout= async ()=>{
        if(!authUser) return;
        try{
            //서버쪽에 api요청
            const response = await apiSignOut({email:authUser.email})
            if(response.result==='success'){
                logout()//authUser를 null로 초기화
                sessionStorage.removeItem('accessToken')
                localStorage.removeItem('refreshToken')
                navigate("/")
            }

        }catch(err){
            alert('로그아웃 처리 중 에러: '+err.message)
        }
    }

    return (
        <Stack gap={2} className="mx-auto w-100">
            <Button variant="primary" as={Link} to="/">
                Home
            </Button>
            {!authUser&&(
                <Button variant="outline-success" as={Link} to="/signup">
                    SignUp
                </Button>
            )}
            {authUser&&(
                <div className="alert alert-danger">{authUser.name} 님 로그인 중 ...
                <br/><br/>
                {authUser.email} [{authUser.role}]
                </div>
            )}
            {authUser&&(
                <Button variant="outline-success" onClick={handleLogout} >Logout</Button>
            )}
            {!authUser&&(
                <Button variant="outline-success" onClick={()=> setShowLogin(true)}>SignIn</Button>
            )}
            <Button variant="outline-danger">인증 테스트</Button>
            <hr />
            <ListGroup>
                <ListGroup.Item as={Link} to="/count">
                    Counter zustand
                </ListGroup.Item>
                <ListGroup.Item as={Link} to="/hook2">
                    Menu 2
                </ListGroup.Item>
            </ListGroup>
        </Stack>
    );
};

export default Side;
