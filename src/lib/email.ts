import { Resend } from "resend";

let resendInstance: Resend | null = null;

export function getResendClient(): Resend | null {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey || apiKey.trim() === "") {
    return null;
  }
  if (!resendInstance) {
    resendInstance = new Resend(apiKey);
  }
  return resendInstance;
}

const SUBJECT_MAP: Record<string, string> = {
  FUNDING_PARTNERS: "Funding & Partnerships",
  JOIN_MOVEMENT: "Joining the Introlic Movement",
  GENERAL_QUERY: "General Inquiry",
  BUG_REPORT: "Bug Report & Feedback",
  CAREERS: "Career Opportunities",
  PROJECT_IDEA: "Project Submission & Proposal",
  SUPPORT: "Technical & Operational Support",
};

export function formatSubjectLabel(raw: string | undefined | null): string {
  if (!raw) return "Inquiry";
  if (SUBJECT_MAP[raw]) return SUBJECT_MAP[raw];
  return raw
    .replace(/_/g, " ")
    .toLowerCase()
    .replace(/\b\w/g, (c) => c.toUpperCase());
}

export function generateIntrolicEmailHtml({
  recipientName,
  replyText,
  originalSubject,
  originalMessage,
}: {
  recipientName: string;
  replyText: string;
  originalSubject?: string;
  originalMessage?: string;
}) {
  const formattedReply = replyText
    .split("\n")
    .map(p => p.trim())
    .filter(p => p.length > 0)
    .map(p => `<p style="margin: 0 0 16px 0; line-height: 1.65; color: #e5e5e5; font-size: 14.5px;">${p}</p>`)
    .join("");

  const displaySubject = originalSubject ? formatSubjectLabel(originalSubject) : "";

  const originalSnippet = originalMessage
    ? `<div style="margin-top: 32px; padding: 18px 20px; background-color: #111111; border-left: 3px solid #333333; border-radius: 6px;">
        <p style="margin: 0 0 6px 0; font-size: 11px; text-transform: uppercase; letter-spacing: 1px; color: #888888; font-family: monospace;">Previous Inquiry</p>
        ${displaySubject ? `<p style="margin: 0 0 8px 0; font-weight: 600; color: #cccccc; font-size: 13px;">Subject: ${displaySubject}</p>` : ""}
        <p style="margin: 0; font-size: 13px; color: #999999; line-height: 1.5; font-style: italic;">"${originalMessage.length > 300 ? originalMessage.slice(0, 300) + '...' : originalMessage}"</p>
      </div>`
    : "";

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Response from Introlic</title>
</head>
<body style="margin: 0; padding: 0; background-color: #050505; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #ffffff;">
  <table width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color: #050505; padding: 40px 16px;">
    <tr>
      <td align="center">
        <table width="100%" border="0" cellspacing="0" cellpadding="0" style="max-width: 580px; background-color: #0a0a0a; border: 1px solid #1f1f1f; border-radius: 16px; overflow: hidden; box-shadow: 0 10px 30px rgba(0,0,0,0.5);">
          
          <!-- Header -->
          <tr>
            <td style="padding: 28px 36px 24px 36px; border-bottom: 1px solid #1a1a1a;">
              <table width="100%" border="0" cellspacing="0" cellpadding="0">
                <tr>
                  <td>
                    <table border="0" cellspacing="0" cellpadding="0">
                      <tr>
                        <td style="vertical-align: middle; padding-right: 12px;">
                          <img src="https://introlic.in/introlic-white-icon.png" alt="Introlic Logo" width="28" height="28" style="display: block; border: 0; outline: none;" />
                        </td>
                        <td style="vertical-align: middle;">
                          <span style="font-size: 19px; font-weight: 800; letter-spacing: -0.5px; color: #ffffff; text-decoration: none;">INTROLiC</span>
                        </td>
                      </tr>
                    </table>
                  </td>
                  <td align="right">
                    <span style="font-size: 10px; font-family: monospace; text-transform: uppercase; letter-spacing: 1.5px; color: #888888; background: #141414; padding: 5px 12px; border-radius: 9999px; border: 1px solid #262626;">Official Response</span>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Main Content -->
          <tr>
            <td style="padding: 32px 36px 28px 36px;">
              <div style="color: #e0e0e0;">
                ${formattedReply}
              </div>

              ${originalSnippet}

              <!-- Signature -->
              <div style="margin-top: 36px; padding-top: 24px; border-top: 1px solid #1a1a1a;">
                <p style="margin: 0 0 4px 0; font-size: 13.5px; font-weight: 700; color: #ffffff;">The Introlic Team</p>
                <p style="margin: 0 0 8px 0; font-size: 12px; color: #888888;">Foundational AI Research & Engineering</p>
                <p style="margin: 0; font-size: 12px;"><a href="https://introlic.in" style="color: #ffffff; text-decoration: none; font-weight: 600;">https://introlic.in</a></p>
              </div>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="padding: 20px 36px; background-color: #070707; border-top: 1px solid #141414; text-align: center;">
              <p style="margin: 0; font-size: 11px; color: #555555; line-height: 1.5;">
                &copy; ${new Date().getFullYear()} Introlic. All rights reserved. This email was sent in response to your inquiry submitted on <a href="https://introlic.in" style="color: #777777; text-decoration: underline;">introlic.in</a>.
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}
