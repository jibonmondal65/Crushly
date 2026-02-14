import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import {
  createBrowserRouter,
  RouterProvider,
  Route,
  createRoutesFromElements
} from "react-router-dom";
import Layout from './Layout.jsx'
import Home from './components/pages/Home.jsx'
import Login from './components/pages/Login.jsx'
import Register from './components/pages/Register.jsx';
import Profile from './components/pages/Profile.jsx';
import AddCrush from './components/pages/AddCrush.jsx';
import PendingMatches from './components/pages/PendingMatches.jsx';
import FinalMatches from './components/pages/FinalMatches.jsx';
import VerifyOTP from './components/pages/VerifyOTP.jsx';
import ForgotPassword from './components/pages/ForgotPassword.jsx';
import ResetPassword from './components/pages/ResetPassword.jsx';
import { Provider } from 'react-redux';
import store from './store/store.js';


const router = createBrowserRouter(
  createRoutesFromElements(
    <>
      <Route path='/' element={<Layout />}>
        <Route index element={<Home />} />
        <Route path='login' element={<Login />} />
        <Route path='register' element={<Register />} />
        <Route path='profile' element={<Profile />} />
        <Route path='crush' element={<AddCrush />} />
        <Route path='pending' element={<PendingMatches />} />
        <Route path='final' element={<FinalMatches />} />
      </Route>

      <Route path='verify-otp' element={<VerifyOTP />} />
      <Route path='forgot-password' element={<ForgotPassword />} />
      <Route path='reset-password' element={<ResetPassword />} />
    </>
  )
)

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Provider store={store}>
      <RouterProvider router={router} />
    </Provider>
  </React.StrictMode>,
)
