import axios from 'axios';
import { SendEmailRequest, BrevoEmailPayload, EmailAttachment } from '../types.js';

const BREVO_API_URL = 'https://api.brevo.com/v3/smtp/email';

export const sendViaBrevo = async (data: SendEmailRequest) => {
  const apiKey = process.env.BREVO_API_KEY;
  const defaultSenderEmail = process.env.DEFAULT_SENDER_EMAIL || '';
  const defaultSenderName = 'qwerty-developers'; // Updated sender name

  if (!apiKey) {
    throw new Error('BREVO_API_KEY is not configured');
  }

  // Append a basic unsubscribe footer if not present
  const unsubscribeFooter = `
    <br><br>
    <hr>
    <p style="font-size: 12px; color: #666;">
      You are receiving this because you are part of the qwerty-developers network. 
      <a href="{{unsubscribe_url}}" style="color: #3b82f6;">Unsubscribe</a>
    </p>
  `;

  const payload: any = {
    sender: {
      email: data.from?.email || defaultSenderEmail,
      name: defaultSenderName,
    },
    to: data.to.map((email: string) => ({ email })),
    subject: data.subject,
    htmlContent: data.html.includes('Unsubscribe') ? data.html : data.html + unsubscribeFooter,
    // Brevo specific headers for unsubscription
    headers: {
      "List-Unsubscribe": "<mailto:unsubscribe@yourdomain.com>, <https://yourdomain.com/unsubscribe>",
      "List-Unsubscribe-Post": "List-Unsubscribe=One-Click"
    }
  };

  if (data.cc && data.cc.length > 0) {
    payload.cc = data.cc.map((email: string) => ({ email }));
  }

  if (data.bcc && data.bcc.length > 0) {
    payload.bcc = data.bcc.map((email: string) => ({ email }));
  }

  if (data.replyTo) {
    payload.replyTo = { email: data.replyTo };
  }

  if (data.attachments && data.attachments.length > 0) {
    payload.attachment = data.attachments.map((att: EmailAttachment) => ({
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