import { Form, Row, Col, Button } from 'react-bootstrap';
import {useState} from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom';

export default function SignUp() {

    const [formData, setFormData]=useState({
        name:'',
        email:'',
        passwd:'',
        role:'USER'
    })
    const [isEmailCheck, setIsEmailCheck]= useState(false)
    //이메일 중복여부 체크 결과를 담을 state

    const navigate = useNavigate()

    const handleChange=(e)=>{
        setFormData({ ...formData, [e.target.name]:e.target.value })
        if(e.target.name ==='email'){
            setIsEmailCheck(false)
            //이메일 입력값을 입력하는 동안은 false로
        }
    }//---------------------------
    const checkEmail= async ()=>{
        if(!formData.email){
            alert('이메일을 입력하세요')
            return;
        }
        //백엔드 쪽에 이메일 중복체크 요청 보내기
        const res = await axios.post(`/api/users/check-email`,{
            "email":formData.email
        },{
            headers:{
                "Content-Type":"application/json"
            }
        })
        // {"exists":True}, {"exists":False}
        if(res.data.exists){
            alert('이미 사용중인 이메일 입니다')
            setIsEmailCheck(false)
        }else{
            alert('사용 가능한 이메일 입니다')
            setIsEmailCheck(true)
        }
    }//-----------------------------

    const handleSubmit=async (e)=>{
        //form이 submit되지 않도록 기본동작을 막자
        e.preventDefault()
        //유효성 체크
        if(!isEmailCheck){
            alert('이메일 중복 체크를 해야 해요')
            return;
        }

        //alert('ajax로 회원가입 처리 요청 예정')
        //const url=`http://localhost:8000/api/users` //fastapi url
        //vite.config.js에 proxy 설정함
        const url=`/api/users`

        //sop정책에 의해 에러 발생 cors관련 에러
        try{
            //post방식으로 요청 '/api/users'
            //post방식일때는 회원 데이터를 요청 body부분에 포함시켜야 한다
            //headers에 Content-Type을 'application/json'으로 해야한다
            const response = await axios.post(
                        url,formData,{ //public/result.json 생성해서 테스트
                            headers:{
                                'Content-Type':'application/json'
                            }
                        })
            //alert(JSON.stringify(response));
            //alert(response.data.message)
            
            if(response.status==200){
                alert('회원가입 완료했습니다. 로그인 페이지로 이동합니다')
                navigate('/')
            }


        }catch(err){
            alert('회원가입 처리 중 에러: '+err.message)
        }


    }//-----------------------------------


    return (
        <div className="container py-4">
            <h1 className="text-center my-4">Signup</h1>
            <Form method='post' onSubmit={handleSubmit}>
                {/* 이름 입력 */}
                <Form.Group as={Row} className="mb-3">
                    <Form.Label column sm={2}>이름</Form.Label>
                    <Col sm={8}>
                        <Form.Control
                            type="text"
                            name="name"
                            onChange={handleChange}
                            placeholder="이름을 입력하세요"
                        />
                    </Col>
                </Form.Group>

                {/* 이메일 입력 */}
                <Form.Group as={Row} className="mb-3">
                    <Form.Label column sm={2}>이메일</Form.Label>
                    <Col sm={8}>
                        <Form.Control
                            type="email"
                            name="email"
                            onChange={handleChange}
                            placeholder="example@email.com"
                        />
                    </Col>
                    <Col sm={2}>
                        <Button type="button"
                        onClick={checkEmail}
                        variant="success" className="w-100">
                            중복체크
                        </Button>
                    </Col>
                </Form.Group>

                {/* 비밀번호 입력 */}
                <Form.Group as={Row} className="mb-3">
                    <Form.Label column sm={2}>비밀번호</Form.Label>
                    <Col sm={8}>
                        <Form.Control
                            type="password"
                            name="passwd"
                            onChange={handleChange}
                            placeholder="비밀번호를 입력하세요"
                        />
                    </Col>
                </Form.Group>

                {/* 역할 선택 (Select) */}
                <Form.Group as={Row} className="mb-3">
                    <Form.Label column sm={2}>역 할</Form.Label>
                    <Col sm={8}>
                        <Form.Select name="role" onChange={handleChange}>
                            <option value="">:::역할 선택:::</option>
                            <option value="USER">일반 사용자 (USER)</option>
                            <option value="ADMIN">관리자 (ADMIN)</option>
                        </Form.Select>
                    </Col>
                </Form.Group>

                {/* 하단 버튼 구역 */}
                <Row className="mt-4">
                    <Col className="text-center">
                        <Button variant="info" type="submit" className="me-2">
                            회원가입
                        </Button>
                        <Button variant="secondary" type="button">
                            다시쓰기
                        </Button>
                    </Col>
                </Row>
            </Form>
        </div>
    );
}
