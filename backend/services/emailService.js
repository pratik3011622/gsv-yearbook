const nodemailer = require('nodemailer');

class EmailService {
  constructor() {
    // For development/testing - log emails instead of sending
    if (process.env.NODE_ENV === 'development' || !process.env.EMAIL_USER || process.env.EMAIL_USER === 'your-actual-gmail@gmail.com') {
      console.log('📧 Email service in development mode - emails will be logged to console');
      this.transporter = null;
      return;
    }

    this.transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      }
    });
  }

  async sendVerificationEmail(user, verificationToken) {
    const verificationUrl = `${process.env.FRONTEND_URL}/verify-email?token=${verificationToken}`;

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: user.email,
      subject: 'Verify Your Email - GSV Connect',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f9f9f9;">
          <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
            <h1 style="color: white; margin: 0; font-size: 28px;">Verify Your Email</h1>
          </div>

          <div style="background: white; padding: 30px; border-radius: 0 0 10px 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
            <h2 style="color: #333; margin-top: 0;">Welcome to GSV Connect, ${user.fullName}!</h2>

            <p style="color: #666; line-height: 1.6; font-size: 16px;">
              Thank you for registering with Gati Shakti Vishwavidyalaya's alumni network. To complete your registration and start connecting with fellow alumni, please verify your email address.
            </p>

            <div style="text-align: center; margin: 30px 0;">
              <a href="${verificationUrl}"
                 style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                        color: white;
                        padding: 15px 30px;
                        text-decoration: none;
                        border-radius: 25px;
                        font-weight: bold;
                        display: inline-block;
                        box-shadow: 0 4px 15px rgba(102, 126, 234, 0.4);">
                Verify Email Address
              </a>
            </div>

            <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #667eea;">
              <p style="color: #666; margin: 0; font-size: 14px;">
                <strong>Important:</strong> This verification link will expire in 24 hours. If you didn't create an account with GSV Connect, please ignore this email.
              </p>
            </div>

            <p style="color: #666; font-size: 14px; text-align: center; margin-top: 30px; border-top: 1px solid #eee; padding-top: 20px;">
              If the button doesn't work, copy and paste this link into your browser:<br>
              <a href="${verificationUrl}" style="color: #667eea; word-break: break-all;">${verificationUrl}</a>
            </p>

            <p style="color: #666; font-size: 14px; text-align: center; margin-top: 20px;">
              Best regards,<br>
              <strong>GSV Connect Team</strong><br>
              Gati Shakti Vishwavidyalaya
            </p>
          </div>
        </div>
      `
    };

    // Development mode - log email instead of sending
    if (!this.transporter) {
      console.log('📧 VERIFICATION EMAIL (Development Mode)');
      console.log('To:', user.email);
      console.log('Subject:', mailOptions.subject);
      console.log('Verification URL:', verificationUrl);
      console.log('--- Email HTML ---');
      console.log(mailOptions.html);
      return;
    }

    try {
      await this.transporter.sendMail(mailOptions);
      console.log('Verification email sent to:', user.email);
    } catch (error) {
      console.error('Error sending verification email:', error);
      throw error;
    }
  }

  async sendWelcomeEmail(user) {
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: user.email,
      subject: 'Welcome to GSV Connect - Your Account is Approved!',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f9f9f9;">
          <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
            <h1 style="color: white; margin: 0; font-size: 28px;">Welcome to GSV Connect!</h1>
          </div>

          <div style="background: white; padding: 30px; border-radius: 0 0 10px 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
            <h2 style="color: #333; margin-top: 0;">Congratulations, ${user.fullName}!</h2>

            <p style="color: #666; line-height: 1.6; font-size: 16px;">
              Your account has been approved and you're now part of the Gati Shakti Vishwavidyalaya alumni community!
            </p>

            <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <h3 style="color: #333; margin-top: 0;">What you can do now:</h3>
              <ul style="color: #666; padding-left: 20px;">
                <li>Connect with fellow alumni</li>
                <li>Share your career journey and success stories</li>
                <li>Post and discover job opportunities</li>
                <li>Participate in events and reunions</li>
                <li>Access mentorship programs</li>
                <li>Contribute to the alumni magazine</li>
              </ul>
            </div>

            <div style="text-align: center; margin: 30px 0;">
              <a href="${process.env.FRONTEND_URL}/login"
                 style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                        color: white;
                        padding: 12px 30px;
                        text-decoration: none;
                        border-radius: 25px;
                        font-weight: bold;
                        display: inline-block;">
                Login to Your Account
              </a>
            </div>

            <p style="color: #666; font-size: 14px; text-align: center; margin-top: 30px; border-top: 1px solid #eee; padding-top: 20px;">
              Best regards,<br>
              <strong>GSV Connect Team</strong><br>
              Gati Shakti Vishwavidyalaya
            </p>
          </div>
        </div>
      `
    };

    // Development mode - log email instead of sending
    if (!this.transporter) {
      console.log('📧 WELCOME EMAIL (Development Mode)');
      console.log('To:', user.email);
      console.log('Subject:', mailOptions.subject);
      console.log('Login URL:', `${process.env.FRONTEND_URL}/login`);
      return;
    }

    try {
      await this.transporter.sendMail(mailOptions);
      console.log('Welcome email sent to:', user.email);
    } catch (error) {
      console.error('Error sending welcome email:', error);
    }
  }

  async sendRejectionEmail(user, reason) {
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: user.email,
      subject: 'GSV Connect - Account Registration Update',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f9f9f9;">
          <div style="background: linear-gradient(135deg, #e74c3c 0%, #c0392b 100%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
            <h1 style="color: white; margin: 0; font-size: 28px;">Account Registration Update</h1>
          </div>

          <div style="background: white; padding: 30px; border-radius: 0 0 10px 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
            <h2 style="color: #333; margin-top: 0;">Dear ${user.fullName},</h2>

            <p style="color: #666; line-height: 1.6; font-size: 16px;">
              Thank you for your interest in joining the Gati Shakti Vishwavidyalaya alumni community.
            </p>

            <div style="background: #fff5f5; border: 1px solid #fed7d7; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <h3 style="color: #c53030; margin-top: 0;">Registration Status: Not Approved</h3>
              <p style="color: #666; margin-bottom: 0;">
                <strong>Reason:</strong> ${reason || 'Your application did not meet our current requirements.'}
              </p>
            </div>

            <p style="color: #666; line-height: 1.6;">
              We appreciate your interest in our alumni network. If you believe this decision was made in error or if you have additional information to provide, please don't hesitate to contact us.
            </p>

            <div style="text-align: center; margin: 30px 0;">
              <a href="mailto:admin@gsv.edu.in"
                 style="background: linear-gradient(135deg, #e74c3c 0%, #c0392b 100%);
                        color: white;
                        padding: 12px 30px;
                        text-decoration: none;
                        border-radius: 25px;
                        font-weight: bold;
                        display: inline-block;">
                Contact Support
              </a>
            </div>

            <p style="color: #666; font-size: 14px; text-align: center; margin-top: 30px; border-top: 1px solid #eee; padding-top: 20px;">
              Best regards,<br>
              <strong>GSV Connect Team</strong><br>
              Gati Shakti Vishwavidyalaya
            </p>
          </div>
        </div>
      `
    };

    try {
      await this.transporter.sendMail(mailOptions);
      console.log('Rejection email sent to:', user.email);
    } catch (error) {
      console.error('Error sending rejection email:', error);
    }
  }

  async sendMentorshipRequestEmail(mentor, mentee, requestData) {
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: mentor.email,
      subject: 'New Mentorship Request - GSV Connect',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f9f9f9;">
          <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
            <h1 style="color: white; margin: 0; font-size: 28px;">New Mentorship Request</h1>
          </div>

          <div style="background: white; padding: 30px; border-radius: 0 0 10px 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
            <h2 style="color: #333; margin-top: 0;">Hello ${mentor.fullName}!</h2>

            <p style="color: #666; line-height: 1.6; font-size: 16px;">
              You have received a new mentorship request from ${mentee.fullName}.
            </p>

            <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <h3 style="color: #333; margin-top: 0;">Request Details:</h3>
              <p><strong>Topic:</strong> ${requestData.topic}</p>
              <p><strong>Preferred Time:</strong> ${requestData.preferredTime || 'Not specified'}</p>
              <p><strong>Message:</strong></p>
              <p style="background: white; padding: 10px; border-radius: 4px; border: 1px solid #dee2e6;">${requestData.message}</p>
            </div>

            <div style="text-align: center; margin: 30px 0;">
              <a href="${process.env.FRONTEND_URL}/mentorship"
                 style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                        color: white;
                        padding: 12px 30px;
                        text-decoration: none;
                        border-radius: 25px;
                        font-weight: bold;
                        display: inline-block;">
                View in Dashboard
              </a>
            </div>

            <p style="color: #666; font-size: 14px; text-align: center; margin-top: 30px; border-top: 1px solid #eee; padding-top: 20px;">
              Best regards,<br>
              <strong>GSV Connect Team</strong>
            </p>
          </div>
        </div>
      `
    };

    try {
      await this.transporter.sendMail(mailOptions);
      console.log('Mentorship request email sent to:', mentor.email);
    } catch (error) {
      console.error('Error sending mentorship request email:', error);
    }
  }
}

module.exports = new EmailService();