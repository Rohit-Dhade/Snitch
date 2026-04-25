import { Router } from 'express';
import { validateRegisterUser, validateLoginUser } from '../validators/auth.validator.js';
import { RegisterController, LoginController, GoogleCallback, GetMe } from '../controller/auth.controller.js';
import { authenticateUser } from '../middleware/auth.middleware.js';
import passport from 'passport';

const Authrouter = Router();

Authrouter.post('/register-user', validateRegisterUser, RegisterController);
Authrouter.post('/login-user', validateLoginUser, LoginController);
Authrouter.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));
Authrouter.get("/google/callback", passport.authenticate('google', { failureRedirect: 'http://localhost:5173/login', session: false }),
    GoogleCallback
);
Authrouter.get('/get-me', authenticateUser, GetMe)

export default Authrouter;

