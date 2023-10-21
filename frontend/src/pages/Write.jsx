import React, { useContext, useState } from 'react'
import { Link, Navigate, useLocation, useNavigate } from 'react-router-dom'
import ReactQuill from 'react-quill'
import 'react-quill/dist/quill.snow.css'
import axios from 'axios'
import moment from 'moment'
import { AuthContext } from '../context/authContext'
import Login from './Login'
import DOMPurify from "dompurify";

const Write = () => {
  const navigate = useNavigate()
  const { currentUser } = useContext(AuthContext)

  const state = useLocation().state


  const [value, setValue] = useState(state?.desc || '')
  const [title, setTitle] = useState(state?.title || '')
  const [file, setFile] = useState(null)
  const [cat, setCat] = useState(state?.cat || '')
  const [imgName, setImgName] = useState('')
  const [err, setErr] = useState(null)

  const upload = async () => {
    try {
      const formData = new FormData()
      formData.append('file', file)
      const res = await axios.post('/api/upload', formData)
      return res.data
    } catch (err) {
      console.log(err)
    }
  }

  const handleClick = async e => {
    e.preventDefault()

    if (!currentUser) {
      navigate('/login')
      return
    }

    if (title === '' || value === '') {
      setErr("Please do not leave title/content blank.")
      return
    }

    const imgURL = file? await upload() : '1683786093748default.jpeg'
    try {
      state
        ? await axios.put(`/api/posts/${state.id}`, {
            title,
            desc: value,
            cat
          
          })
        : await axios.post(`/api/posts/`, {
            title,
            desc: value,
            cat,
            img: imgURL,
            date: moment(Date.now()).format('YYYY-MM-DD HH:mm:ss')
          })

      navigate('/')
    } catch (err) {
      console.log(err)
    }
  }

  return (
    <div className='write'>
      <div className='content'>
        <input
          type='text'
          placeholder='Title'
          value={title}
          onChange={e => setTitle(e.target.value)}
          autocomplete="off"
        />
        <div className='editorContainer'>
          <ReactQuill
            className='editor'
            theme='snow'
            value={value}
            onChange={setValue}
          />
        </div>
      </div>
      <div className='menu'>
        <div className='item'>
          <h1>Publish</h1>
          <span>
            <b>Status: </b> Draft
          </span>
          <span>
            <b>Visibility: </b> Public
          </span>
          {state? '' : <div><input
            style={{ display: 'none' }}
            type='file'
            id='file'
            name=''
            onChange={e => {
              setFile(e.target.files[0])
              setImgName(e.target.files[0].name)
            }}
          />
          <label className='upload' htmlFor='file'>
            Upload image
          </label></div>}
          <label>{imgName !== '' ? imgName : ''}</label>
          <div className='buttons'>
            <button onClick={handleClick}>{state? 'Update' : 'Publish'}</button>
          </div>
          {err && <p className='error'>{err}</p>}
        </div>
        <div className='item'>
          <h1>Category</h1>
          <div className='category'>
            <input
              type='radio'
              checked={cat === 'lifestyle'}
              name='cat'
              value='lifestyle'
              id='lifestyle'
              onChange={e => setCat(e.target.value)}
            />
            <label htmlFor='art'>Lifestyle</label>
          </div>

          <div className='category'>
            <input
              type='radio'
              checked={cat === 'art'}
              name='cat'
              value='art'
              id='art'
              onChange={e => setCat(e.target.value)}
            />
            <label htmlFor='art'>Art</label>
          </div>

          <div className='category'>
            <input
              type='radio'
              checked={cat === 'science'}
              name='cat'
              value='science'
              id='science'
              onChange={e => setCat(e.target.value)}
            />
            <label htmlFor='art'>Science</label>
          </div>

          <div className='category'>
            <input
              type='radio'
              checked={cat === 'technology'}
              name='cat'
              value='technology'
              id='technology'
              onChange={e => setCat(e.target.value)}
            />
            <label htmlFor='art'>Technology</label>
          </div>
          <div className='category'>
            <input
              type='radio'
              checked={cat === 'entertainment'}
              name='cat'
              value='entertainment'
              id='entertainment'
              onChange={e => setCat(e.target.value)}
            />
            <label htmlFor='art'>Entertainment</label>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Write
