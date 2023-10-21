import React, { useEffect, useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import axios from 'axios'

const Home = () => {
  const [posts, setPosts] = useState([])
  //  const posts = [
    
  // ]

  const cat = useLocation().search

  const navigate = useNavigate()

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get(`/api/posts${cat}`)
        setPosts(res.data)
      } catch (err) {
        console.log(err)
      }
    }
    fetchData()
  }, [cat])

  const getText = html => {
    const doc = new DOMParser().parseFromString(html, 'text/html')
    return doc.body.textContent
  }

  return (
    <div className='home'>
      <div className='posts'>
        {posts.map(post => (
          <div className='post' key={post.id}>
            <div className='img'>
              <img src={post.imageUrl} alt='' />
            </div>
            <div className='content'>
              <Link className='link' to={`/post/${post.id}`}>
                <h1>{post.title}</h1>
              </Link>
              <p>{getText(post.desc).substring(0, 150) + '...'}</p>

              <button
                onClick={() => {
                  navigate(`/post/${post.id}`)
                }}
              >
                Read more
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default Home
