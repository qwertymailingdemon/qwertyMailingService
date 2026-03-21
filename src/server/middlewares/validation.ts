import { Request, Response, NextFunction } from 'express';
import { z } from 'zod';

const emailSchema = z.string().email();

const sendEmailSchema = z.object({
  to: z.array(emailSchema).min(1, "At least one recipient is required"),
  subject: z.string().min(1, "Subject is required"),
  html: z.string().min(1, "HTML content is required"),
  from: z.object({
    email: emailSchema,
    name: z.string().optional(),
  }).optional(),
  cc: z.array(emailSchema).optional(),
  bcc: z.array(emailSchema).optional(),
  replyTo: emailSchema.optional(),
  attachments: z.array(z.object({
    name: z.string(),
    content: z.string(), // Base64
  })).optional(),
});

export const validateEmailRequest = (req: Request, res: Response, next: NextFunction) => {
  try {
    sendEmailSchema.parse(req.body);
    next();
  } catch (error: any) {
    return res.status(400).json({
      success: false,
      error: 'Validation failed',
      details: error.errors,
    });
  }
};