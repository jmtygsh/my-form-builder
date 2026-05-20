import { sendEmail } from "../clients/nodemailer";
import { env } from "../env";

class EmailService {

    public static async sendEmailVerificationEmail(email: string, token: string) {
        const verificationUrl = `${env.BASE_URL}/verify-email?token=${token}`;

        const subject = "Verify your email address";
        const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2>Welcome!</h2>
        <p>Thank you for registering. Please verify your email address by clicking the link below:</p>
        <p>
          <a href="${verificationUrl}" style="display: inline-block; padding: 10px 20px; background-color: #007bff; color: #ffffff; text-decoration: none; border-radius: 5px;">
            Verify Email
          </a>
        </p>
        <p>If the button doesn't work, copy and paste this link into your browser:</p>
        <p><a href="${verificationUrl}">${verificationUrl}</a></p>
        <p>This link will expire in 24 hours.</p>
      </div>
    `;

        await sendEmail(email, subject, html);
    }

    public static async sendResetPasswordEmail(email: string, token: string) {
        const resetUrl = `${env.BASE_URL}/reset-password?token=${token}`;

        const subject = "Reset your password";
        const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2>Password Reset Request</h2>
        <p>We received a request to reset your password. Click the link below to set a new password:</p>
        <p>
          <a href="${resetUrl}" style="display: inline-block; padding: 10px 20px; background-color: #007bff; color: #ffffff; text-decoration: none; border-radius: 5px;">
            Reset Password
          </a>
        </p>
        <p>If the button doesn't work, copy and paste this link into your browser:</p>
        <p><a href="${resetUrl}">${resetUrl}</a></p>
        <p>If you didn't request this, you can safely ignore this email.</p>
        <p>This link will expire in 10 minutes.</p>
      </div>
    `;

        await sendEmail(email, subject, html);
    }
}

export default EmailService;
