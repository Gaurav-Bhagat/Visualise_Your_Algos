import React from 'react'
import './FirstPage.css'
import Start from './Start'

const FirstPage = () => {
  return (
    <div className='first-page-container'>
      <span className='first-page'>
        Start To visualize
      </span>
      <br></br>
      <span className='algo'>
            AlgoRyThms!!
      </span>

      <Start />    
    </div>
  )
}

export default FirstPage
