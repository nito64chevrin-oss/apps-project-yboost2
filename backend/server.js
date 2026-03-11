require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();
const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Servir le frontend
app.use(express.static(path.join(__dirname, '../public')));

// ─── ROUTES API ─────────────────────────────────────────────

// Healthcheck base de donnees (requis par le prof)
app.get('/api/health', async (req, res) => {
  try {
    await prisma.$queryRaw`SELECT 1`;
    res.json({ status: 'ok', database: 'connected', timestamp: new Date().toISOString() });
  } catch (error) {
    res.status(503).json({ status: 'error', database: 'disconnected', error: error.message });
  }
});

// Importer les routes
const productRoutes = require('./routes/products');
const orderRoutes = require('./routes/orders');
const weatherRoutes = require('./routes/weather');

app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/weather', weatherRoutes);

// Fallback -> index.html
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../public/index.html'));
});

// ─── DEMARRAGE ──────────────────────────────────────────────
app.listen(PORT, () => {
  console.log(`Serveur lance sur http://localhost:${PORT}`);
});

module.exports = app;
