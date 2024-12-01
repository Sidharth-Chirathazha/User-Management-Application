import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import authService from "./authService";

const user = JSON.parse(localStorage.getItem("user"))
const admin = JSON.parse(localStorage.getItem("admin"))

const initialState = {

    user: user?user:null,
    admin: admin?admin:null,
    userInfo: {},
    usersList:[],
    adminData:{},
    isError: false,
    isSuccess: false,
    isLoading: false,
    message: "",
}


export const register = createAsyncThunk(

    "auth/register",
    async (userData,thunkAPI)=>{
        
        try {
            return await authService.register(userData)      
        } catch (error) {
            const message = (error.response && error.response.data && error.response.data.message)||
                            error.message || error.toString()
            return thunkAPI.rejectWithValue(message)
        }
        
    }
)

export const login = createAsyncThunk(

    "auth/login",
    async (userData,thunkAPI)=>{
        
        try {
            return await authService.login(userData)      
        } catch (error) {
            const message = (error.response && error.response.data && error.response.data.message)||
                            error.message || error.toString()
            return thunkAPI.rejectWithValue(message)
        }
        
    }
)

export const logout = createAsyncThunk(
    "auth/logout",
    async () => {
        authService.logout()
        localStorage.removeItem("user");
        localStorage.removeItem("admin");
        return null;
    }
)

export const activate = createAsyncThunk(

    "auth/activate",
    async (userData,thunkAPI)=>{
        
        try {
            return await authService.activate(userData)      
        } catch (error) {
            const message = (error.response && error.response.data && error.response.data.message)||
                            error.message || error.toString()
            return thunkAPI.rejectWithValue(message)
        }
        
    }
)

export const resetPassword = createAsyncThunk(

    "auth/resetPassword",
    async (userData,thunkAPI)=>{
        
        try {
            return await authService.resetPassword(userData)      
        } catch (error) {
            const message = (error.response && error.response.data && error.response.data.message)||
                            error.message || error.toString()
            return thunkAPI.rejectWithValue(message)
        }
        
    }
)

export const resetPasswordConfirm = createAsyncThunk(

    "auth/resetPasswordConfirm",
    async (userData,thunkAPI)=>{
        
        try {
            return await authService.resetPasswordConfirm(userData)      
        } catch (error) {
            const message = (error.response && error.response.data && error.response.data.message)||
                            error.message || error.toString()
            return thunkAPI.rejectWithValue(message)
        }
        
    }
)

export const getUserInfo = createAsyncThunk(
    "auth/getUserInfo",
    async (_, thunkAPI) => {
        try {
            const accessToken = thunkAPI.getState().auth.user.access
            return await authService.getUserInfo(accessToken)
        } catch (error) {
            const message = (error.response && error.response.data
                && error.response.data.message) ||
                error.message || error.toString()

            return thunkAPI.rejectWithValue(message)
        }
    }
)

export const updateProfile = createAsyncThunk(
    'auth/updateProfile',
    async ({userData, isAdmin, userId}, thunkAPI) =>{

        let token;
        // Get the correct token based on the 'isAdmin' flag
        if (isAdmin) {
        // Admin token (assuming it's stored in localStorage as 'admin')
            token = JSON.parse(localStorage.getItem('admin'))?.access;
        } else {
        // User token (assuming it's stored in localStorage as 'user')
            token = JSON.parse(localStorage.getItem('user'))?.access;
        }

        if(token){
            try {
                console.log(userData);
                if (userId === undefined){
                    return await authService.updateProfile(userData,token);
                }else{
                    return await authService.updateProfile(userData,token,userId);
                }
                
            } catch (error) {
                const message = (error.response && error.response.data && error.response.data.message) ||
                            error.message ||
                            error.toString();
                return thunkAPI.rejectWithValue(message);
            }
        }else{
            return thunkAPI.rejectWithValue('No token available');
        }
    }
);

export const adminLogin = createAsyncThunk(
    "auth/adminLogin",
    async (adminData, thunkAPI)=>{
        try {
            return await authService.adminLogin(adminData)
        } catch (error) {
            const message =
                (error.response && error.response.data && error.response.data.detail) ||
                error.message ||
                error.toString();
            return thunkAPI.rejectWithValue(message);
        }
    }
)

export const fetchUsers = createAsyncThunk(
    "auth/fetchUsers",
    async (searchQuery = "", thunkAPI)=>{
        try {
            const token = thunkAPI.getState().auth.admin.access
            console.log("Token during search:", token);
            return await authService.fetchUsers(token, searchQuery)
        } catch (error) {
            const message =
                (error.response && error.response.data && error.response.data.detail) ||
                error.message ||
                error.toString();
            return thunkAPI.rejectWithValue(message);
        }
    }
)

export const deleteUser = createAsyncThunk(
    "auth/deleteUser",
    async (userId, thunkAPI)=>{
        try {
            const token = thunkAPI.getState().auth.admin.access
            return await authService.deleteUser(userId, token)
        } catch (error) {
            const message =
                (error.response && error.response.data && error.response.data.detail) ||
                error.message ||
                error.toString();
            return thunkAPI.rejectWithValue(message);
        }
    }
)

export const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers:{
        reset: (state)=>{
            state.isLoading = false
            state.isError = false
            state.isSuccess = false
            state.message = false
        }
    },

    extraReducers:(builder)=>{
        builder
        .addCase(register.pending, (state)=>{
            state.isLoading = true
        })
        .addCase(register.fulfilled, (state,action)=>{
            state.isLoading = false
            state.isSuccess = true
            state.user = action.payload
        })
        .addCase(register.rejected, (state,action)=>{
            state.isLoading = false
            state.isSuccess = false
            state.isError = true
            state.message = action.payload
            state.user = null
        })
        .addCase(login.pending, (state)=>{
            state.isLoading = true
        })
        .addCase(login.fulfilled, (state,action)=>{
            state.isLoading = false
            state.isSuccess = true
            state.user = action.payload
            state.userInfo = action.payload
        })
        .addCase(login.rejected, (state,action)=>{
            state.isLoading = false
            state.isSuccess = false
            state.isError = true
            state.message = action.payload
            state.user = null
        })
        .addCase(logout.fulfilled, (state)=>{
            state.user = null
            state.admin = null
        })
        .addCase(activate.pending, (state)=>{
            state.isLoading = true
        })
        .addCase(activate.fulfilled, (state,action)=>{
            state.isLoading = false
            state.isSuccess = true
            state.user = action.payload
        })
        .addCase(activate.rejected, (state, action) => {
            state.isLoading = false
            state.isSuccess = false
            state.isError = true
            state.message = action.payload
            state.user = null
        })
        .addCase(resetPassword.pending, (state) => {
            state.isLoading = true
        })
        .addCase(resetPassword.fulfilled, (state) => {
            state.isLoading = false
            state.isSuccess = true
        })
        .addCase(resetPassword.rejected, (state, action) => {
            state.isLoading = false
            state.isSuccess = false
            state.isError = true
            state.message = action.payload
            state.user = null
        })
        .addCase(resetPasswordConfirm.pending, (state) => {
            state.isLoading = true
        })
        .addCase(resetPasswordConfirm.fulfilled, (state) => {
            state.isLoading = false
            state.isSuccess = true
        })
        .addCase(resetPasswordConfirm.rejected, (state, action) => {
            state.isLoading = false
            state.isSuccess = false
            state.isError = true
            state.message = action.payload
            state.user = null
        })
        .addCase(getUserInfo.fulfilled, (state, action) => {
            state.userInfo = action.payload
        })
        .addCase(updateProfile.pending, (state) => {
            state.isLoading = true;
        })
        .addCase(updateProfile.fulfilled, (state, action) => {
            state.isLoading = false;
            state.isSuccess = true;
            state.userInfo = action.payload;

            // Update user in usersList if it exists
            // if (state.usersList) {
            //     state.usersList = state.usersList.map(user =>
            //         user.id === action.payload.id ? action.payload : user
            //     );
            // }
            state.message = 'Profile updated successfully';
        })
        .addCase(updateProfile.rejected, (state, action) => {
            state.isLoading = false;
            state.isError = true;
            state.message = action.payload;
        })
        .addCase(adminLogin.pending, (state) => {
            state.isLoading = true;
        })
        .addCase(adminLogin.fulfilled, (state, action) => {
            state.isLoading = false;
            state.isSuccess = true;
            state.admin = action.payload; // Set admin info
        })
        .addCase(adminLogin.rejected, (state, action) => {
            state.isLoading = false;
            state.isError = true;
            state.message = action.payload;
        })
        .addCase(fetchUsers.pending, (state) => {
            state.isLoading = true;
        })
        .addCase(fetchUsers.fulfilled, (state, action) => {
            state.isLoading = false;
            state.isSuccess = true;
            state.usersList = action.payload.users;
            state.adminData = action.payload.adminData;
            // localStorage.setItem("admin", JSON.stringify(action.payload.admin));
        })
        .addCase(fetchUsers.rejected, (state, action) => {
            state.isLoading = false;
            state.isError = true;
            state.message = action.payload;
        })
        .addCase(deleteUser.pending, (state) => {
            state.isLoading = true;
        })
        .addCase(deleteUser.fulfilled, (state, action) => {
            state.isLoading = false;
            state.usersList = state.usersList.filter(
                (user) => user.id !== action.meta.arg
            );
            state.message = action.payload.detail;
        })
        .addCase(deleteUser.rejected, (state, action) => {
            state.isLoading = false;
            state.isError = true;
            state.message = action.payload;
        });
    }
})


export const { reset } = authSlice.actions
export default authSlice.reducer