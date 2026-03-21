import axios from 'axios';
import { SendEmailRequest, BrevoEmailPayload } from '../types';

const BREVO_API_URL = 'https://api.brevo.com/v3/smtp/email';

export const sendViaBrevo = async (data: SendEmailRequest) => {
  const apiKey = process.env.BREVO_API_KEY;
  const defaultSenderEmail = process.env.DEFAULT_SENDER_EMAIL || '';
  const defaultSenderName = process.env.DEFAULT_SENDER_NAME || 'Mailing Service';

  if (!apiKey) {
    throw new Error('BREVO_API_KEY is not configured');
  }

  const payload: BrevoEmailPayload = {
    sender: {
      email: data.from?.email || defaultSenderEmail,
      name: data.from?.name || defaultSenderName,
    },
    to: data.to.map(email => ({ email })),
    subject: data.subject,
    htmlContent: data.html,
  };

  if (data.cc && data.cc.length > 0) {
    payload.cc = data.cc.map(email => ({ email }));
  }

  if (data.bcc && data.bcc.length > 0) {
    payload.bcc = data.bcc.map(email => ({ email }));
  }

  if (data.replyTo) {
    payload.replyTo = { email: data.replyTo };
  }

  if (data.attachments && data.attachments.length > 0) {
    payload.attachment = data.attachments.map(att => ({
      content: att.content,
      name: att.name,
    }));
  }

  try {
    const response = await axios.post(BREVO_API_URL, payload, {
      headers: {
        'api-key': apiKey,
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
    });

    return response.data;
  } catch (error: any) {
    const errorMessage = error.response?.data?.message || error.message;
    const errorDetails = error.response?.data || null;
    throw { message: errorMessage, details: errorDetails };
  }
};