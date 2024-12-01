import React, { useEffect, useState } from 'react'
import '../adminPages/AdminDashboard.css'
import { Plus, Edit, Trash2, Camera } from 'lucide-react';
import { useSelector, useDispatch } from "react-redux";
import { deleteUser, fetchUsers, logout, register, reset, updateProfile } from '../features/auth/authSlice';
import { toast } from 'react-toastify';
import Spinner from '../components/Spinner';
import { useNavigate } from 'react-router-dom';

  
  const AdminDashboard = () => {
    
    const {usersList,admin, adminData, isLoading, isError, isSuccess, message} = useSelector((state)=>state.auth)

    const dispatch = useDispatch()
    const navigate = useNavigate()

    const [searchQuery, setSearchQuery] = useState("")

    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);

    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [isActive, setIsActive] = useState(false);
    const [profileImage, setProfileImage] = useState(null);
    const [formData,setFormData] = useState({
      "first_name": "",
      "last_name": "",
      "email": "",
      "password": "",
      "re_password": "",
    })

    const { first_name, last_name, email, password, re_password } = formData


    //Add User Modal Functionalities
    const handleAddUserChange = (e)=>{
        setFormData((prev)=>({
          ...prev,
          [e.target.name]:e.target.value
        })
       )
    }

    const handleAddUserSubmit = (e)=>{
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
        dispatch(register(userData))
          .unwrap()
          .then((res) => {
            toast.success(res.detail);
            setIsAddModalOpen(false); // Close the modal
          })
          .catch((error) => {
            toast.error(error.message);
          });
      }
    }


    //Edit User Modal Functionalities

    const openEditModal = (user) => {
      
      setIsEditModalOpen(true); // Open the modal
      setSelectedUser(user); // Set the selected user
      setFirstName(user.first_name || ''); // Prefill first name
      setLastName(user.last_name || '');   // Prefill last name
      setIsActive(user.is_active || false); // Prefill user status
      setProfileImage(null); // Reset profile image input
    };

    const handleFirstNameChange = (e) => setFirstName(e.target.value);
    const handleLastNameChange = (e) => setLastName(e.target.value);
    const handleActiveChange = (e) => setIsActive(e.target.checked);
    const handleProfileImageChange = (e) => setProfileImage(e.target.files[0]);

    const handleEditSubmit = (e)=>{
      e.preventDefault()

      const updateData = {
        first_name: firstName,
        last_name: lastName,
        is_active: isActive
      }

      if (profileImage){
        updateData.profile_picture = profileImage
      }
      console.log(updateData);
      
      dispatch(updateProfile({ userData: updateData, isAdmin: true, userId: selectedUser?.id }))
      .unwrap()
      .then((res) => {
        toast.success("User updated successfully");
        setIsEditModalOpen(false);
        setFirstName('');
        setLastName('');
        setIsActive(false);
        setProfileImage(null);
      })
      .catch((error) => {
        toast.error(error.message);
      });
      
    }


    //Delete User Modal Functionalities
    const handleDeleteUser = () => {
      dispatch(deleteUser(selectedUser?.id))
          .unwrap()
          .then((res) => {
              toast.success(res.detail);
              dispatch(fetchUsers());
          })
          .catch((error) => {
              toast.error(error);
          });
      setIsDeleteModalOpen(false);
    };


    //Clearing search query on cancel
    const handleClearSearch = ()=>{
      setSearchQuery("")
      dispatch(fetchUsers())
    }

    if (!admin){
      dispatch(logout)
    }

   

    const getFullImageUrl = (path) => {
      if (!path) return null;
      const baseUrl = "http://127.0.0.1:8000"; // Your backend's base URL
      return path ? `${baseUrl}${path}?t=${new Date().getTime()}` : null;
    }

    

    useEffect(()=>{

      if (isError) {
        toast.error(message);  // Only show the error when it occurs
      }
    
      if (isSuccess) {
        toast.success("Changes made successfully");  // Only show success when it occurs
      }
      dispatch(fetchUsers(searchQuery))

      return () => {
        dispatch(reset());
    };
     
    },[dispatch,isError,message,searchQuery])
  
    return (
      <div className="admin-dashboard__container">
        <div className="admin-dashboard__header">
          <div className="admin-dashboard__welcome">
            <h1>Welcome, {adminData?.first_name}</h1>
            <p>Here's an overview of your users</p>
          </div>

          {isLoading && <Spinner />}
          
          <button 
            className="admin-dashboard__add-btn"
            onClick={() => setIsAddModalOpen(true)}
          >
            <Plus /> Add User
          </button>
        </div>

        <div className="admin-dashboard__search">
          <input 
            type="text" 
            placeholder="Search by name..."
            value={searchQuery}
            onChange={(e)=>setSearchQuery(e.target.value)}
            
          />
          <button 
            className="admin-dashboard__search-clear-btn"
            onClick={handleClearSearch}
            
          >
            Clear Search
          </button>
        </div>
  
        <div className="admin-dashboard__users-table">
          <table>
            <thead>
              <tr>
                <th>Profile</th>
                <th>First Name</th>
                <th>Last Name</th>
                <th>Email</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {usersList.map((user) => (
                <tr key={user.id}>
                  <td>
                    <img 
                      src={getFullImageUrl(user?.profile_picture)} 
                      alt="Profile" 
                      className="admin-user__profile-pic" 
                    />
                  </td>
                  <td>{user?.first_name}</td>
                  <td>{user?.last_name}</td>
                  <td>{user?.email}</td>
                  <td>{user?.is_active?"Active":"Inactive"}</td>
                  <td>
                    <div className="admin-user__actions">
                      <button 
                        className="admin-user__edit-btn"
                        onClick={() => {
                          openEditModal(user);
                        }}
                      >
                        <Edit />
                      </button>
                      <button 
                        className="admin-user__delete-btn"
                        onClick={() => {
                          setSelectedUser(user);
                          setIsDeleteModalOpen(true);
                        }}
                      >
                        <Trash2 />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
  
        {/* Add User Modal */}
        {isAddModalOpen && (
          <div className="admin-modal__overlay">
            <div className="admin-modal__container">
              <div className="admin-modal__header">
                <h2>Add New User</h2>
                <button 
                  className="admin-modal__close"
                  onClick={() => setIsAddModalOpen(false)}
                >
                  &times;
                </button>
              </div>
              <form className="admin-modal__form" onSubmit={handleAddUserSubmit}>
                <input 
                  type="text" 
                  placeholder="First Name" 
                  className="admin-auth__input"
                  name='first_name'
                  value={first_name}
                  onChange={handleAddUserChange} 
                />
                <input 
                  type="text" 
                  placeholder="Last Name" 
                  className="admin-auth__input"
                  name='last_name'
                  value={last_name}
                  onChange={handleAddUserChange} 
                />
                <input 
                  type="email" 
                  placeholder="Email Address" 
                  className="admin-auth__input"
                  name='email'
                  value={email}
                  onChange={handleAddUserChange} 
                />
                <input 
                  type="password" 
                  placeholder="Password" 
                  className="admin-auth__input"
                  name='password'
                  value={password}
                  onChange={handleAddUserChange} 
                />
                <input 
                  type="password" 
                  placeholder="Re-enter Password" 
                  className="admin-auth__input"
                  name='re_password'
                  value={re_password}
                  onChange={handleAddUserChange} 
                />
                <button 
                  type="submit" 
                  className="admin-btn-primary"
                >
                  Add User
                </button>
              </form>
            </div>
          </div>
        )}
  
        {/* Edit User Modal */}
        {isEditModalOpen && (
          <div className="admin-modal__overlay">
          <div className="admin-modal__container">
            <div className="admin-modal__header">
              <h2>Edit User</h2>
              <button 
                className="admin-modal__close"
                onClick={() => setIsEditModalOpen(false)}
              >
                &times;
              </button>
            </div>
            <form className="admin-modal__form" onSubmit={handleEditSubmit}>
              <div className="admin-profile__upload">
                <img 
                  src={getFullImageUrl(selectedUser?.profile_picture)} 
                  alt="Profile" 
                  className="admin-profile__pic" 
                />
                <input 
                  type="file" 
                  id="profile-upload" 
                  className="admin-profile__upload-input" 
                  accept="image/*"
                  onChange={handleProfileImageChange}
                  name="profile_upload"
                />
                <label htmlFor="profile-upload" className="admin-profile__upload-btn">
                  <Camera />
                </label>
              </div>
              <input 
                type="text" 
                placeholder="First Name" 
                className="admin-auth__input"
                value={firstName}
                onChange={handleFirstNameChange} 
                name='first_name'
              />
              <input 
                type="text" 
                placeholder="Last Name" 
                className="admin-auth__input"
                value={lastName}
                onChange={handleLastNameChange}
                name='last_name' 
              />
              <div className="admin-user-status__toggle">
                <span>Active Status</span>
                <label className="admin-status-toggle-switch">
                  <input 
                    type="checkbox" 
                    defaultChecked={selectedUser?.is_active}
                    onChange={handleActiveChange}
                  />
                  <span className="admin-status-slider"></span>
                </label>
              </div>
              <button 
                type="submit" 
                className="admin-btn-primary"
              >
                Update User
              </button>
            </form>
          </div>
        </div>
        )}
  
        {/* Delete Confirmation Modal */}
        {isDeleteModalOpen && (
          <div className="admin-modal__overlay">
            <div className="admin-modal__container admin-modal__confirm">
              <div className="admin-modal__header">
                <h2>Confirm Delete</h2>
              </div>
              <p>Are you sure you want to delete this user?</p>
              <div className="admin-modal__actions">
                <button 
                  className="admin-btn-secondary"
                  onClick={() => setIsDeleteModalOpen(false)}
                >
                  Cancel
                </button>
                <button 
                  className="admin-btn-danger"
                  onClick={handleDeleteUser}
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  };
  
  export default AdminDashboard;