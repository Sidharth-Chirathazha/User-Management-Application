import React, { useState, useEffect } from 'react'
import '../adminPages/AdminLogin.css'
import { useDispatch, useSelector } from "react-redux"
import { Lock } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { adminLogin,reset } from '../features/auth/authSlice';
import { toast } from 'react-toastify';
import Spinner from '../components/Spinner';

const AdminLogin = () => {

  const [email,setEmail] = useState("")
  const [password,setPassword] = useState("")

  const dispatch = useDispatch()
  const navigate = useNavigate()

  const { admin, isError, isLoading, isSuccess, message } = useSelector((state)=>state.auth)

  const handleSubmit = (e)=>{
    e.preventDefault()
    dispatch(adminLogin({email, password}))
  }

  useEffect(()=>{
    if(isError){
        toast.error(message)
    }
    if(isSuccess || admin){
        navigate("/admin/dashboard")
    }
    dispatch(reset())

  },[isError, isSuccess, admin, navigate, dispatch])


  return (

    <div className="admin-auth__container">
    <form className="admin-auth__form" onSubmit={handleSubmit}>
      <div className="admin-main__title">
        <Lock />
        <span>Admin Login</span>
      </div>
      {isLoading && <Spinner />}
      <input 
        type="email" 
        placeholder="Email Address" 
        value={email}
        onChange={(e)=>setEmail(e.target.value)}
        className="admin-auth__input"
        required
      />
      
      <input 
        type="password" 
        placeholder="Password"
        value={password}
        onChange={(e)=>setPassword(e.target.value)} 
        className="admin-auth__input"
      />
      
      <button 
        className="admin-btn-primary"
        type='submit'
      >
        Sign In
      </button>
    </form>
  </div>
  )
}

export default AdminLogin