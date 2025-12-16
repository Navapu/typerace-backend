import express from 'express';
import { getAllTexts, getRandomText, getMetricsText } from '../controllers/text.controller.js';
import { validateTextId } from '../middleware/text.auth.middleware.js';

const router = express.Router();

router.get('/', getAllTexts);
router.get('/random', getRandomText);
router.get('/:textId/metrics', validateTextId, getMetricsText);
export default router