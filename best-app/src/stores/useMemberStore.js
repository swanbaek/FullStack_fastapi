// useMemberStore.js
import { devtools } from "zustand/middleware";
import  { create } from 'zustand';
//import axios from "axios";
import axiosAuthInstance from "../api/axiosAuthInstance";

export const useMemberStore= create(
    devtools( //미들웨어 redux devtools에서 state값 확인 가능
        (set)=>({
            users:[],
            loading:false,
            error:null,
            fetchMembers: async ()=>{
                set({loading:true, error:null}) //로딩중
                try{
                    const res = await axiosAuthInstance.get('/api/users')
                    set({users:res.data, loading:false, error:null})
                }catch(err){
                    set({error:err.message, loading:false})
                }
            }
        })
    )
)