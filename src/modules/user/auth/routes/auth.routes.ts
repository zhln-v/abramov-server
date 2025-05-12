import express from 'express';
import { registerUser } from '../controllers/auth.controller';
import { wrap } from '../../../../core/utils/wrap';

const authRouter = express.Router();

authRouter.post('/api/auth/register', wrap(registerUser));

export default authRouter;
