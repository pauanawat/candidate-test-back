import { Router } from 'express'
import * as UserController from './controllers'
import basicAuth from '../../middleware/external_service/basicAuth'
import userAuth from '../../middleware/user/auth'
const router: Router = Router()

router.get('/checkHealth', async (_req, res, _next) => {
    const healthcheck = {
        uptime: process.uptime(),
        message: 'OK',
        timestamp: Date.now()
    };
    try {
        res.send(healthcheck);
    } catch (error) {
        healthcheck.message = error;
        res.status(503).send();
    }
})
router.post('/login', basicAuth, UserController.login)
router.get('/users/all', basicAuth, UserController.getAllUser)
router.get('/users/:id', userAuth, UserController.getUserById)
// filter wite req.query ex. /users?email=A&name=B
router.get('/users', userAuth, UserController.getUsers)
router.post('/users', userAuth, UserController.createUser)
router.put('/users/:id', userAuth, UserController.updateUser)
router.patch('/users/:id', userAuth, UserController.patchUser)
router.delete('/users/:id', userAuth, UserController.deleteUser)

export default router
