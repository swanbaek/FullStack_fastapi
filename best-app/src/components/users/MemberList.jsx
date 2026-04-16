//components/users/MemberList.jsx
import {useEffect} from 'react'
import { useMemberStore } from '../../stores/useMemberStore'
import { useAuthStore } from '../../stores/authStore'
import { useNavigate } from 'react-router-dom'

export default function MemberList() {

    const {users,loading,error, fetchMembers} = useMemberStore()
    const authUser = useAuthStore(s=>s.authUser)
    const navigate = useNavigate()

    useEffect(()=>{
        if(!authUser||authUser.role?.toUpperCase()!=='ADMIN'){
            alert('관리자로 로그인해야 이용 가능합니다')
            navigate("/")

        }else{
            fetchMembers() //api요청을 백엔드에 보내 회원목록 받아와서 users에 셋팅함
        }

    },[authUser])

    if(loading){
        return (
            <div className="alert alert-primary">
                <h3>Loading...</h3>
            </div>
        )
    }
    if(error){
        return (
            <div className="alert alert-danger">
                <h3>Error: {error} </h3>
            </div>
        )
    }

    return (
        <div className='container py-4 text-center'>
            <h2>전체 회원 목록 [Admin Page]</h2>
            <table className="table table-striped">
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Name</th>
                        <th>Email</th>
                        <th>Role</th>
                        <th>Edit|Del</th>
                    </tr>
                </thead>

                <tbody>
                {users.map((u)=>(    
                    <tr key={u.id}>
                        <td> {u.id} </td>
                        <td>{u.name}</td>
                        <td>{u.email}</td>
                        <td>{u.role}</td>
                        <td>Edit|Del</td>
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
    )
}
