import { Resend } from "resend";
import dotenv from "dotenv";

dotenv.config();

const APP_URL = process.env.NEXT_PUBLIC_APP_URL || "https://raf-sp-lat.vercel.app";
const FROM_EMAIL = process.env.EMAIL_FROM || "RAF-SP <onboarding@resend.dev>";
const TO_EMAIL = "ilabhaia1234@gmail.com";

const emails = [
  {
    subject: "New Resource Request: Bulldozer CAT D6",
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #2678E7;">New Resource Request</h2>
        <p>Hello Dr. Asifa Hameed,</p>
        <p>Mango Research Institute has requested to borrow <strong>Bulldozer CAT D6</strong> from your department.</p>
        <p>A new resource request has been submitted and is awaiting your review.</p>
        <p>Please log in to the RAF-SP platform to review and respond to this request.</p>
        <a href="${APP_URL}/dashboard/requests" style="display: inline-block; padding: 10px 20px; background-color: #2678E7; color: white; text-decoration: none; border-radius: 5px; margin-top: 10px;">View Request</a>
        <p style="margin-top: 20px; color: #666; font-size: 12px;">This is an automated message from the RAF-SP Asset Management System.</p>
      </div>
    `,
  },
  {
    subject: "Request Approved: Electric Resistivity Meter",
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #22c55e;">Request Approved</h2>
        <p>Hello Dr. Muhammad Arshad,</p>
        <p>Great news! Your request for <strong>Electric Resistivity Meter</strong> has been approved.</p>
        <p>Your request has been approved. Borrowing duration: 30 days starting from 2026-03-27.</p>
        <a href="${APP_URL}/dashboard/requests" style="display: inline-block; padding: 10px 20px; background-color: #22c55e; color: white; text-decoration: none; border-radius: 5px; margin-top: 10px;">View Details</a>
        <p style="margin-top: 20px; color: #666; font-size: 12px;">This is an automated message from the RAF-SP Asset Management System.</p>
      </div>
    `,
  },
  {
    subject: "Request Rejected: Hand Boring Plant",
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #ef4444;">Request Rejected</h2>
        <p>Hello Dr. Khalid Mehmood,</p>
        <p>Unfortunately, your request for <strong>Hand Boring Plant</strong> has been rejected.</p>
        <p>Reason: Equipment is currently undergoing scheduled maintenance and will not be available for the next 45 days.</p>
        <a href="${APP_URL}/dashboard/requests" style="display: inline-block; padding: 10px 20px; background-color: #6b7280; color: white; text-decoration: none; border-radius: 5px; margin-top: 10px;">View Details</a>
        <p style="margin-top: 20px; color: #666; font-size: 12px;">This is an automated message from the RAF-SP Asset Management System.</p>
      </div>
    `,
  },
  {
    subject: "Request Expiring Soon: Spectrophotometer UV-Vis",
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #eab308;">Request Expiring Soon</h2>
        <p>Hello Dr. Asifa Hameed,</p>
        <p>A request for <strong>Spectrophotometer UV-Vis</strong> will expire in 2 days if not reviewed.</p>
        <p>Please review this pending request before it expires on 2026-03-28.</p>
        <a href="${APP_URL}/dashboard/requests" style="display: inline-block; padding: 10px 20px; background-color: #eab308; color: white; text-decoration: none; border-radius: 5px; margin-top: 10px;">Review Now</a>
        <p style="margin-top: 20px; color: #666; font-size: 12px;">This is an automated message from the RAF-SP Asset Management System.</p>
      </div>
    `,
  },
  {
    subject: "Request Expired: Power Drilling Rig",
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #6b7280;">Request Expired</h2>
        <p>Hello Dr. Khalid Mehmood,</p>
        <p>Your request for <strong>Power Drilling Rig</strong> has expired without approval.</p>
        <p>The request was not reviewed within the 15-day window and has been automatically expired. You may submit a new request if needed.</p>
        <a href="${APP_URL}/dashboard/requests" style="display: inline-block; padding: 10px 20px; background-color: #6b7280; color: white; text-decoration: none; border-radius: 5px; margin-top: 10px;">View Requests</a>
        <p style="margin-top: 20px; color: #666; font-size: 12px;">This is an automated message from the RAF-SP Asset Management System.</p>
      </div>
    `,
  },
  {
    subject: "Resource Borrowed: Autoclave Sterilizer",
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #2678E7;">Resource Borrowed</h2>
        <p>Hello Dr. Asifa Hameed,</p>
        <p><strong>Autoclave Sterilizer</strong> has been borrowed by Cotton Research Institute.</p>
        <p>The borrowing period has started. Expected return date: 2026-04-26.</p>
        <a href="${APP_URL}/dashboard/requests" style="display: inline-block; padding: 10px 20px; background-color: #2678E7; color: white; text-decoration: none; border-radius: 5px; margin-top: 10px;">View Details</a>
        <p style="margin-top: 20px; color: #666; font-size: 12px;">This is an automated message from the RAF-SP Asset Management System.</p>
      </div>
    `,
  },
  {
    subject: "Return Due Soon: Digital Analytical Balance",
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #eab308;">Return Due Soon</h2>
        <p>Hello Dr. Muhammad Arshad,</p>
        <p>The borrowed resource <strong>Digital Analytical Balance</strong> is due for return in 3 days.</p>
        <p>Please arrange to return the resource by 2026-03-29 to avoid overdue status.</p>
        <p>Please ensure the resource is returned on time.</p>
        <a href="${APP_URL}/dashboard/requests" style="display: inline-block; padding: 10px 20px; background-color: #eab308; color: white; text-decoration: none; border-radius: 5px; margin-top: 10px;">View Details</a>
        <p style="margin-top: 20px; color: #666; font-size: 12px;">This is an automated message from the RAF-SP Asset Management System.</p>
      </div>
    `,
  },
  {
    subject: "URGENT: Resource Overdue: Compound Microscope",
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #ef4444;">Resource Overdue</h2>
        <p>Hello Dr. Muhammad Arshad,</p>
        <p><strong>URGENT:</strong> The resource <strong>Compound Microscope</strong> is overdue for return.</p>
        <p>This resource was due on 2026-03-20 and is now 6 days overdue. Please return it immediately.</p>
        <p>Please return the resource immediately.</p>
        <a href="${APP_URL}/dashboard/requests" style="display: inline-block; padding: 10px 20px; background-color: #ef4444; color: white; text-decoration: none; border-radius: 5px; margin-top: 10px;">Take Action</a>
        <p style="margin-top: 20px; color: #666; font-size: 12px;">This is an automated message from the RAF-SP Asset Management System.</p>
      </div>
    `,
  },
  {
    subject: "Resource Returned: Bulldozer CAT D6",
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #22c55e;">Resource Returned</h2>
        <p>Hello Dr. Asifa Hameed,</p>
        <p><strong>Bulldozer CAT D6</strong> has been returned by Mango Research Institute.</p>
        <p>The resource has been returned and is now available in your inventory again.</p>
        <a href="${APP_URL}/dashboard/requests" style="display: inline-block; padding: 10px 20px; background-color: #22c55e; color: white; text-decoration: none; border-radius: 5px; margin-top: 10px;">View Details</a>
        <p style="margin-top: 20px; color: #666; font-size: 12px;">This is an automated message from the RAF-SP Asset Management System.</p>
      </div>
    `,
  },
];

async function main() {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    console.error("RESEND_API_KEY not set in .env");
    process.exit(1);
  }

  const resend = new Resend(apiKey);

  console.log(`Sending ${emails.length} test emails to ${TO_EMAIL}...\n`);

  for (let i = 0; i < emails.length; i++) {
    const email = emails[i];
    const { data, error } = await resend.emails.send({
      from: FROM_EMAIL,
      to: TO_EMAIL,
      subject: email.subject,
      html: email.html,
    });

    if (error) {
      console.error(`[${i + 1}/9] FAILED: ${email.subject}`);
      console.error("  Error:", error);
    } else {
      console.log(`[${i + 1}/9] SENT: ${email.subject} (${data?.id})`);
    }

    // Small delay to avoid rate limiting
    if (i < emails.length - 1) {
      await new Promise((r) => setTimeout(r, 500));
    }
  }

  console.log("\nDone!");
}

main();
