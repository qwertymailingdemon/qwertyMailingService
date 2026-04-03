import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';
import dotenv from 'dotenv';
import axios from 'axios';
import { authenticateApiKey } from './middlewares/auth.js';
import { validateEmailRequest } from './middlewares/validation.js';
import { sendViaBrevo } from './services/brevoService.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 10000;
const RENDER_EXTERNAL_URL = process.env.RENDER_EXTERNAL_URL;

// Security & Logging
app.use(helmet());
app.use(cors());
app.use(morgan('combined'));
app.use(express.json({ limit: '10mb' }));

// Rate Limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: { success: false, error: 'Too many requests, please try again later.' }
});
app.use('/send-email', limiter);

// Health Check
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'healthy', timestamp: new Date().toISOString() });
});

// Email Sending Endpoint
app.post('/send-email', authenticateApiKey, validateEmailRequest, async (req, res) => {
  try {
    const result = await sendViaBrevo(req.body);
    res.status(200).json({
      success: true,
      message: 'Email sent successfully',
      messageId: result.messageId,
    });
  } catch (error: any) {
    console.error('Email sending failed:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to send email',
      details: error.details || null,
    });
  }
});

// Keep-Alive Mechanism for Render
// Pings the health endpoint every 40 seconds to prevent sleeping
if (RENDER_EXTERNAL_URL) {
  setInterval(async () => {
    try {
      await axios.get(`${RENDER_EXTERNAL_URL}/health`);
      console.log('Self-ping successful: Keeping instance awake');
    } catch (err) {
      console.error('Self-ping failed:', err);
    }
  }, 40000); 
}

if (process.env.NODE_ENV !== 'test') {
  app.listen(PORT, () => {
    console.log(`Mailing Agent Service running on port ${PORT}`);
  });
}

export default app;