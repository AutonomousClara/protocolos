import { Resend } from 'resend';

let resendInstance: Resend | null = null;

function getResend(): Resend {
  if (!resendInstance) {
    if (!process.env.RESEND_API_KEY) {
      throw new Error('RESEND_API_KEY não configurada');
    }
    resendInstance = new Resend(process.env.RESEND_API_KEY);
  }
  return resendInstance;
}

export async function sendMagicLinkEmail(email: string, magicLink: string) {
  const resend = getResend();
  const { data, error } = await resend.emails.send({
    from: 'onboarding@resend.dev',
    to: email,
    subject: '🔐 Seu link de acesso - ProtocolOS',
    html: `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
        </head>
        <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background-color: #0A0A0F; color: #ffffff; padding: 40px 20px;">
          <div style="max-width: 500px; margin: 0 auto; background: linear-gradient(135deg, #13131A 0%, #1a1a2e 100%); border-radius: 16px; padding: 40px; border: 1px solid #2a2a3e;">
            <h1 style="margin: 0 0 20px; font-size: 24px; background: linear-gradient(135deg, #8B5CF6, #EC4899); -webkit-background-clip: text; -webkit-text-fill-color: transparent;">
              ProtocolOS
            </h1>
            
            <p style="color: #a0a0b0; margin: 0 0 30px; line-height: 1.6;">
              Clique no botão abaixo para acessar sua conta. Este link expira em 15 minutos.
            </p>
            
            <a href="${magicLink}" style="display: inline-block; background: linear-gradient(135deg, #8B5CF6, #EC4899); color: white; text-decoration: none; padding: 14px 32px; border-radius: 8px; font-weight: 600; font-size: 16px;">
              Entrar no ProtocolOS
            </a>
            
            <p style="color: #606070; margin: 30px 0 0; font-size: 13px; line-height: 1.5;">
              Se você não solicitou este email, pode ignorá-lo com segurança.
            </p>
            
            <hr style="border: none; border-top: 1px solid #2a2a3e; margin: 30px 0;">
            
            <p style="color: #505060; margin: 0; font-size: 12px;">
              © 2026 ProtocolOS by Clara
            </p>
          </div>
        </body>
      </html>
    `,
  });

  if (error) {
    console.error('Error sending email:', JSON.stringify(error));
    throw new Error(`Falha ao enviar email: ${error.message || JSON.stringify(error)}`);
  }

  return data;
}
