import React from 'react'
import bg from '../../assets/background.jpg';

const Main = () => {
  return (
   <div className='main'>
       <div className="overlay"></div>
        <video src={videoBg} autoPlay loop muted />
        <div className="content">
            <h1>CertiQ</h1>
        </div>
    </div>
  )
}

export default Main