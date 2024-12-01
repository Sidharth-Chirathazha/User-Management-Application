import React from 'react'
import {Link} from 'react-router-dom'
import '../pages/styles/HomePage.css'

const HomePage = () => {
  return (
    <>
      <div className="container home-page__container">
          <h1 className="main__title">Welcome to my Application, Please Login/SignUp to continue</h1>
          <div className="home__buttons">
              <Link to="/login" className="btn btn-secondary">Login</Link>
              <Link to="/register" className="btn btn-primary">Sign up</Link>
              <Link to="/admin/login" className="btn btn-admin">Admin</Link>
          </div>
      </div>
    </>
  )
}

export default HomePage