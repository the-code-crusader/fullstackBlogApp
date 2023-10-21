import express from 'express'
import {
  addPost,
  deletePost,
  getPost,
  getPostOne,
  updatePost
} from '../controllers/post.js'

const router = express.Router()

router.get('/', getPost)
router.get('/:id', getPostOne)
router.post('/', addPost)
router.delete('/:id', deletePost)
router.put('/:id', updatePost)

export default router
