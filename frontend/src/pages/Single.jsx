import React, { useContext, useEffect, useState } from 'react'
import { Link, Navigate, useLocation, useNavigate } from 'react-router-dom'
import Delete from '../img/del.svg'
import Edit from '../img/edit.svg'
import Menu from '../components/Menu'
import Blank from '../img/blankpfp.jpg'
import { AuthContext } from './../context/authContext'
import axios from 'axios'
import moment from 'moment'
import DOMPurify from "dompurify";

const Single = () => {
  const getText = html => {
    const doc = new DOMParser().parseFromString(html, 'text/html')
    return doc.body.textContent
  }

  const [post, setPost] = useState({})

  const location = useLocation()

  const navigate = useNavigate()

  const postID = location.pathname.split('/')[2]

  const { currentUser } = useContext(AuthContext)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get(`/api/posts/${postID}`)
        setPost(res.data)
      } catch (err) {
        console.log(err)
      }
    }
    fetchData()
  }, [postID])

  const handleDelete = async () => {
    try {
      const res = await axios.delete(`/api/posts/${postID}`)
      navigate('/')
    } catch (err) {
      console.log(err)
    }
  }

  return (
    <div className='single'>
      <div className='content'>
        <img src={post.imageUrl} alt='' />

        <div className='user'>
          {post.userImg ? (
            <img src={`../upload/${post.userImg}`} alt='' />
          ) : (
            <img src={Blank} alt='' />
          )}

          <div className='info'>
            <span>
              <b>{post.username}</b>
            </span>
            <p>Posted {moment(post.date).fromNow()}</p>
          </div>
          {currentUser?.username === post.username && (
            <div className='edit'>
              <Link to={`/write?edit=2`} state={post}>
                <img src={Edit} alt='' />
              </Link>

              <img src={Delete} onClick={handleDelete} alt='' />
            </div>
          )}
        </div>
        <h1>{post.title}</h1>
        <p className='single-p'dangerouslySetInnerHTML={{
            __html: DOMPurify.sanitize(post.desc),
          }}></p>
      </div>
      <Menu cat={post.cat} />
    </div>
  )
}

export default Single
