import axios from 'axios'

const BACKEND_DOMAIN = "http://localhost:8000"

const REGISTER_URL = `${BACKEND_DOMAIN}/api/v1/auth/users/`
const LOGIN_URL = `${BACKEND_DOMAIN}/api/v1/auth/jwt/create/`
const ACTIVATE_URL = `${BACKEND_DOMAIN}/api/v1/auth/users/activation/`
const RESET_PASSWORD_URL = `${BACKEND_DOMAIN}/api/v1/auth/users/reset_password/`
const RESET_PASSWORD_CONFIRM_URL = `${BACKEND_DOMAIN}/api/v1/auth/users/reset_password_confirm/`
const GET_USER_INFO = `${BACKEND_DOMAIN}/api/v1/auth/profile/`
const UPDATE_PROFILE = `${BACKEND_DOMAIN}/api/v1/auth/profile/`;
const ADMIN_LOGIN_URL = `${BACKEND_DOMAIN}/api/v1/auth/admin/login/`;
const ADMIN_USERS_LIST_URL = `${BACKEND_DOMAIN}/api/v1/auth/admin/userslist/`;
const USER_DELETE_URL = `${BACKEND_DOMAIN}/api/v1/auth/admin/delete-user/`;

//Register User
const register = async (userData)=>{
    const config = {
        headers: {
            "Content-type" : "application/json"
        }
    }
    const response = await axios.post(REGISTER_URL, userData, config)
    return response.data
}

//Login User
const login = async (userData)=>{
    const config = {
        headers: {
            "Content-type": "application/json"
        }
    }
    const response = await axios.post(LOGIN_URL,userData,config)

    if (response.data){
        localStorage.setItem("user",JSON.stringify(response.data))
    }

    return response.data
}

//Logout
const logout = ()=>{
    return localStorage.removeItem("user")
}

//Activate user
const activate = async(userData)=>{
    const config = {
        headers:{
            "Content-type":"application/json"
        }
    }
    const response = await axios.post(ACTIVATE_URL,userData,config)

    return response.data
}

//Reset password
const resetPassword = async(userData)=>{
    const config = {
        headers:{
            "Content-type":"application/json"
        }
    }
    const response = await axios.post(RESET_PASSWORD_URL,userData,config)

    return response.data
}

//Reset password
const resetPasswordConfirm = async(userData)=>{
    const config = {
        headers:{
            "Content-type":"application/json"
        }
    }
    const response = await axios.post(RESET_PASSWORD_CONFIRM_URL,userData,config)

    return response.data
}

// Get User Info

const getUserInfo = async (accessToken) => {
    const config = {
        headers: {
            "Authorization": `Bearer ${accessToken}`
        }
    }

    const response = await axios.get(GET_USER_INFO, config)

    return response.data
}

//Update profile
const updateProfile = async (userData, token, userId=null)=>{
    const formData = new FormData()
    if (userData.first_name) formData.append('first_name',userData.first_name);
    if (userData.last_name) formData.append('last_name',userData.last_name);
    if (userData.profile_picture instanceof File) formData.append('profile_picture',userData.profile_picture);
    if (userData.is_active !== undefined) formData.append('is_active',userData.is_active);

    const config = {
        headers: {
            'Content-Type': 'multipart/form-data',
            'Authorization': `Bearer ${token}`,
        }
    };

    const url = userId ? `${UPDATE_PROFILE}${userId}/` : UPDATE_PROFILE;
    console.log(formData);
    
    try {
        const response = await axios.patch(url, formData, config);
        return response.data;
    } catch (error) {
        console.error('Error updating profile:', error);
        throw error; // Re-throw to handle it higher up if needed
    }
    
}

//Admin login
const adminLogin = async (adminData)=>{
    const config = {
        headers: {
            "Content-type": "application/json"
        }
    }
    const response = await axios.post(ADMIN_LOGIN_URL, adminData, config)
    if (response.data){
        localStorage.setItem("admin",JSON.stringify(response.data))
    }

    return response.data
}

//Fetch users
const fetchUsers = async (token, searchQuery = "")=>{
    const config = {
        headers: {
            Authorization: `Bearer ${token}`
        },
        params: {
            search: searchQuery, // Include the search query as a parameter
        },
    }
    const response = await axios.get(ADMIN_USERS_LIST_URL, config)
    return response.data
}

//Delete user
const deleteUser = async(userId, token)=>{
    const config = {
        headers: {
            Authorization: `Bearer ${token}`,
        }
    }
    const url = `${USER_DELETE_URL}${userId}/`
    const response = await axios.delete(url,config)
    return response.data
}





const authService = {
    register,
    login,
    logout,
    activate,
    resetPassword,
    resetPasswordConfirm,
    getUserInfo,
    updateProfile,
    adminLogin,
    fetchUsers,
    deleteUser
}

export default authService