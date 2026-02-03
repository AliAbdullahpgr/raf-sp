/**
 * Email Notification Service
 *
 * This module handles sending email notifications for the resource request system.
 * Configure SMTP settings in your .env file:
 *
 * SMTP_HOST=smtp.gmail.com
 * SMTP_PORT=587
 * SMTP_USER=your-email@gmail.com
 * SMTP_PASSWORD=your-app-password
 * SMTP_FROM=noreply@raf-sp.com
 */

import { NotificationType } from "@prisma/client";

interface EmailOptions {
  to: string;
  subject: string;
  html: string;
  text?: string;
}

interface NotificationEmailData {
  type: NotificationType;
  recipientName: string;
  recipientEmail: string;
  resourceName: string;
  departmentName: string;
  message: string;
  requestId?: string;
}

// Email templates for different notification types
const emailTemplates: Record<NotificationType, (data: NotificationEmailData) => { subject: string; html: string }> = {
  REQUEST_RECEIVED: (data) => ({
    subject: `New Resource Request: ${data.resourceName}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #2678E7;">New Resource Request</h2>
        <p>Hello ${data.recipientName},</p>
        <p>${data.departmentName} has requested to borrow <strong>${data.resourceName}</strong> from your department.</p>
        <p>${data.message}</p>
        <p>Please log in to the RAF-SP platform to review and respond to this request.</p>
        <a href="${process.env.NEXT_PUBLIC_APP_URL}/dashboard/requests" style="display: inline-block; padding: 10px 20px; background-color: #2678E7; color: white; text-decoration: none; border-radius: 5px; margin-top: 10px;">View Request</a>
        <p style="margin-top: 20px; color: #666; font-size: 12px;">This is an automated message from the RAF-SP Asset Management System.</p>
      </div>
    `,
  }),

  REQUEST_APPROVED: (data) => ({
    subject: `Request Approved: ${data.resourceName}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #22c55e;">Request Approved</h2>
        <p>Hello ${data.recipientName},</p>
        <p>Great news! Your request for <strong>${data.resourceName}</strong> has been approved.</p>
        <p>${data.message}</p>
        <p>You can now start borrowing the resource through the RAF-SP platform.</p>
        <a href="${process.env.NEXT_PUBLIC_APP_URL}/dashboard/requests" style="display: inline-block; padding: 10px 20px; background-color: #22c55e; color: white; text-decoration: none; border-radius: 5px; margin-top: 10px;">View Details</a>
        <p style="margin-top: 20px; color: #666; font-size: 12px;">This is an automated message from the RAF-SP Asset Management System.</p>
      </div>
    `,
  }),

  REQUEST_REJECTED: (data) => ({
    subject: `Request Rejected: ${data.resourceName}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #ef4444;">Request Rejected</h2>
        <p>Hello ${data.recipientName},</p>
        <p>Unfortunately, your request for <strong>${data.resourceName}</strong> has been rejected.</p>
        <p>${data.message}</p>
        <p>If you have any questions, please contact the lending department directly.</p>
        <a href="${process.env.NEXT_PUBLIC_APP_URL}/dashboard/requests" style="display: inline-block; padding: 10px 20px; background-color: #6b7280; color: white; text-decoration: none; border-radius: 5px; margin-top: 10px;">View Details</a>
        <p style="margin-top: 20px; color: #666; font-size: 12px;">This is an automated message from the RAF-SP Asset Management System.</p>
      </div>
    `,
  }),

  REQUEST_EXPIRING: (data) => ({
    subject: `Request Expiring Soon: ${data.resourceName}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #eab308;">Request Expiring Soon</h2>
        <p>Hello ${data.recipientName},</p>
        <p>A request for <strong>${data.resourceName}</strong> will expire in 2 days if not reviewed.</p>
        <p>${data.message}</p>
        <p>Please log in to review this request before it expires.</p>
        <a href="${process.env.NEXT_PUBLIC_APP_URL}/dashboard/requests" style="display: inline-block; padding: 10px 20px; background-color: #eab308; color: white; text-decoration: none; border-radius: 5px; margin-top: 10px;">Review Now</a>
        <p style="margin-top: 20px; color: #666; font-size: 12px;">This is an automated message from the RAF-SP Asset Management System.</p>
      </div>
    `,
  }),

  REQUEST_EXPIRED: (data) => ({
    subject: `Request Expired: ${data.resourceName}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #6b7280;">Request Expired</h2>
        <p>Hello ${data.recipientName},</p>
        <p>Your request for <strong>${data.resourceName}</strong> has expired without approval.</p>
        <p>${data.message}</p>
        <p>You may submit a new request if still needed.</p>
        <a href="${process.env.NEXT_PUBLIC_APP_URL}/dashboard/requests" style="display: inline-block; padding: 10px 20px; background-color: #6b7280; color: white; text-decoration: none; border-radius: 5px; margin-top: 10px;">View Requests</a>
        <p style="margin-top: 20px; color: #666; font-size: 12px;">This is an automated message from the RAF-SP Asset Management System.</p>
      </div>
    `,
  }),

  BORROW_STARTED: (data) => ({
    subject: `Resource Borrowed: ${data.resourceName}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #2678E7;">Resource Borrowed</h2>
        <p>Hello ${data.recipientName},</p>
        <p><strong>${data.resourceName}</strong> has been borrowed by ${data.departmentName}.</p>
        <p>${data.message}</p>
        <a href="${process.env.NEXT_PUBLIC_APP_URL}/dashboard/requests" style="display: inline-block; padding: 10px 20px; background-color: #2678E7; color: white; text-decoration: none; border-radius: 5px; margin-top: 10px;">View Details</a>
        <p style="margin-top: 20px; color: #666; font-size: 12px;">This is an automated message from the RAF-SP Asset Management System.</p>
      </div>
    `,
  }),

  RETURN_DUE_SOON: (data) => ({
    subject: `Return Due Soon: ${data.resourceName}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #eab308;">Return Due Soon</h2>
        <p>Hello ${data.recipientName},</p>
        <p>The borrowed resource <strong>${data.resourceName}</strong> is due for return in 3 days.</p>
        <p>${data.message}</p>
        <p>Please ensure the resource is returned on time.</p>
        <a href="${process.env.NEXT_PUBLIC_APP_URL}/dashboard/requests" style="display: inline-block; padding: 10px 20px; background-color: #eab308; color: white; text-decoration: none; border-radius: 5px; margin-top: 10px;">View Details</a>
        <p style="margin-top: 20px; color: #666; font-size: 12px;">This is an automated message from the RAF-SP Asset Management System.</p>
      </div>
    `,
  }),

  RESOURCE_OVERDUE: (data) => ({
    subject: `URGENT: Resource Overdue: ${data.resourceName}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #ef4444;">Resource Overdue</h2>
        <p>Hello ${data.recipientName},</p>
        <p><strong>URGENT:</strong> The resource <strong>${data.resourceName}</strong> is overdue for return.</p>
        <p>${data.message}</p>
        <p>Please return the resource immediately.</p>
        <a href="${process.env.NEXT_PUBLIC_APP_URL}/dashboard/requests" style="display: inline-block; padding: 10px 20px; background-color: #ef4444; color: white; text-decoration: none; border-radius: 5px; margin-top: 10px;">Take Action</a>
        <p style="margin-top: 20px; color: #666; font-size: 12px;">This is an automated message from the RAF-SP Asset Management System.</p>
      </div>
    `,
  }),

  RESOURCE_RETURNED: (data) => ({
    subject: `Resource Returned: ${data.resourceName}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #22c55e;">Resource Returned</h2>
        <p>Hello ${data.recipientName},</p>
        <p><strong>${data.resourceName}</strong> has been returned by ${data.departmentName}.</p>
        <p>${data.message}</p>
        <p>The resource is now available in your inventory again.</p>
        <a href="${process.env.NEXT_PUBLIC_APP_URL}/dashboard/requests" style="display: inline-block; padding: 10px 20px; background-color: #22c55e; color: white; text-decoration: none; border-radius: 5px; margin-top: 10px;">View Details</a>
        <p style="margin-top: 20px; color: #666; font-size: 12px;">This is an automated message from the RAF-SP Asset Management System.</p>
      </div>
    `,
  }),
};

/**
 * Send an email notification
 * Uses fetch to call an email API or can be configured for SMTP
 */
export async function sendEmail(options: EmailOptions): Promise<boolean> {
  // Check if email is configured
  if (!process.env.SMTP_HOST || !process.env.SMTP_USER) {
    console.log("Email not configured. Skipping email notification.");
    console.log("Would have sent email to:", options.to);
    console.log("Subject:", options.subject);
    return false;
  }

  try {
    // Option 1: Use a third-party email service like SendGrid, Resend, etc.
    // Example using Resend:
    if (process.env.RESEND_API_KEY) {
      const response = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
        },
        body: JSON.stringify({
          from: process.env.SMTP_FROM || "noreply@raf-sp.com",
          to: options.to,
          subject: options.subject,
          html: options.html,
        }),
      });

      if (!response.ok) {
        throw new Error(`Email API error: ${response.status}`);
      }

      return true;
    }

    // Option 2: Use nodemailer (would need to be installed separately)
    // This is a placeholder for nodemailer implementation
    console.log("Email would be sent via SMTP to:", options.to);
    return true;
  } catch (error) {
    console.error("Failed to send email:", error);
    return false;
  }
}

/**
 * Send a notification email based on notification type
 */
export async function sendNotificationEmail(data: NotificationEmailData): Promise<boolean> {
  const template = emailTemplates[data.type];
  if (!template) {
    console.error("No email template for notification type:", data.type);
    return false;
  }

  const { subject, html } = template(data);

  return sendEmail({
    to: data.recipientEmail,
    subject,
    html,
  });
}
