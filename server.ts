import express from 'express';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import apiApp from './api/index.ts';

const app = express();
const PORT = 3000;

// Mount the API routes
app.use(apiApp);

// Vite Middleware for development
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  // Only listen to port if we are NOT running on Vercel
  if (!process.env.VERCEL) {
    app.listen(PORT, '0.0.0.0', () => {
      console.log(`Server running on http://localhost:${PORT}`);
    });
  }
}

startServer();

// Export the Express API for Vercel Serverless Functions
export default app;
