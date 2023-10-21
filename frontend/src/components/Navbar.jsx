import React, { useContext } from 'react'
import Logo from '../img/bl.png'
import { Link } from 'react-router-dom'
import { AuthContext } from '../context/authContext'
import Blank from '../img/blankpfp.jpg'

const Navbar = () => {
  const { currentUser, logout } = useContext(AuthContext)

  return (
    <div className='navbar'>
      <div className='container'>
        <div className='logo'>
          <Link to='/'>
            <img src={Logo} alt='' />
          </Link>
        </div>
        <div className='links'>
          <div className='links links2'>
            <Link className='navbar-link' to='/?cat=lifestyle'>
              <h6>LIFESTYLE</h6>
            </Link>
            <Link className='navbar-link' to='/?cat=art'>
              <h6>ART</h6>
            </Link>
            <Link className='navbar-link' to='/?cat=science'>
              <h6>SCIENCE</h6>
            </Link>
            <Link className='navbar-link' to='/?cat=technology'>
              <h6>TECHNOLOGY</h6>
            </Link>
            <Link className='navbar-link' to='/?cat=entertainment'>
              <h6>ENTERTAINMENT</h6>
            </Link>
          </div>

          <Link to={'/account'} className='link'>
          <span className='user-span'>
            {currentUser &&
              (currentUser.img ? (
                <img src={`../upload/${currentUser.img}`} alt='' />
              ) : (
                <img src={Blank} alt='' />
              ))}

            <p>{currentUser?.username}</p>
          </span>
          </Link>
          <span className='write-but'>
            <Link to={currentUser ? '/write' : '/login'} className='write-link'>
              {currentUser ? 'Write' : 'Login'}
            </Link>
          </span>
          {currentUser && (
            <span className='logout-link' onClick={logout}>
              Logout
            </span>
          )}
        </div>
      </div>
    </div>
  )
}

export default Navbar
