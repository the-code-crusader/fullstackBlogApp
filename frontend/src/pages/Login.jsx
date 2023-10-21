import { React, useContext, useState } from 'react'
import { Link, Navigate, useNavigate } from 'react-router-dom'
import axios from 'axios'
import { AuthContext } from '../context/authContext'
import Logo from '../img/bl.png'

const Login = () => {
  const [inputs, setInputs] = useState({
    username: '',
    password: ''
  })

  const navigate = useNavigate()

  const { login } = useContext(AuthContext)

  const [err, setError] = useState(null)

  const handleChange = e => {
    const name = e.target.name
    const val = e.target.value
    setInputs(prev => ({
      ...prev,
      [name]: val
    }))
  }

  const handleSubmit = async e => {
    if (inputs.username === "") {
      setError("Please enter a username");
      return;
    }
    if (inputs.password === "") {
      setError("Please enter a password");
      return;
    }
    e.preventDefault()
    try {
      await login(inputs)
      navigate('/')
    } catch (error) {
      console.log(error)
      setError(error.response.data)
    }
  }
  return (
    <div className='auth'>
      <h1>Login</h1>
      <form method='post'>
        <input
          name='username'
          type='text'
          placeholder='Username'
          onChange={handleChange}
          autocomplete="off"
        />
        <input
          name='password'
          type='password'
          placeholder='Password'
          onChange={handleChange}
          autocomplete="off"
        />

        <button type='button' className='butt' onClick={handleSubmit}>
          Login
        </button>
        {err && <p>{err}</p>}
        <span>
          Don't have an account?{' '}
          <Link to='/register' className='link loginBut'>
            Register
          </Link>
        </span>
        <div className='logo'>
          <Link to='/'>
            <img src={Logo} alt='' />
          </Link>
        </div>
      </form>
    </div>
  )
}

export default Login
