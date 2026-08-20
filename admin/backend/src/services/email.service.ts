import nodemailer from 'nodemailer';

interface SendEmailParams {
  to: string;
  recipientName: string;
  subject: string;
  htmlContent: string;
  textContent: string;
}

let testAccount: nodemailer.TestAccount | null = null;

async function getTransporter() {
  const smtpHost = process.env.SMTP_HOST || 'smtp.gmail.com';
  const smtpUser = process.env.SMTP_USER?.trim();
  const rawPass = process.env.SMTP_PASS?.trim();
  const smtpPass = rawPass ? rawPass.replace(/\s+/g, '') : undefined;

  if (smtpUser && smtpPass) {
    return nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: smtpUser,
        pass: smtpPass,
      },
    });
  }

  // Fallback to automatic demo test account with live web preview URL
  if (!testAccount) {
    testAccount = await nodemailer.createTestAccount();
  }

  return nodemailer.createTransport({
    host: 'smtp.ethereal.email',
    port: 587,
    secure: false,
    auth: {
      user: testAccount.user,
      pass: testAccount.pass,
    },
  });
}

export async function sendKatalystEmail({
  to,
  recipientName,
  subject,
  htmlContent,
  textContent,
}: SendEmailParams): Promise<{ messageId: string; previewUrl: string | null; isRealDelivery: boolean }> {
  try {
    const transporter = await getTransporter();
    const isRealDelivery = Boolean(process.env.SMTP_USER && process.env.SMTP_PASS);

    const fromAddress = process.env.EMAIL_FROM || `"Katalyst Admissions Committee" <${process.env.SMTP_USER || 'admissions@katalyst.org'}>`;

    const info = await transporter.sendMail({
      from: fromAddress,
      to: `"${recipientName}" <${to}>`,
      subject,
      text: textContent,
      html: htmlContent,
    });

    const previewUrl = nodemailer.getTestMessageUrl(info) || null;

    console.log(`📧 Email sent to ${to} (ID: ${info.messageId})`);
    if (previewUrl) {
      console.log(`🔗 Live Email Preview URL: ${previewUrl}`);
    }

    return {
      messageId: info.messageId,
      previewUrl,
      isRealDelivery,
    };
  } catch (error) {
    console.error('Failed to send email:', error);
    throw error;
  }
}

export function buildAcceptanceEmailHtml(studentName: string, college: string, trackingId: string): { subject: string; html: string; text: string } {
  const subject = `🎉 Official Admission Offer: Katalyst Women in STEM 4-Year Full Fellowship`;
  const text = `Dear ${studentName},\n\nCongratulations! We are delighted to inform you that your application for the Katalyst Women in STEM 4-Year Full Fellowship has been ACCEPTED!\n\nYour Fellowship Benefits include:\n- 100% Free Brand-New Coding Laptop\n- 4-Year Annual Financial Educational Grant\n- 1:1 Executive Corporate Mentorship\n- Access to Katalyst Tech Labs\n\nPlease log in to your scholar portal at http://localhost:3001/dashboard to view your verified official digital pass.\n\nWarm regards,\nKatalyst Admissions Committee`;

  const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; margin: 0; padding: 0; background-color: #f8fafc; color: #1e293b; }
    .container { max-width: 600px; margin: 30px auto; background-color: #ffffff; border-radius: 20px; overflow: hidden; border: 1px solid #e2e8f0; box-shadow: 0 10px 25px rgba(0,0,0,0.05); }
    .header { background: linear-gradient(135deg, #1e1b4b 0%, #4338ca 50%, #e11d48 100%); padding: 40px 30px; text-align: center; color: #ffffff; }
    .header h1 { margin: 0; font-size: 24px; font-weight: 800; }
    .header p { margin: 8px 0 0; font-size: 13px; opacity: 0.9; }
    .badge { display: inline-block; padding: 5px 12px; border-radius: 50px; background: rgba(255,255,255,0.2); font-size: 11px; font-weight: 700; text-transform: uppercase; margin-bottom: 12px; }
    .content { padding: 35px 30px; }
    .hero-greeting { font-size: 18px; font-weight: 700; color: #0f172a; margin-bottom: 12px; }
    .hero-text { font-size: 14px; line-height: 1.6; color: #475569; margin-bottom: 25px; }
    .benefits-box { background-color: #f5f3ff; border: 1px solid #ddd6fe; border-radius: 16px; padding: 20px; margin-bottom: 25px; }
    .benefits-title { font-size: 13px; font-weight: 800; color: #5b21b6; text-transform: uppercase; margin-bottom: 12px; letter-spacing: 0.5px; }
    .benefit-item { display: flex; align-items: center; font-size: 13px; color: #334155; margin-bottom: 10px; font-weight: 600; }
    .benefit-item:last-child { margin-bottom: 0; }
    .benefit-icon { color: #7c3aed; margin-right: 10px; font-weight: 900; }
    .btn-container { text-align: center; margin: 30px 0; }
    .btn { display: inline-block; padding: 14px 32px; background: linear-gradient(135deg, #e11d48 0%, #4f46e5 100%); color: #ffffff !important; text-decoration: none; font-weight: 800; font-size: 13px; border-radius: 12px; box-shadow: 0 4px 15px rgba(225, 29, 72, 0.35); }
    .meta-box { background-color: #f8fafc; border-radius: 12px; padding: 15px; font-size: 12px; color: #64748b; margin-top: 20px; }
    .footer { background-color: #0f172a; padding: 25px 30px; text-align: center; font-size: 11px; color: #94a3b8; line-height: 1.6; }
    .footer a { color: #fb7185; text-decoration: none; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <div class="badge">Official Admission Offer &bull; Accepted</div>
      <h1>Congratulations, ${studentName}! 🎉</h1>
      <p>Katalyst Women in STEM 4-Year Full Fellowship</p>
    </div>

    <div class="content">
      <div class="hero-greeting">Dear ${studentName},</div>
      <p class="hero-text">
        We are thrilled to officially inform you that following your campus outreach participation and admission review, you have been <strong>ACCEPTED</strong> into the prestigious <strong>Katalyst India Women in STEM 4-Year Fellowship Program</strong>.
      </p>

      <div class="benefits-box">
        <div class="benefits-title">Your 4-Year Fellowship Benefits</div>
        <div class="benefit-item"><span class="benefit-icon">✓</span> <strong>100% Free Brand-New Coding Laptop</strong></div>
        <div class="benefit-item"><span class="benefit-icon">✓</span> <strong>4-Year Annual Financial Grant</strong></div>
        <div class="benefit-item"><span class="benefit-icon">✓</span> <strong>1:1 Executive Corporate Mentorship (Mastercard / Top Tech)</strong></div>
        <div class="benefit-item"><span class="benefit-icon">✓</span> <strong>Access to Katalyst Tech Labs & Placement Prep</strong></div>
      </div>

      <div class="btn-container">
        <a href="http://localhost:3001/dashboard" class="btn" target="_blank">View Official Digital QR Pass & Dashboard &rarr;</a>
      </div>

      <div class="meta-box">
        <strong>Candidate Dossier Info:</strong><br>
        &bull; <strong>Scholar Name:</strong> ${studentName}<br>
        &bull; <strong>Institution:</strong> ${college}<br>
        &bull; <strong>Tracking ID:</strong> ${trackingId}<br>
        &bull; <strong>Admission Status:</strong> <span style="color: #059669; font-weight: bold;">VERIFIED & ACCEPTED</span>
      </div>
    </div>

    <div class="footer">
      <strong>Katalyst India Foundation</strong> &bull; Empowering Women in STEM Leadership<br>
      For admissions assistance, reply to this email or visit <a href="http://localhost:3001">katalystindia.org</a><br>
      &copy; 2025-2026 Katalyst India. All rights reserved.
    </div>
  </div>
</body>
</html>
`;

  return { subject, html, text };
}

export function buildLinkEmailHtml(studentName: string, trackingId: string, eventTitle: string): { subject: string; html: string; text: string } {
  const personalizedUrl = `http://localhost:3001/apply/${trackingId}`;
  const subject = `Complete your Katalyst 4-Year Scholarship Application (${studentName})`;
  const text = `Dear ${studentName},\n\nThank you for registering at our campus drive (${eventTitle}).\n\nPlease complete your 4-step personalized application link below to finalize your eligibility for laptop grant and mentorship:\n${personalizedUrl}\n\nBest wishes,\nKatalyst Admissions Committee`;

  const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; margin: 0; padding: 0; background-color: #f8fafc; color: #1e293b; }
    .container { max-width: 600px; margin: 30px auto; background-color: #ffffff; border-radius: 20px; overflow: hidden; border: 1px solid #e2e8f0; box-shadow: 0 10px 25px rgba(0,0,0,0.05); }
    .header { background: linear-gradient(135deg, #0f172a 0%, #1e1b4b 50%, #e11d48 100%); padding: 35px 30px; text-align: center; color: #ffffff; }
    .header h1 { margin: 0; font-size: 22px; font-weight: 800; }
    .badge { display: inline-block; padding: 4px 12px; border-radius: 50px; background: rgba(255,255,255,0.2); font-size: 10px; font-weight: 700; text-transform: uppercase; margin-bottom: 10px; }
    .content { padding: 35px 30px; }
    .btn-container { text-align: center; margin: 30px 0; }
    .btn { display: inline-block; padding: 14px 30px; background: #e11d48; color: #ffffff !important; text-decoration: none; font-weight: 800; font-size: 13px; border-radius: 12px; }
    .footer { background-color: #0f172a; padding: 20px; text-align: center; font-size: 11px; color: #94a3b8; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <div class="badge">Personalized Enrollment Link Active</div>
      <h1>Scholarship Application Next Steps</h1>
      <p style="margin: 5px 0 0; font-size: 12px; opacity: 0.9;">Campus Outreach Drive: ${eventTitle}</p>
    </div>
    <div class="content">
      <p style="font-size: 15px; font-weight: 700; color: #0f172a;">Hello ${studentName},</p>
      <p style="font-size: 13px; line-height: 1.6; color: #475569;">
        Thank you for participating in our recent campus outreach drive. Your registration has been verified!
      </p>
      <p style="font-size: 13px; line-height: 1.6; color: #475569;">
        Please complete your <strong>4-step scholarship enrollment form</strong> to qualify for free laptop distribution, annual financial grants, and 1:1 corporate mentorship.
      </p>
      <div class="btn-container">
        <a href="${personalizedUrl}" class="btn" target="_blank">Complete 4-Step Application Now &rarr;</a>
      </div>
      <p style="font-size: 11px; color: #64748b; text-align: center;">
        Direct link: <a href="${personalizedUrl}" style="color: #e11d48;">${personalizedUrl}</a>
      </p>
    </div>
    <div class="footer">
      &copy; 2025-2026 Katalyst India Foundation &bull; Women in STEM
    </div>
  </div>
</body>
</html>
`;

  return { subject, html, text };
}
