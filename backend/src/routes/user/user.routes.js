import {Router} from 'express';
import UserController from './user.controller.js';
import {upload} from '../../middlewares/multer.middleware.js';
import { auth } from '../../middlewares/auth.middleware.js';

const userRouter = Router();

userRouter.post('/register',upload.single('avatar'), UserController.registerUser);
userRouter.post('/login',UserController.loginUser)
userRouter.get('/refresh',UserController.refreshAccessToken)
userRouter.post('/logout',auth,UserController.logoutUser)

export default userRouter;