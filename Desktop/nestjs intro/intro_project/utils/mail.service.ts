import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import { mailConfig } from './mail.config'; // Import the mail configuration

@Injectable()
export class MailService {
  private transporter: nodemailer.Transporter;

  constructor() {
    // Initialize Nodemailer transporter using the configuration
    this.transporter = nodemailer.createTransport({
      host: mailConfig.host,
      port: 465, // Adjust the port based on your SMTP server configuration
      secure: mailConfig.ssl, // Use SSL/TLS based on the configuration
      auth: {
        user: mailConfig.user,
        pass: mailConfig.password,
      },
    });
  }

  async sendEmail(to: string, otp: string): Promise<void> {
    // Email options
    const mailOptions: nodemailer.SendMailOptions = {
      from: mailConfig.user,
      to: to,
      subject: 'Your OTP for Verification',
      text: `Your OTP is: ${otp}`,
      html: `<p>Your OTP is: <b>${otp}</b></p>`,
    };

    // Send email
    try {
      await this.transporter.sendMail(mailOptions);
      console.log('Email sent successfully');
    } catch (error) {
      console.error('Error sending email:', error);
      throw new Error('Failed to send email');
    }
  }
}
