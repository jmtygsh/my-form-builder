import nodemailer from "nodemailer";
import { env } from "../env";

/* ---------------------------------------------------------
  Initializes and exports the SMTP transporter for sending emails
--------------------------------------------------------- */
export const transporter = nodemailer.createTransport({
    host: env.SMTP_HOST,
    port: env.SMTP_PORT || 587,
    secure: env.SMTP_SECURE,
    auth: {
        user: env.SMTP_USER,
        pass: env.SMTP_PASS,
    },
});

/* ---------------------------------------------------------
  Sends an email using the configured SMTP transporter
--------------------------------------------------------- */
export const sendEmail = async (to: string, subject: string, html: string): Promise<void> => {
    await transporter.sendMail({
        from: '"MakeMyForm" <noreply@makemyform.in>',
        to,
        subject,
        html,
    });
};