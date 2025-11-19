import { Resend } from "resend";
import { AccessibilityViolation } from "./scanner";

const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;

export function renderScanReportHtml(params: {
  siteUrl: string;
  dashboardUrl: string;
  violations: AccessibilityViolation[];
}) {
  const { siteUrl, dashboardUrl, violations } = params;
  const total = violations.length;
  const grouped = violations.reduce<Record<string, number>>((acc, violation) => {
    const key = violation.impact ?? "unknown";
    acc[key] = (acc[key] ?? 0) + 1;
    return acc;
  }, {});

  const topFive = violations.slice(0, 5);

  const severityOrder = ["critical", "serious", "moderate", "minor", "unknown"];

  const severityBadges = severityOrder
    .filter((label) => grouped[label])
    .map(
      (label) => `
        <span style="display:inline-flex;align-items:center;padding:0.125rem 0.65rem;margin-right:0.25rem;border-radius:999px;font-size:0.75rem;font-weight:600;background-color:${badgeColor(
          label,
        )};color:#fff;text-transform:capitalize;">
          ${grouped[label]} ${label}
        </span>`
    )
    .join("");

  const topRows = topFive
    .map(
      (violation) => `
        <tr>
          <td style="padding:0.5rem;border-bottom:1px solid #e4e4e7;">
            <strong>${violation.id}</strong>
            <p style="margin:0.25rem 0 0;color:#52525b;font-size:0.85rem;">${violation.description}</p>
          </td>
          <td style="padding:0.5rem;border-bottom:1px solid #e4e4e7;text-transform:capitalize;">
            ${violation.impact ?? "unknown"}
          </td>
        </tr>
      `,
    )
    .join("");

  return `
    <table width="100%" cellpadding="0" cellspacing="0" role="presentation" style="font-family:'Inter',-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;background:#f4f4f5;padding:24px;">
      <tr>
        <td align="center">
          <table width="600" cellpadding="0" cellspacing="0" role="presentation" style="background:#fff;border-radius:16px;padding:32px;text-align:left;">
            <tr>
              <td>
                <p style="text-transform:uppercase;font-size:0.75rem;margin-bottom:0.5rem;color:#6366f1;letter-spacing:0.1em;font-weight:600;">Inklight Weekly Report</p>
                <h1 style="margin:0 0 0.5rem;font-size:1.5rem;color:#111">${siteUrl}</h1>
                <p style="margin:0;color:#52525b;">${total} accessibility issue${total === 1 ? "" : "s"} detected in the latest scan.</p>
              </td>
            </tr>
            <tr>
              <td style="padding:1.5rem 0 1rem;">
                ${severityBadges || '<span style="color:#52525b;font-size:0.9rem;">No issues detected 🎉</span>'}
              </td>
            </tr>
            <tr>
              <td>
                <table width="100%" cellpadding="0" cellspacing="0" role="presentation" style="border-collapse:collapse;">
                  <thead>
                    <tr>
                      <th align="left" style="text-transform:uppercase;font-size:0.75rem;color:#71717a;border-bottom:1px solid #e4e4e7;padding-bottom:0.5rem;">Issue</th>
                      <th align="left" style="text-transform:uppercase;font-size:0.75rem;color:#71717a;border-bottom:1px solid #e4e4e7;padding-bottom:0.5rem;">Impact</th>
                    </tr>
                  </thead>
                  <tbody>
                    ${topRows || '<tr><td colspan="2" style="padding:0.75rem 0;color:#16a34a;font-weight:600;">No violations found.</td></tr>'}
                  </tbody>
                </table>
              </td>
            </tr>
            <tr>
              <td style="padding-top:2rem;text-align:center;">
                <a href="${dashboardUrl}" style="display:inline-block;background:#111827;color:#fff;padding:12px 28px;border-radius:999px;font-weight:600;text-decoration:none;">Open dashboard</a>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  `;
}

function badgeColor(impact: string) {
  switch (impact) {
    case "critical":
      return "#dc2626";
    case "serious":
      return "#f97316";
    case "moderate":
      return "#facc15";
    case "minor":
      return "#22c55e";
    default:
      return "#6366f1";
  }
}

export async function sendScanReportEmail(params: {
  to: string;
  siteUrl: string;
  dashboardUrl: string;
  violations: AccessibilityViolation[];
}) {
  if (!process.env.RESEND_API_KEY || !resend) {
    console.warn("RESEND_API_KEY missing, skipping email send");
    return;
  }

  const html = renderScanReportHtml(params);

  await resend.emails.send({
    from: "Inklight <reports@a11yscan.dev>",
    to: params.to,
    subject: `Accessibility report for ${params.siteUrl}`,
    html,
  });
}
