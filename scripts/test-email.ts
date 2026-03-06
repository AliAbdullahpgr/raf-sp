import { Resend } from "resend";
import dotenv from "dotenv";

dotenv.config();

async function main() {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    console.error("RESEND_API_KEY not set in .env");
    process.exit(1);
  }

  const resend = new Resend(apiKey);

  console.log("Sending test email to ilabhaia1234@gmail.com...");

  const { data, error } = await resend.emails.send({
    from: "RAF-SP <onboarding@resend.dev>",
    to: "ilabhaia1234@gmail.com",
    subject: "RAF-SP Test Email - Email System Working!",
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #2678E7;">RAF-SP Email System Test</h2>
        <p>Hello,</p>
        <p>This is a test email from the <strong>RAF-SP Asset Management System</strong>.</p>
        <p>If you received this, the email notification system is working correctly.</p>
        <div style="background: #f0f9ff; border-left: 4px solid #2678E7; padding: 12px 16px; margin: 20px 0;">
          <p style="margin: 0; font-weight: bold;">Email Features:</p>
          <ul style="margin: 8px 0;">
            <li>Resource request notifications to department focal persons</li>
            <li>Borrow expiry reminders (3 days before)</li>
            <li>Overdue return alerts</li>
          </ul>
        </div>
        <p style="margin-top: 20px; color: #666; font-size: 12px;">
          This is an automated test from RAF-SP Asset Management System.
        </p>
      </div>
    `,
  });

  if (error) {
    console.error("Failed to send:", error);
  } else {
    console.log("Email sent successfully!");
    console.log("Email ID:", data?.id);
  }
}

main();
