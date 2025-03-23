import { Router } from 'express';

import { signUp, signIn, signOut } from '../controllers/auth.controller.js';
import { validateBody } from '../middlewares/validateBody.middleware.js';
import { loginUserSchema, registerUserSchema } from '../validation/auth.validation.js';
import { refreshToken } from '../controllers/token.controller.js';

const authRouter = Router();

// path: /api/v1/auth
authRouter.post('/sign-up', validateBody(registerUserSchema), signUp);
authRouter.post('/sign-in', validateBody(loginUserSchema), signIn);
authRouter.post('/sign-out', signOut);
authRouter.post('/refresh-token', refreshToken);

export default authRouter;