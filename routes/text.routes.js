import express from 'express';
import { insertText, getAllTexts, getRandomText, getMetricsText, editText, softDeleteText, permanentDeleteText, getSelectedText } from '../controllers/text.controller.js';
import { validateTextId } from '../middleware/text.auth.middleware.js';
import { validateObjectId } from "../middleware/validateObjectId.middleware.js"
import { auth, roleMiddleware } from '../middleware/auth.middleware.js';

const router = express.Router();

router.post('/insert', auth , roleMiddleware('admin'), insertText);
router.put('/edit', auth, roleMiddleware('admin'), validateObjectId('textId', 'body'), validateTextId, editText);
router.delete('/delete', auth, roleMiddleware('admin'), validateObjectId('textId', 'body'), validateTextId, softDeleteText);
router.delete('/fulldelete', auth, roleMiddleware('admin'), validateObjectId('textId', 'body'), validateTextId, permanentDeleteText);
router.get('/', getAllTexts);
router.get('/:textId/selected', validateObjectId('textId'), validateTextId, getSelectedText);
router.get('/random', getRandomText);
router.get('/:textId/metrics',validateObjectId('textId'), validateTextId, getMetricsText);
export default router