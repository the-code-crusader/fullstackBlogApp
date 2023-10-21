import { db } from '../db.js'
import bcrypt from 'bcrypt'
import cookieParser from 'cookie-parser'
import jwt from 'jsonwebtoken'

export const register = (req, res) => {
  //CHECK EXISTING USER
  const q = 'SELECT * FROM users WHERE email = ? OR username = ?'

  db.query(q, [req.body.email, req.body.username], (err, data) => {
    if (err) return res.status(500).json(err)
    if (data.length) return res.status(409).json('User already exists!')

    //Hash the password and create a user
    const saltR = 10
    let hash1 = ''
    bcrypt.hash(req.body.password, saltR, (err, hash) => {
      if (err) {
        res.send(500, err)
      } else {
        const q = 'INSERT INTO users(`username`,`email`,`password`) VALUES (?)'
        const values = [req.body.username, req.body.email, hash.toString()]

        db.query(q, [values], (err, hash) => {
          if (hash === '') return res.status(500).json('Hashing failed')
          if (err) return res.status(500).json(err)
          return res.status(200).json('User has been created.')
        })
      }
    })
  })
}

export const login = (req, res) => {
  const q = 'SELECT * FROM users WHERE username = ?'

  db.query(q, [req.body.username], (err, data) => {
    if (err) return res.status(500).json(err)
    if (data.length === 0) return res.status(404).json('User not found')

    // //Check password
    // bcrypt.compare(req.body.password, data[0].password, function (err, dat) {
    //   if (err) {
    //     // handle error
    //     return res.status(500).json(err)
    //   }
    //   if (!dat) {
    //     return res.status(400).json('Wrong username or password!')
    //   } else if (dat) {
    //     // Send JWT

    //     const token = jwt.sign({ id: data[0].id }, 'jwtkey')
    //     const { password, ...other } = data[0]

    //     res
    //       .cookie('access_token', token, {
    //         httpOnly: true
    //       })
    //       .status(200)
    //       .json(other)
    //   }
    // })
    //Check password
    const isPasswordCorrect = bcrypt.compareSync(
      req.body.password,
      data[0].password
    )

    if (!isPasswordCorrect)
      return res.status(400).json('Wrong username or password!')

    const token = jwt.sign({ id: data[0].id }, 'jwtkey')
    const { password, ...other } = data[0]

    res
      .cookie('access_token', token, {
        httpOnly: true
      })
      .status(200)
      .json(other)
  })
}

export const logout = (req, res) => {
  res
    .clearCookie('access_token', {
      sameSite: 'none',
      secure: true
    })
    .status(200)
    .json('User logged out')
}

export const updateUsername = (req, res) => {


  const token = req.cookies.access_token
  if (!token) return res.status(401).json('Not authorized')

  const query = 'UPDATE users SET username = ? WHERE id = ?'

  const uid = req.params.id

  const q = 'SELECT * FROM users WHERE username = ?'

  db.query(q, [req.body.username], (err, data) => {
    if (err) return res.status(500).json(err)
    if (data.length) return res.status(409).json('User already exists!')

    db.query(query, [req.body.username, uid], (err, data) => {
      if (err) return res.status(500).json(err)
      return res.status(200).json('Succesfully udpated.')
    })
  })



}

export const updateEmail = (req, res) => {


  const token = req.cookies.access_token
  if (!token) return res.status(401).json('Not authorized')

  const query = 'UPDATE users SET email = ? WHERE id = ?'

  const uid = req.params.id

  const q = 'SELECT * FROM users WHERE email = ?'

  db.query(q, [req.body.email, req.body.username], (err, data) => {
    if (err) return res.status(500).json(err)
    if (data.length) return res.status(409).json('User already exists!')

    db.query(query, [req.body.email, uid], (err, data) => {
      if (err) return res.status(500).json(err)
      return res.status(200).json('Succesfully udpated.')
    })
  })



}
