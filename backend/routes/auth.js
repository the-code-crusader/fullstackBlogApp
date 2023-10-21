import express from 'express'
import { register, login, logout, updateUsername, updateEmail } from '../controllers/auth.js'

const router = express.Router()

router.post('/register', register)
router.post('/login', login)
router.post('/logout', logout)
router.put('/update/username/:id', updateUsername)
router.put('/update/email/:id', updateEmail)

export default router
