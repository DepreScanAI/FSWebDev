import { google } from 'googleapis';

const getGmailClient = () => {
  const clientId = process.env.OAUTH_CLIENT_ID;
  const clientSecret = process.env.OAUTH_CLIENT_SECRET;
  const refreshToken = process.env.OAUTH_REFRESH_TOKEN;

  if (!clientId || !clientSecret || !refreshToken || !process.env.OAUTH_EMAIL) {
    console.warn(
      '[EMAIL] OAUTH env vars tidak lengkap, email tidak akan terkirim.',
    );
    return null;
  }

  const oauth2Client = new google.auth.OAuth2(
    clientId,
    clientSecret,
    'https://developers.google.com/oauthplayground',
  );

  oauth2Client.setCredentials({ refresh_token: refreshToken });

  return google.gmail({ version: 'v1', auth: oauth2Client });
};

const buildRawEmail = ({ from, to, subject, html, text }) => {
  const boundary = `boundary_${Date.now()}`;
  const lines = [
    `From: ${from}`,
    `To: ${to}`,
    `Subject: ${subject}`,
    'MIME-Version: 1.0',
    `Content-Type: multipart/alternative; boundary="${boundary}"`,
    '',
    `--${boundary}`,
    'Content-Type: text/plain; charset=UTF-8',
    '',
    text,
    '',
    `--${boundary}`,
    'Content-Type: text/html; charset=UTF-8',
    '',
    html,
    '',
    `--${boundary}--`,
  ];

  return Buffer.from(lines.join('\r\n'))
    .toString('base64')
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '');
};

const sendPasswordResetEmail = async (toEmail, toName, resetLink) => {
  const gmail = getGmailClient();
  const from =
    process.env.EMAIL_FROM || `DepreScan <${process.env.OAUTH_EMAIL}>`;

  if (!gmail) {
    console.log('\n─── [DEV] PASSWORD RESET EMAIL ───────────────────');
    console.log(`To      : ${toEmail}`);
    console.log(`Name    : ${toName}`);
    console.log(`Reset   : ${resetLink}`);
    console.log('───────────────────────────────────────────────────\n');
    return;
  }

  const html = `<!DOCTYPE html>
<html lang="id">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width,initial-scale=1">
  <title>Reset Password DepreScan</title>
</head>
<body style="margin:0;padding:0;background:#f3f3f8;font-family:'Helvetica Neue',Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" role="presentation">
    <tr>
      <td align="center" style="padding:48px 16px;">
        <table width="100%" style="max-width:480px;" cellpadding="0" cellspacing="0" role="presentation">
          <tr>
            <td align="center" style="padding-bottom:24px;">
              <span style="font-size:22px;font-weight:800;color:#2a4891;letter-spacing:-0.5px;">DepreScan</span>
            </td>
          </tr>
          <tr>
            <td style="background:#ffffff;border-radius:16px;overflow:hidden;border:1px solid #d5dff5;">
              <table width="100%" cellpadding="0" cellspacing="0" role="presentation">
                <tr>
                  <td style="background:#2a4891;padding:28px 32px;text-align:center;">
                    <p style="margin:0 0 4px;color:rgba(255,255,255,0.6);font-size:12px;text-transform:uppercase;letter-spacing:1px;">Keamanan Akun</p>
                    <h1 style="margin:0;color:#ffffff;font-size:22px;font-weight:700;">Reset Password</h1>
                  </td>
                </tr>
              </table>
              <table width="100%" cellpadding="0" cellspacing="0" role="presentation">
                <tr>
                  <td style="padding:32px;">
                    <p style="margin:0 0 8px;color:#0d172f;font-size:15px;font-weight:600;">Hai, ${toName || 'Pengguna'}!</p>
                    <p style="margin:0 0 24px;color:#6b7280;font-size:14px;line-height:1.7;">
                      Kami menerima permintaan untuk mereset password akun <strong style="color:#2a4891;">DepreScan</strong> Anda. Klik tombol di bawah untuk melanjutkan.
                    </p>
                    <table width="100%" cellpadding="0" cellspacing="0" role="presentation" style="margin-bottom:24px;">
                      <tr>
                        <td style="background:#eaeffa;border-radius:8px;padding:12px 16px;">
                          <p style="margin:0;color:#2a4891;font-size:13px;line-height:1.6;">
                            Link ini hanya berlaku selama <strong>1 jam</strong> dan hanya bisa digunakan sekali.
                          </p>
                        </td>
                      </tr>
                    </table>
                    <table width="100%" cellpadding="0" cellspacing="0" role="presentation">
                      <tr>
                        <td align="center" style="padding-bottom:24px;">
                          <a href="${resetLink}" style="display:inline-block;background:#2a4891;color:#ffffff;font-size:14px;font-weight:600;text-decoration:none;padding:13px 32px;border-radius:10px;">
                            Reset Password Saya
                          </a>
                        </td>
                      </tr>
                    </table>
                    <table width="100%" cellpadding="0" cellspacing="0" role="presentation">
                      <tr>
                        <td style="background:#f3f3f8;border-radius:8px;padding:12px 16px;">
                          <p style="margin:0 0 6px;color:#9ca3af;font-size:11px;text-transform:uppercase;letter-spacing:0.5px;">Atau salin tautan ini ke browser Anda:</p>
                          <a href="${resetLink}" style="color:#2a4891;font-size:12px;word-break:break-all;text-decoration:none;">${resetLink}</a>
                        </td>
                      </tr>
                    </table>
                    <hr style="border:none;border-top:1px solid #e5e7eb;margin:24px 0 20px;">
                    <p style="margin:0;color:#9ca3af;font-size:12px;line-height:1.7;">
                      Jika Anda tidak meminta reset password, abaikan email ini - akun Anda tetap aman.
                    </p>
                  </td>
                </tr>
              </table>
              <table width="100%" cellpadding="0" cellspacing="0" role="presentation">
                <tr>
                  <td style="background:#f3f3f8;border-top:1px solid #d5dff5;padding:16px 32px;text-align:center;">
                    <p style="margin:0;color:#9ca3af;font-size:11px;">© 2026 DepreScan</p>
                    <p style="margin:4px 0 0;color:#afbfeb;font-size:11px;">Platform deteksi dini risiko depresi berbasis gaya hidup</p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;

  const text = `
Hai, ${toName || 'Pengguna'}!

Kami menerima permintaan reset password untuk akun DepreScan Anda.

Klik tautan berikut untuk mereset password (berlaku 1 jam):
${resetLink}

Jika Anda tidak meminta reset password, abaikan email ini. Akun Anda tetap aman.

— Tim DepreScan
`.trim();

  const raw = buildRawEmail({
    from,
    to: toEmail,
    subject: 'Reset Password DepreScan',
    html,
    text,
  });

  const result = await gmail.users.messages.send({
    userId: 'me',
    requestBody: { raw },
  });

  console.log(`[EMAIL] Email terkirim ke ${toEmail}, id: ${result.data.id}`);
};

export { sendPasswordResetEmail };
