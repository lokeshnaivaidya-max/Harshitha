import express from 'express';
import path from 'path';
import fs from 'fs';
import { createServer as createViteServer } from 'vite';

const PORT = 3000;
const DATA_DIR = path.join(process.cwd(), 'data');
const DATA_FILE = path.join(DATA_DIR, 'gallery-data.json');

// Ensure data directory exists
if (!fs.existsSync(DATA_DIR)) {
  try {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  } catch (e) {
    console.error('Error creating data directory:', e);
  }
}

function getStoredData() {
  try {
    if (fs.existsSync(DATA_FILE)) {
      const content = fs.readFileSync(DATA_FILE, 'utf-8');
      return JSON.parse(content);
    }
  } catch (err) {
    console.error('Failed to read gallery-data.json:', err);
  }
  return null;
}

function saveStoredData(data: any) {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2), 'utf-8');
    return true;
  } catch (err) {
    console.error('Failed to write gallery-data.json:', err);
    return false;
  }
}

async function startServer() {
  const app = express();

  app.use(express.json({ limit: '50mb' }));
  app.use(express.urlencoded({ limit: '50mb', extended: true }));

  // API endpoints
  app.get('/api/health', (_req, res) => {
    res.json({ status: 'ok', serverTime: new Date().toISOString() });
  });

  app.get('/api/photos', (_req, res) => {
    const data = getStoredData();
    if (data && (data.photos || data.heroPhoto)) {
      res.json({ success: true, data });
    } else {
      res.json({ success: false, data: null });
    }
  });

  app.post('/api/photos', (req, res) => {
    const { photos, heroPhoto } = req.body;
    if (!photos && !heroPhoto) {
      return res.status(400).json({ error: 'Missing photos or heroPhoto' });
    }

    const current = getStoredData() || {};
    const updated = {
      ...current,
      ...(photos ? { photos } : {}),
      ...(heroPhoto !== undefined ? { heroPhoto } : {}),
      updatedAt: new Date().toISOString(),
    };

    const saved = saveStoredData(updated);
    if (saved) {
      res.json({ success: true, message: 'Gallery photos saved to server successfully', data: updated });
    } else {
      res.status(500).json({ error: 'Failed to save photos to server' });
    }
  });

  app.delete('/api/photos', (_req, res) => {
    try {
      if (fs.existsSync(DATA_FILE)) {
        fs.unlinkSync(DATA_FILE);
      }
      res.json({ success: true, message: 'Reset gallery photos on server' });
    } catch (err) {
      res.status(500).json({ error: 'Failed to reset photos' });
    }
  });

  // Vite middleware for development vs static for production
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Birthday server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
