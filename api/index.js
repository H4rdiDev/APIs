import { json } from 'micro';
import Cors from 'micro-cors';
import swaggerUi from 'swagger-ui-express';
import swaggerJsdoc from 'swagger-jsdoc';
import { router, get } from 'microrouter';
import serveStatic from 'serve-static';
import path from 'path';

const cors = Cors();

// Simpan API keys di sini (untuk demo saja, sebaiknya simpan di tempat yang lebih aman)
const API_KEYS = ['123456', 'abcdef'];

// Middleware untuk memeriksa API key
const checkApiKey = (handler) => (req, res) => {
  const apiKey = req.headers['x-api-key'];
  if (API_KEYS.includes(apiKey)) {
    return handler(req, res);
  } else {
    res.status(403).json({ error: 'Forbidden - Invalid API Key' });
  }
};

// Konfigurasi Swagger
const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'HardiDev-APIs',
      version: '1.0.0 BETA',
      description: 'Free API for everyone.',
      contact: {
        name: 'Developer',
        email: 'developer@example.com',
      },
      license: {
        name: 'Apache 2.0',
        url: 'https://www.apache.org/licenses/LICENSE-2.0.html',
      },
    },
    servers: [
      {
        url: 'http://localhost:3000',
      },
    ],
  },
  apis: ['./api/index.js'], // File dengan anotasi Swagger
};

const specs = swaggerJsdoc(options);

// Serve favicon
const serveFavicon = serveStatic(path.join(__dirname, '../api.ico'));

// Handler untuk protected data
const getProtectedData = (req, res) => {
  res.json({ message: 'This is protected data' });
};

// Handler untuk Swagger UI
const swaggerHandler = (req, res) => {
  swaggerUi.setup(specs)(req, res);
};

// API routes
export default cors(
  router(
    get('/api/protected', checkApiKey(getProtectedData)),
    get('/api-docs', swaggerHandler),
    get('/api.ico', serveFavicon)
  )
);
