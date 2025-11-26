import express from 'express';
import { getAllTexts, getRandomText } from '../controllers/text.controller.js';
const router = express.Router();

router.get('/', getAllTexts);
router.get('/random', getRandomText);
export default router