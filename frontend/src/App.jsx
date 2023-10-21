import {
  createBrowserRouter,
  RouterProvider,
  Outlet,
  Route
} from 'react-router-dom'

import Register from './pages/Register'
import Login from './pages/Login'
import Navbar from './components/Navbar'
import Home from './pages/Home'
import Single from './pages/Single'
import Write from './pages/Write'
import Footer from './components/Footer'
import './style.scss'
import React, { useContext } from 'react'
import { AuthContext } from './context/authContext'
import Account from './pages/Account'

const Layout = () => {
  return (
    <>
      <Navbar />
      <Outlet />
    </>
  )
}

const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    children: [
      {
        path: '/',
        element: <Home />
      },
      {
        path: '/post/:id',
        element: <Single />
      },

      {
        path: '/write',
        element: <Write />
      },

      {
        path: '/account',
        element: <Account />
      }
    ]
  },
  {
    path: '/login',
    element: <Login />
  },
  {
    path: '/register',
    element: <Register />
  }
])

function App () {
  return (
    <div className='main'>
      <div className='app'>
        <div className='container' id='container'>
          <RouterProvider router={router} />
        </div>
      </div>
      <div className='feeter'>
        <Footer />
      </div>
    </div>
  )
}

export default App
