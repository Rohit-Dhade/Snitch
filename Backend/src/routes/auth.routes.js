import express from 'express';
import { Router } from 'express';
import { validateRegisterUser } from '../validators/auth.validator.js';
import { RegisterController } from '../controller/auth.controller.js';

const Authrouter = Router();

Authrouter.post('/register-user' , validateRegisterUser , RegisterController)

export default Authrouter;

