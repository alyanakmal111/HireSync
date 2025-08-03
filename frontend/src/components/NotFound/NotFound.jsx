import React from 'react'
import { Link } from 'react-router-dom'
import Navbar from '../Layout/Navbar'

const NotFound = () => {
  return (
    <>
     <Navbar />
        <section className='page notfound'>
          <div className="content">
            <img src="/notfound.png" alt="notfound" />
            <Link to={'/'}>RETURN TO HOME PAGE</Link>
          </div>
        </section>
    </>
  )
}

export default NotFound
