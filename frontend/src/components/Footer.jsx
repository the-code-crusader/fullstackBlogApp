import React from 'react'
import Logo from '../img/bl.png'

const Footer = () => {
  return (
    <footer id='Footer'>
      <img src={Logo} alt='' />
      <span>
        Made by YN {new Date().getFullYear()}
        <a href=''>
          LINK
        </a>
      </span>
    </footer>
  )
}

export default Footer
