//api/axiosInstance.js
import axios from "axios";

//사용자 인증이나 인가가 필요없는 서비스 요청시 사용 예정
//로그인해야 이용가능한 서비스 요청시에는 axiosAuthInstance를 사용할 예정

const axiosInstance = axios.create({
    baseURL:``, //proxy 설정으로 ''만 줘도 됨
    headers:{
        'Content-Type':'application/json'
    }
})
export default axiosInstance