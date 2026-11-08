import express from 'express'
import { registerUser, loginUser, logoutUser} from '../controllers/authController.js'
import {getCurrentUser} from '../controllers/meController.js'
export const authRouter = express.Router()
authRouter.post('/register', registerUser)
// /api/auth/register
authRouter.post('/login', loginUser)
authRouter.post('/logout', logoutUser)
///api/auth/me
authRouter.get('/me', getCurrentUser)

