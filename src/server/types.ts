export interface EmailAttachment {
  name: string;
  content: string; // Base64 encoded
}

export interface SendEmailRequest {
  to: string[];
  subject: string;
  html: string;
  from?: {
    email: string;
    name?: string;
  };
  cc?: string[];
  bcc?: string[];
  replyTo?: string;
  attachments?: EmailAttachment[];
}

export interface BrevoEmailPayload {
  sender: {
    email: string;
    name?: string;
  };
  to: { email: string }[];
  subject: string;
  htmlContent: string;
  cc?: { email: string }[];
  bcc?: { email: string }[];
  replyTo?: { email: string };
  attachment?: { content: string; name: string }[];
}