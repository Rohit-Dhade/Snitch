import { Router } from 'express';
import { validateRegisterUser, validateLoginUser } from '../validators/auth.validator.js';
import { RegisterController, LoginController } from '../controller/auth.controller.js';

const Authrouter = Router();

Authrouter.post('/register-user', validateRegisterUser, RegisterController);
Authrouter.post('/login-user', validateLoginUser, LoginController);

export default Authrouter;

