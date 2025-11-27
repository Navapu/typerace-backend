import express from 'express';
import { register, login, refreshAccessToken, oauthLogin } from '../controllers/auth.controller.js';
import passport from 'passport';
const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.post('/refresh', refreshAccessToken);
router.get('/google', passport.authenticate('google', {scope: ['profile', 'email']}))
router.get('/google/callback', passport.authenticate('google', { session: false, failureRedirect: 'https://wizardfootball.com/live/login' }), oauthLogin)
export default router;