import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import { defineConfig, type Plugin } from 'vite'
import { sendVerificationEmail } from './server/mailer.ts'
import fs from 'fs'
import path from 'path'

function bgvApiPlugin(): Plugin {
  const dataFilePath = path.resolve(process.cwd(), 'server', 'requests_db.json');

  const getDbRequests = () => {
    try {
      if (fs.existsSync(dataFilePath)) {
        return JSON.parse(fs.readFileSync(dataFilePath, 'utf-8'));
      }
    } catch (e) {
      console.error('Error reading requests_db.json:', e);
    }
    return [];
  };

  const saveDbRequests = (data: any[]) => {
    try {
      fs.writeFileSync(dataFilePath, JSON.stringify(data, null, 2), 'utf-8');
    } catch (e) {
      console.error('Error writing requests_db.json:', e);
    }
  };

  return {
    name: 'bgv-api-plugin',
    configureServer(server) {
      // 1. Sync Requests DB Endpoint
      server.middlewares.use('/api/requests', (req, res, next) => {
        if (req.method === 'GET') {
          const data = getDbRequests();
          res.setHeader('Content-Type', 'application/json');
          res.statusCode = 200;
          return res.end(JSON.stringify(data));
        }

        if (req.method === 'POST') {
          let body = '';
          req.on('data', (chunk) => { body += chunk; });
          req.on('end', () => {
            try {
              const updated = JSON.parse(body);
              if (Array.isArray(updated)) {
                saveDbRequests(updated);
              }
              res.setHeader('Content-Type', 'application/json');
              res.statusCode = 200;
              return res.end(JSON.stringify({ success: true }));
            } catch (err: any) {
              res.statusCode = 400;
              return res.end(JSON.stringify({ success: false, error: err.message }));
            }
          });
          return;
        }

        next();
      });

      // 2. SMTP Mailer Endpoint
      server.middlewares.use('/api/send-email', async (req, res) => {
        if (req.method !== 'POST') {
          res.statusCode = 405;
          return res.end('Method Not Allowed');
        }

        let body = '';
        req.on('data', (chunk) => {
          body += chunk;
        });

        req.on('end', async () => {
          try {
            const data = JSON.parse(body);
            console.log('📬 [SMTP] Dispatching Netbounce BGV email to:', data.to);
            const info = await sendVerificationEmail(data);
            console.log('✅ [SMTP] Email sent successfully! MessageId:', info.messageId);

            res.setHeader('Content-Type', 'application/json');
            res.statusCode = 200;
            res.end(JSON.stringify({ success: true, messageId: info.messageId }));
          } catch (err: any) {
            console.error('❌ [SMTP] Error sending email:', err);
            res.setHeader('Content-Type', 'application/json');
            res.statusCode = 500;
            res.end(JSON.stringify({ success: false, error: err.message }));
          }
        });
      });
    },
  };
}

// https://vite.dev/config/
export default defineConfig({
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  plugins: [
    react(),
    tailwindcss(),
    bgvApiPlugin(),
  ],
})
