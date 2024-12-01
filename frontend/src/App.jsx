import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Nav from './components/Nav'
import HomePage from './pages/HomePage'
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'
import Dashboard from './pages/Dashboard'
import ActivatePage from './pages/ActivatePage'
import ResetPassword from './pages/ResetPassword'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import NotFoundPage from './pages/NotFoundPage'
import ResetPasswordConfirm from './pages/ResetPasswordConfirm'
import AdminLogin from './adminPages/AdminLogin'
import AdminDashboard from './adminPages/AdminDashboard'


function App() {
 

  return (
    <>
    <ToastContainer/>
    <Router>
      <Nav/>
      <Routes>
        <Route path='/' element={<HomePage/>}/>
        <Route path='/login' element={<LoginPage/>}/>
        <Route path='/register' element={<RegisterPage/>}/>
        <Route path='/activate/:uid/:token' element={<ActivatePage/>}/>
        <Route path='/reset-password' element={<ResetPassword/>}/>
        <Route path="/password/reset/confirm/:uid/:token" element={<ResetPasswordConfirm/>} />
        <Route path='/dashboard' element={<Dashboard/>}/>
        <Route path='*' element={<NotFoundPage/>}/>
        <Route path='/admin/login' element={<AdminLogin/>}/>
        <Route path='/admin/dashboard' element={<AdminDashboard/>}/>
      </Routes>
    </Router>
    </>
  )
}

export default App
