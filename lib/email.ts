/**
 * Email Notification Service using Resend (free tier: 100 emails/day)
 *
 * Setup:
 * 1. Sign up at https://resend.com
 * 2. Get your API key from the dashboard
 * 3. Add to Vercel env vars: RESEND_API_KEY=re_xxxxx
 * 4. Without domain verification, emails send from: onboarding@resend.dev
 *    To use a custom "from" address, verify your domain in Resend dashboard.
 */

import { Resend } from "resend";
import { NotificationType } from "@prisma/client";

const resend = process.env.RESEND_API_KEY
  ? new Resend(process.env.RESEND_API_KEY)
  : null;

interface NotificationEmailData {
  type: NotificationType;
  recipientName: string;
  recipientEmail: string;
  resourceName: string;
  departmentName: string;
  message: string;
  requestId?: string;
}

const APP_URL = process.env.NEXT_PUBLIC_APP_URL || "https://raf-sp-lat.vercel.app";
const FROM_EMAIL = process.env.EMAIL_FROM || "RAF-SP <onboarding@resend.dev>";

const emailTemplates: Record<
  NotificationType,
  (data: NotificationEmailData) => { subject: string; html: string }
> = {
  REQUEST_RECEIVED: (data) => ({
    subject: `New Resource Request: ${data.resourceName}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #2678E7;">New Resource Request</h2>
        <p>Hello ${data.recipientName},</p>
        <p>${data.departmentName} has requested to borrow <strong>${data.resourceName}</strong> from your department.</p>
        <p>${data.message}</p>
        <p>Please log in to the RAF-SP platform to review and respond to this request.</p>
        <a href="${APP_URL}/dashboard/requests" style="display: inline-block; padding: 10px 20px; background-color: #2678E7; color: white; text-decoration: none; border-radius: 5px; margin-top: 10px;">View Request</a>
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
        <a href="${APP_URL}/dashboard/requests" style="display: inline-block; padding: 10px 20px; background-color: #22c55e; color: white; text-decoration: none; border-radius: 5px; margin-top: 10px;">View Details</a>
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
        <a href="${APP_URL}/dashboard/requests" style="display: inline-block; padding: 10px 20px; background-color: #6b7280; color: white; text-decoration: none; border-radius: 5px; margin-top: 10px;">View Details</a>
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
        <a href="${APP_URL}/dashboard/requests" style="display: inline-block; padding: 10px 20px; background-color: #eab308; color: white; text-decoration: none; border-radius: 5px; margin-top: 10px;">Review Now</a>
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
        <a href="${APP_URL}/dashboard/requests" style="display: inline-block; padding: 10px 20px; background-color: #6b7280; color: white; text-decoration: none; border-radius: 5px; margin-top: 10px;">View Requests</a>
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
        <a href="${APP_URL}/dashboard/requests" style="display: inline-block; padding: 10px 20px; background-color: #2678E7; color: white; text-decoration: none; border-radius: 5px; margin-top: 10px;">View Details</a>
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
        <a href="${APP_URL}/dashboard/requests" style="display: inline-block; padding: 10px 20px; background-color: #eab308; color: white; text-decoration: none; border-radius: 5px; margin-top: 10px;">View Details</a>
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
        <a href="${APP_URL}/dashboard/requests" style="display: inline-block; padding: 10px 20px; background-color: #ef4444; color: white; text-decoration: none; border-radius: 5px; margin-top: 10px;">Take Action</a>
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
        <a href="${APP_URL}/dashboard/requests" style="display: inline-block; padding: 10px 20px; background-color: #22c55e; color: white; text-decoration: none; border-radius: 5px; margin-top: 10px;">View Details</a>
        <p style="margin-top: 20px; color: #666; font-size: 12px;">This is an automated message from the RAF-SP Asset Management System.</p>
      </div>
    `,
  }),
};

/**
 * Send a notification email using Resend
 */
export async function sendNotificationEmail(
  data: NotificationEmailData
): Promise<boolean> {
  // Check EMAIL_ENABLED flag — set to "true" to enable email sending
  if (process.env.EMAIL_ENABLED !== "true") {
    console.log("[Email] Disabled (EMAIL_ENABLED != true). Skipping email to:", data.recipientEmail);
    return false;
  }

  const template = emailTemplates[data.type];
  if (!template) {
    console.error("No email template for notification type:", data.type);
    return false;
  }

  const { subject, html } = template(data);

  if (!resend) {
    console.log("[Email] Resend not configured (missing RESEND_API_KEY). Would have sent:");
    console.log(`  To: ${data.recipientEmail}`);
    console.log(`  Subject: ${subject}`);
    return false;
  }

  try {
    const { error } = await resend.emails.send({
      from: FROM_EMAIL,
      to: data.recipientEmail,
      subject,
      html,
    });

    if (error) {
      console.error("[Email] Resend error:", error);
      return false;
    }

    console.log(`[Email] Sent "${subject}" to ${data.recipientEmail}`);
    return true;
  } catch (error) {
    console.error("[Email] Failed to send:", error);
    return false;
  }
}
