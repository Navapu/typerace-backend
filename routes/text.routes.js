import express from 'express';
import { insertText, getAllTexts, getRandomText, getMetricsText, editText, softDeleteText } from '../controllers/text.controller.js';
import { validateTextId } from '../middleware/text.auth.middleware.js';
import { auth, roleMiddleware } from '../middleware/auth.middleware.js';

const router = express.Router();

router.post('/insert', auth , roleMiddleware('admin'), insertText);
router.put('/edit', auth, roleMiddleware('admin'), validateTextId, editText);
router.delete('/delete', auth, roleMiddleware('admin'), validateTextId, softDeleteText);
router.get('/', getAllTexts);
router.get('/random', getRandomText);
router.get('/:textId/metrics', validateTextId, getMetricsText);
export default router