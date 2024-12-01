import React, { useEffect, useState } from 'react'
import '../pages/styles/RegisterPage.css'
import { FaRegUser } from "react-icons/fa"
import {toast} from 'react-toastify'
import { useDispatch,useSelector } from 'react-redux'
import {register} from '../features/auth/authSlice' 
import { useNavigate } from 'react-router-dom'
import { reset } from '../features/auth/authSlice'
import Spinner from '../components/Spinner'

const RegisterPage = () => {
 
  const [formData,setFormData] = useState({
    "first_name": "",
    "last_name": "",
    "email": "",
    "password": "",
    "re_password": "",
  })

  const { first_name, last_name, email, password, re_password } = formData

  const dispatch = useDispatch()
  const navigate = useNavigate()

  const {user, isLoading, isError, isSuccess, message} = useSelector((state)=>state.auth)
  const authUser = {user, isLoading, isError, isSuccess, message}

  const handleChange = (e)=>{
    setFormData((prev)=>({
        ...prev,
        [e.target.name]:e.target.value
    })
    
    )
    console.log("inside handlechange");
    
  }

  const handleSubmit = (e)=>{
    e.preventDefault()

    if(password !== re_password){
        toast.error("Password doesn't match")
    }else{
        const userData = {
            first_name,
            last_name,
            email,
            password,
            re_password
        }
        console.log("Inside use handle submit");
        dispatch(register(userData))
    }
  }

  useEffect(()=>{
    console.log(authUser);
    
    if(isError){
        toast.error(message)
    }
    if(isSuccess || user){
        console.log("Inside use effect");
        
        navigate("/")
        toast.success("An activation email has been sent to your email")
    }

    dispatch(reset())
    
  },[isError, isSuccess, user, navigate, dispatch])


  return (
    <>
            <div className="container auth__container">
                <h1 className="main__title">Sign Up <FaRegUser/></h1>
                {isLoading && <Spinner/>}
                <form className="auth__form" >
                    <input type="text"
                        placeholder="First Name"
                        name="first_name"
                        onChange={handleChange}
                        value={first_name}
                        required
                    />
                    <input type="text"
                        placeholder="Last Name"
                        name="last_name"
                        onChange={handleChange}
                        value={last_name}
                        required
                    />
                    <input type="email"
                        placeholder="Email"
                        name="email"
                        onChange={handleChange}
                        value={email}
                        required
                    />
                    <input type="password"
                        placeholder="Password"
                        name="password"
                        onChange={handleChange}
                        value={password}
                        required
                    />
                    <input type="password"
                        placeholder="Confirm password"
                        name="re_password"
                        onChange={handleChange}
                        value={re_password}
                        required
                    />

                    <button className="btn btn-primary" type="submit" onClick={handleSubmit}>Sign Up</button>
                </form>
            </div>
        </>
  )
}

export default RegisterPage