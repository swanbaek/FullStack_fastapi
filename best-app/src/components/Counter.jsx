//src/components/Counter.jsx
import React from 'react'
import  { useStore } from '../stores/counterStore'

export default function Counter() {
    const {count,increase, decrease} =useStore()

    return (
        <div>
            <h1>Count: {count} </h1>
            <button className="btn btn-info mx-1" onClick={increase}>+</button>
            <button className="btn btn-danger" onClick={decrease}>-</button>
        </div>
    )
}
