import { sendVerificationEmail } from '../server/mailer';

export default async function handler(req: any, res: any) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  try {
    const data = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
    const info = await sendVerificationEmail(data);
    return res.status(200).json({ success: true, messageId: info.messageId });
  } catch (err: any) {
    console.error('Error sending email on Vercel:', err);
    return res.status(500).json({ success: false, error: err.message });
  }
}
