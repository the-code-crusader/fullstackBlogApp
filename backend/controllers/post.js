import { db } from '../db.js'
import jwt from 'jsonwebtoken'
import {
  S3Client,
  PutObjectCommand,
  GetObjectCommand
} from '@aws-sdk/client-s3'
import dotenv from 'dotenv'
import { getSignedUrl } from '@aws-sdk/s3-request-presigner'

const bucketName = process.env.BUCKET_NAME
const bucketRegion = process.env.BUCKET_REGION
const accessKey = process.env.ACCESS_KEY
const secretAccessKey = process.env.SECRET_ACCESS_KEY

const s3 = new S3Client({
  credentials: { accessKeyId: accessKey, secretAccessKey: secretAccessKey },
  region: bucketRegion
})

export const getPost = async (req, res) => {
  const q = req.query.cat
    ? 'SELECT * FROM posts WHERE cat=?'
    : 'SELECT * FROM posts'

  db.query(q, [req.query.cat], async (err, data) => {
    if (err) return res.status(500).send(err)

    for (const post of data) {
      const getObjectParams = {
        Bucket: bucketName,
        Key: post.img
      }
      const command = new GetObjectCommand(getObjectParams)
      const url = await getSignedUrl(s3, command, { expiresIn: 3600 })
      post.imageUrl = url
    }
    
    return res.status(200).json(data)
  })
}

export const getPostOne = async (req, res) => {
  const q =
    'SELECT p.id, `username`, `title`, `desc`, p.img, u.img AS userImg, u.id AS uid, `cat`,`date` FROM users u JOIN posts p ON u.id = p.uid WHERE p.id = ?'

  db.query(q, [req.params.id], async (err, data) => {
    if (err) return res.status(500).json(err)


    const getObjectParams = {
      Bucket: bucketName,
      Key: data[0].img
    }

    const command = new GetObjectCommand(getObjectParams)


    const url = await getSignedUrl(s3, command, { expiresIn: 3600 })
    data[0].imageUrl = url



    return res.status(200).json(data[0])
  })
}

export const addPost = (req, res) => {

  const token = req.cookies.access_token
  if (!token) return res.status(401).json('Not authorized')

  jwt.verify(token, 'jwtkey', (err, userInfo) => {
    if (err) return res.status(403).json('invalid token ')

    const q =
      'INSERT INTO posts (`title`, `desc`, `img`,`cat`, `date`,`uid`) VALUES (?)'

    const values = [
      req.body.title,
      req.body.desc,
      req.body.img,
      req.body.cat,
      req.body.date,
      userInfo.id
    ]

    db.query(q, [values], (err, data) => {
      if (err) return res.status(401).json(err)
      return res.status(200).json('Post created')
    })
  })
}

export const deletePost = (req, res) => {
  const token = req.cookies.access_token
  if (!token) return res.status(401).json('Not authorized')

  jwt.verify(token, 'jwtkey', (err, userInfo) => {
    if (err) return res.status(403).json('invalid token ')

    const postID = req.params.id
    const q = 'DELETE FROM posts WHERE `id` = ? AND `uid` = ?'
    db.query(q, [postID, userInfo.id], (err, data) => {
      if (err) return res.status(403).json('Cannot delete')

      return res.json('Post deleted')
    })
  })
}

export const updatePost = (req, res) => {
  const token = req.cookies.access_token
  if (!token) return res.status(401).json('Not authorized')

  jwt.verify(token, 'jwtkey', (err, userInfo) => {
    if (err) return res.status(403).json('invalid token ')

    const postID = req.params.id


    const q =
      'UPDATE posts SET `title`=?, `desc`=?, `cat`=? WHERE `id` = ? AND `uid` = ?'

    const values = [req.body.title, req.body.desc, req.body.cat]

    db.query(q, [...values, postID, userInfo.id], (err, data) => {
      if (err) return res.status(401).json(err)
      return res.status(200).json('Post created')
    })
  })
}
