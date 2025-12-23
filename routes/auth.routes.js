import express from 'express';
import { register, login, refreshAccessToken, oauthLogin, logout, updateUser, getUserInformation, registerAdmin } from '../controllers/auth.controller.js';
import { auth } from '../middleware/auth.middleware.js';
import { authLimiter, registerAdminLimiter } from '../middleware/rateLimit.middleware.js';
import passport from 'passport';
const router = express.Router();

router.post('/register', authLimiter, register);
router.post('/register-admin', registerAdminLimiter, registerAdmin);
router.post('/login', authLimiter, login);
router.post('/refresh', refreshAccessToken);
router.delete('/logout', auth ,logout);
router.put('/update', authLimiter, auth, updateUser);
router.get('/google', passport.authenticate('google', {scope: ['profile', 'email']}))
router.get('/google/callback', passport.authenticate('google', { session: false, failureRedirect: 'http://localhost:3007/auth/login' }), oauthLogin)
router.get('/me', auth, getUserInformation);
export default router;