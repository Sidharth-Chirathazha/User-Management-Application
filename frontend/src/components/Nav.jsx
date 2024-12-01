import React from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import '../components/Nav.css'
import { useDispatch, useSelector } from 'react-redux'
import { logout, reset } from '../features/auth/authSlice'

const Nav = () => {

  const navigate = useNavigate()
  const dispatch = useDispatch()

  const {user,admin} = useSelector((state)=>state.auth)

  const handleLogout = ()=>{
    dispatch(logout())
    dispatch(reset())
    
    if(admin){
      navigate('/admin/login')
    }else{
      navigate('/')
    }
  }

  return (
    <nav className="navbar">
      <NavLink className="logo" to={admin ? "/admin/dashboard" : "/"}>Logo</NavLink>
      {(user || admin) ? (
        <ul className="nav-links">
          <>
            {admin && <NavLink className="nav-childs" to="/admin/dashboard">Admin Dashboard</NavLink>}
            {user && <NavLink className="nav-childs" to="/dashboard">User Dashboard</NavLink>}
            <NavLink className="nav-childs" to="/" onClick={handleLogout}>Logout</NavLink>
          </>
        </ul>
      ) : (
        <></>
      )}
    </nav>
  )
}

export default Nav