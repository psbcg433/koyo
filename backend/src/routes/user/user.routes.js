import {Router} from 'express';
import UserController from './user.controller.js';
import {upload} from '../../middlewares/multer.middleware.js';

const userRouter = Router();

userRouter.post('/register',upload.single('avatar'), UserController.registerUser);


export default userRouter;