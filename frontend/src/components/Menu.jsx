import React, { useEffect, useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import axios from 'axios'

const Menu = ({ cat }) => {
  const [posts, setPosts] = useState([])

  const navigate = useNavigate()

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get(`/api/posts/?cat=${cat}`)
        setPosts(res.data.slice(0, 3))
      } catch (err) {
        console.log(err)
      }
    }
    fetchData()
  }, [cat])

  return (
    <div className='menu'>
      <h1>Other posts you may like</h1>
      {posts.map(post => (
        <div className='post' key={post.id}>
          <img src={post.imageUrl} alt=''></img>
          <h2>{post.title}</h2>
          <Link to={`/post/${post.id}`}><button>Read More</button></Link>
        </div>
      ))}
    </div>
  )
}

export default Menu
