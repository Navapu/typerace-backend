import express from 'express';
import { saveGame, getUserGameHistory, getTopScore, getPlayerMetrics, getLastGame, getMetricsText } from '../controllers/game.controller.js';
import { auth } from '../middleware/auth.middleware.js';
import { validateTextId } from '../middleware/text.auth.middleware.js';
const router = express.Router();

router.post('/save',auth, validateTextId, saveGame);
router.get('/me/history', auth, getUserGameHistory);
router.get('/bestscore', getTopScore);
router.get('/me/metrics', auth, getPlayerMetrics);
router.get('/me/lastgame', auth, getLastGame);
router.get('/text/metrics', validateTextId, getMetricsText);
export default router;