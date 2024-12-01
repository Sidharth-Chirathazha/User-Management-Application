import React, { useEffect, useState } from 'react'
import '../pages/styles/Dashboard.css'
import {  useDispatch, useSelector } from 'react-redux';
import { User, Camera } from 'lucide-react';
import { updateProfile } from '../features/auth/authSlice';
import { toast } from 'react-toastify';
import Spinner from '../components/Spinner';


const Dashboard = () => {

  const { userInfo, isLoading, isError, isSuccess, message } = useSelector((state) => state.auth);
  const dispatch = useDispatch();


  const [isEditing, setIsEditing] = useState(false)
  const [firstName, setFirstName] = useState(userInfo?.first_name || '')
  const [lastName, setLastName] = useState(userInfo?.last_name || '')
  const [profilePicture, setProfilePicture] = useState(null)

  const handleFileChange = (e)=>{
    const file = e.target.files[0]
    if (file){
      setProfilePicture(file)
      console.log(file);
      
    }
  }

  const handleSave = ()=>{
    const updateData = {first_name:firstName, last_name:lastName}

    if (profilePicture){
      updateData.profile_picture = profilePicture
    }
    console.log(updateData);
    
    dispatch(updateProfile({userData:updateData, isAdmin:false}))
    console.log(userInfo?.first_name)
    console.log(userInfo?.profile_picture)
    
  }

  const handleCancel = ()=>{
    setFirstName(userInfo?.first_name || '')
    setLastName(userInfo?.last_name || '')
    setProfilePicture(null)
    setIsEditing(false)
  }

  const getFullImageUrl = (path) => {
    if (!path) return null;
    const baseUrl = "http://127.0.0.1:8000"; // Your backend's base URL
    return path ? `${baseUrl}${path}?t=${new Date().getTime()}` : null;
  }

  useEffect(()=>{
    setFirstName(userInfo?.first_name || '')
    setLastName(userInfo?.last_name || '')
    setProfilePicture(userInfo?.profile_picture || null);

    if (isError){
      toast.error(message)
      console.log(message);
      
    }
    if (isSuccess){
      toast.success("Your details has been updated")
      setIsEditing(false)
    }
  },[userInfo, isError, isSuccess])



  return (
    <div className="dashboard-container">
    <div className="dashboard-card">
      <h1 className="dashboard-title">Welcome, {userInfo?.first_name || 'Guest'}</h1>
      {isLoading && <Spinner/>}
      
      <div className="profile-section">
        {/* Profile Picture */}
        <div className="profile-picture-container">
          <div className="profile-picture-placeholder">
            {userInfo?.profile_picture?
            (<img src={getFullImageUrl(userInfo?.profile_picture)} alt="Profile" className="profile-picture" />):
            (<User size={64} className="profile-picture-icon" />)
           }
          </div>
          {isEditing && (
              <div className="profile-picture-upload">
                <label htmlFor="profile-upload">
                  <Camera size={20} />
                  <input 
                    type="file" 
                    id="profile-upload"
                    accept="image/*"
                    className="hidden-file-input"
                    onChange={handleFileChange}
                  />
                </label>
              </div>
            )}
        </div>

        {/* User Information */}
        <div className="user-info-container">
          {isEditing ? (
            // Edit Mode
            <>
              <div className="form-group">
                <label>First Name</label>
                <input 
                  type="text"
                  value={firstName}
                  onChange={(e)=>setFirstName(e.target.value)}
                />
              </div>
              <div className="form-group">
                <label>Last Name</label>
                <input 
                  type="text"
                  value={lastName}
                  onChange={(e)=>setLastName(e.target.value)}

                />
              </div>
              
              {/* Action Buttons */}
              <div className="button-group">
                <button className="btn btn-primary" onClick={handleSave}>Save</button>
                <button className="btn btn-secondary" onClick={handleCancel}>Cancel</button>
              </div>
            </>
          ) : (
            // View Mode
            <>
              <div className="user-display">
                <p className="user-name">{userInfo?.first_name} {userInfo?.last_name}</p>
                <p className="user-email">{userInfo?.email}</p>
              </div>
              
              {/* Action Buttons */}
              <div className="button-group">
                <button 
                  className="btn btn-primary"
                  onClick={() => setIsEditing(true)}
                >
                  Edit Profile
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  </div>
  );
}

export default Dashboard