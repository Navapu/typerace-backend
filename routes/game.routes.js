import express from 'express';
import { saveGame, getUserGameHistory, getTopScore, getPlayerMetrics } from '../controllers/game.controller.js';
import { auth } from '../middleware/auth.middleware.js';
import { validateTextId } from '../middleware/text.auth.middleware.js';
const router = express.Router();

router.post('/save',auth, validateTextId, saveGame);
router.get('/history', auth, getUserGameHistory);
router.get('/bestscore', getTopScore);
router.get('/me/metrics', auth, getPlayerMetrics);
export default router;