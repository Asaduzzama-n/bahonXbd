import nodemailer from 'nodemailer'

const transporter = nodemailer.createTransporter({
  host: process.env.SMTP_HOST || 'smtp.gmail.com',
  port: parseInt(process.env.SMTP_PORT || '587'),
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
})

export class EmailService {
  static async sendVerificationEmail(email: string, verificationCode: string): Promise<boolean> {
    try {
      const mailOptions = {
        from: process.env.SMTP_FROM || 'noreply@bahonxbd.com',
        to: email,
        subject: 'Verify Your Email - BahonXBD',
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 20px; text-align: center;">
              <h1 style="color: white; margin: 0;">BahonXBD</h1>
              <p style="color: white; margin: 5px 0;">Premium Bike Platform</p>
            </div>
            
            <div style="padding: 30px; background: #f9f9f9;">
              <h2 style="color: #333; margin-bottom: 20px;">Verify Your Email Address</h2>
              
              <p style="color: #666; line-height: 1.6;">
                Thank you for registering with BahonXBD! To complete your registration, please use the verification code below:
              </p>
              
              <div style="background: white; padding: 20px; border-radius: 8px; text-align: center; margin: 20px 0;">
                <h3 style="color: #333; margin: 0;">Verification Code</h3>
                <div style="font-size: 32px; font-weight: bold; color: #667eea; letter-spacing: 4px; margin: 10px 0;">
                  ${verificationCode}
                </div>
                <p style="color: #999; font-size: 14px; margin: 0;">This code expires in 24 hours</p>
              </div>
              
              <p style="color: #666; line-height: 1.6;">
                If you didn't create an account with BahonXBD, please ignore this email.
              </p>
              
              <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #ddd;">
                <p style="color: #999; font-size: 12px; margin: 0;">
                  This is an automated email. Please do not reply to this message.
                </p>
              </div>
            </div>
          </div>
        `,
      }

      await transporter.sendMail(mailOptions)
      return true
    } catch (error) {
      console.error('Email sending failed:', error)
      return false
    }
  }

  static async sendPasswordResetEmail(email: string, resetToken: string): Promise<boolean> {
    try {
      const resetUrl = `${process.env.NEXT_PUBLIC_APP_URL}/reset-password?token=${resetToken}`
      
      const mailOptions = {
        from: process.env.SMTP_FROM || 'noreply@bahonxbd.com',
        to: email,
        subject: 'Reset Your Password - BahonXBD',
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 20px; text-align: center;">
              <h1 style="color: white; margin: 0;">BahonXBD</h1>
              <p style="color: white; margin: 5px 0;">Premium Bike Platform</p>
            </div>
            
            <div style="padding: 30px; background: #f9f9f9;">
              <h2 style="color: #333; margin-bottom: 20px;">Reset Your Password</h2>
              
              <p style="color: #666; line-height: 1.6;">
                We received a request to reset your password. Click the button below to create a new password:
              </p>
              
              <div style="text-align: center; margin: 30px 0;">
                <a href="${resetUrl}" style="background: #667eea; color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; display: inline-block; font-weight: bold;">
                  Reset Password
                </a>
              </div>
              
              <p style="color: #666; line-height: 1.6;">
                If the button doesn't work, copy and paste this link into your browser:
              </p>
              <p style="color: #667eea; word-break: break-all; font-size: 14px;">
                ${resetUrl}
              </p>
              
              <p style="color: #666; line-height: 1.6;">
                This link expires in 1 hour. If you didn't request a password reset, please ignore this email.
              </p>
              
              <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #ddd;">
                <p style="color: #999; font-size: 12px; margin: 0;">
                  This is an automated email. Please do not reply to this message.
                </p>
              </div>
            </div>
          </div>
        `,
      }

      await transporter.sendMail(mailOptions)
      return true
    } catch (error) {
      console.error('Password reset email failed:', error)
      return false
    }
  }

  static async sendWelcomeEmail(email: string, name: string): Promise<boolean> {
    try {
      const mailOptions = {
        from: process.env.SMTP_FROM || 'noreply@bahonxbd.com',
        to: email,
        subject: 'Welcome to BahonXBD!',
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 20px; text-align: center;">
              <h1 style="color: white; margin: 0;">Welcome to BahonXBD!</h1>
              <p style="color: white; margin: 5px 0;">Premium Bike Platform</p>
            </div>
            
            <div style="padding: 30px; background: #f9f9f9;">
              <h2 style="color: #333; margin-bottom: 20px;">Hello ${name}!</h2>
              
              <p style="color: #666; line-height: 1.6;">
                Welcome to BahonXBD, Bangladesh's premier bike trading platform! We're excited to have you join our community.
              </p>
              
              <div style="background: white; padding: 20px; border-radius: 8px; margin: 20px 0;">
                <h3 style="color: #333; margin-top: 0;">What you can do now:</h3>
                <ul style="color: #666; line-height: 1.8;">
                  <li>Browse thousands of verified bikes</li>
                  <li>List your bike for sale</li>
                  <li>Book professional bike wash services</li>
                  <li>Get expert advice from our team</li>
                  <li>Access exclusive deals and offers</li>
                </ul>
              </div>
              
              <div style="text-align: center; margin: 30px 0;">
                <a href="${process.env.NEXT_PUBLIC_APP_URL}" style="background: #667eea; color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; display: inline-block; font-weight: bold;">
                  Start Exploring
                </a>
              </div>
              
              <p style="color: #666; line-height: 1.6;">
                If you have any questions, feel free to contact our support team. We're here to help!
              </p>
              
              <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #ddd;">
                <p style="color: #999; font-size: 12px; margin: 0;">
                  Thank you for choosing BahonXBD - Your trusted bike partner.
                </p>
              </div>
            </div>
          </div>
        `,
      }

      await transporter.sendMail(mailOptions)
      return true
    } catch (error) {
      console.error('Welcome email failed:', error)
      return false
    }
  }
}