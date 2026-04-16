//src/stores/counterStore.js
import {create} from 'zustand'
// create()함수 통해 store를 생성한다
// set() : 상태를 수정 처리하는 함수
import { persist, devtools } from 'zustand/middleware'
export const useStore = create(
    persist(
        (set)=>({
            count: 0,
            increase: ()=> set((state)=>({count: state.count +1})),
            decrease: ()=> set((state)=>({count: state.count -1}))
        }),
        {name: "counter-storage"} 
        // localStorage에 저장할 때 사용할 이름 지정
    )
)