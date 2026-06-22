import express from 'express';
import { answerChatQuestion, chatStarters } from '../utils/chatAdvisor.js';

const router = express.Router();

router.get('/starters', (req, res) => {
  res.json({ success: true, data: chatStarters() });
});

router.post('/ask', (req, res) => {
  const { question } = req.body;

  if (!question || typeof question !== 'string') {
    return res.status(400).json({ error: 'question is required' });
  }

  res.json({ success: true, data: answerChatQuestion(question) });
});

export default router;
