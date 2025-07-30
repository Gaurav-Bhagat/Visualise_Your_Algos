import React from 'react'
import './Start.css'

import { useNavigate } from 'react-router-dom'

const Start = () => {
  const navigate = useNavigate()
  return (
    <div className='start-container'>
      <button className='butt-1' onClick={()=>{
        navigate("/menu")
      }}>Start</button>
    </div>
  )
}

export default Start
