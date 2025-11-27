import express from 'express';
import { saveGame, getUserGameHistory } from '../controllers/game.controller.js';
import { auth } from '../middleware/auth.middleware.js';
import { validateTextId } from '../middleware/text.auth.middleware.js';
const router = express.Router();

router.post('/save',auth, validateTextId, saveGame);
router.get('/history', auth, getUserGameHistory);
export default router;