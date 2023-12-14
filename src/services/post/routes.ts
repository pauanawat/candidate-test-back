import { Router } from 'express'
import * as UserController from './controllers'
import userAuth from '../../middleware/user/auth'
const router: Router = Router()

router.get('/posts/:id', userAuth, UserController.getPostById)
// filter wite req.query ex. /posts?email=A&name=B
router.get('/posts', userAuth, UserController.getPosts)
router.post('/posts', userAuth, UserController.createPost)
router.put('/posts/:id', userAuth, UserController.updatePost)
router.patch('/posts/:id', userAuth, UserController.patchPost)
router.delete('/posts/:id', userAuth, UserController.deletePost)



export default router
