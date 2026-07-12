import nodemailer from 'nodemailer';
import { env } from '../config/env';
import { logger } from './logger';

const transporter = nodemailer.createTransport({
  host: env.SMTP_HOST,
  port: env.SMTP_PORT,
  secure: env.SMTP_SECURE,
  auth: env.SMTP_USER && env.SMTP_PASS ? { user: env.SMTP_USER, pass: env.SMTP_PASS } : undefined,
});

export async function sendMail(to: string, subject: string, html: string): Promise<void> {
  if (!env.SMTP_HOST || !env.SMTP_USER) {
    logger.warn('SMTP not configured — skipping email send', { to, subject });
    return;
  }

  try {
    await transporter.sendMail({
      from: env.MAIL_FROM,
      to,
      subject,
      html,
    });
    logger.info('Email sent', { to, subject });
  } catch (err) {
    // Email failures should never crash the request (e.g. registration flow) —
    // log and move on.
    logger.error('Failed to send email', { to, subject, error: err });
  }
}

export function passwordResetEmailHtml(resetUrl: string): string {
  return `
    <p>We received a request to reset your DriveCore password.</p>
    <p><a href="${resetUrl}">Click here to reset your password</a>. This link expires shortly.</p>
    <p>If you did not request this, you can safely ignore this email.</p>
  `;
}
