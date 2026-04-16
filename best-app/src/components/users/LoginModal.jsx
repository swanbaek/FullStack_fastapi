//LoginModal.jsx
import React from 'react'
import { Modal,Button, Row, Col, Form } from 'react-bootstrap'
import {useState, useRef, useEffect} from 'react'
import { apiSignIn } from '../../api/memberApi'
// import {loginAuthUser } from '../../stores/authStore'
import { useAuthStore } from '../../stores/authStore'

//인증받은 사용자 정보는 전역 store로 관리 =>  stores/authStore.js
//사용자가 입력한 값(email, passwd)는 지역적 state로 관리
export default function LoginModal({show, setShowLogin}) {

    const loginAuthUser = useAuthStore(s=>s.loginAuthUser)

    const [loginUser, setLoginUser]= useState({email:'', passwd:''})
    const emailRef = useRef(null)
    const passwdRef = useRef(null)

    useEffect(()=>{
        if(show) emailRef.current.focus()
            //초기 로딩시 이메일 입력창에 입력 포커스 주기
    },[show])

    const handleChange=(e)=>{
        setLoginUser({...loginUser,[e.target.name]:e.target.value})
    }//---------------------------------
    const handleSubmit=(e)=>{
        e.preventDefault()
        //유효성 체크
        const {email, passwd }=loginUser
        if(!email.trim()){
            alert('ID(이메일)를 입력하세요')
            emailRef.current.focus()
            return;
        }
        if(!passwd.trim()){
            alert('비밀번호 입력하세요')
            passwdRef.current.focus()
            return;
        }
        //api 요청 보내기
        requestLogin()
    }//---------------------------------
    const requestLogin=async ()=>{
        try{
            const response = await apiSignIn(loginUser)
            //alert(JSON.stringify(response))
            //result:success, message:로그인 성공 ..., data:{accessToken:'', refreshToken:'', 회원정보}
            console.log('response: ', response)

            const {result, message, data}=response


            if(result==='success'){
                //인증받은 사용자일 경우=> 서버에서 accessToken과 refreshToken을 보내온다
                const {accessToken, refreshToken} = data
                //accessToken은 sessionStorage에 저장 (브라우저 사용 동안 보관)
                sessionStorage.setItem('accessToken', accessToken)
                //refreshToken은 localStorage에 저장 (브라우저 껐다 켜도 저장되어 있음)
                localStorage.setItem('refreshToken', refreshToken)

                const {id,name,email,role}=data
                console.log(id, name, email, role)
                //인증받은 사용자 정보를 store에 저장 (전역적으로 관리)
                loginAuthUser({id,name,email,role})
                //Side.jsx에서 저장된 authUser를 꺼내서 "xxx님 로그인 중" 출력

            }else{
                alert(message)
            }

        }catch(err){
            console.error('로그인 요청 에러: ', err)
            alert(err.response?.data?.detail?? err.message)
        }finally{
            resetForm()
            setShowLogin(false)//모달창 닫기 
        }
    }//---------------------------------
    const resetForm =()=>{
        setLoginUser({email:'', passwd:''})
        emailRef.current.focus()
    }//---------------------------------

    return (
        <>
            <Modal show={show} onHide={()=> setShowLogin(false)} >
                <Modal.Header closeButton>
                <Modal.Title>Login</Modal.Title>
                </Modal.Header>

                <Modal.Body>
                <Row>
                    <Col className="p-4 mx-auto" xs={10} sm={10} md={8}>
                    <Form onSubmit={handleSubmit}>
                        <Form.Group className="mb-3">
                        <Form.Label>ID (email)</Form.Label>
                        <Form.Control
                            type="text"
                            name="email"
                            ref={emailRef}
                            onChange={handleChange}
                            value={loginUser.email}
                            placeholder="ID (email)"
                        />
                        </Form.Group>

                        <Form.Group className="mb-3">
                        <Form.Label>Password</Form.Label>
                        <Form.Control
                            type="password"
                            name="passwd"
                            ref={passwdRef}
                            onChange={handleChange}
                            value={loginUser.passwd}
                            placeholder="Password"
                        />
                        </Form.Group>

                        <div className="d-grid">
                        <Button type="submit" variant="info">
                            Login
                        </Button>
                        </div>
                    </Form>
                    </Col>
                </Row>
                </Modal.Body>
            </Modal>
        </>
    )
}
