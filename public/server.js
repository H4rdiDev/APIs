const express = require('express');
const bodyParser = require('body-parser');
const swaggerUi = require('swagger-ui-express');
const swaggerJsdoc = require('swagger-jsdoc');
const path = require('path');

const app = express();
const PORT = 3000;

// Middleware untuk parsing JSON
app.use(bodyParser.json());

// Simpan API keys di sini (untuk demo saja, sebaiknya simpan di tempat yang lebih aman)
const API_KEYS = ['123456', 'abcdef'];

// Middleware untuk memeriksa API key
const checkApiKey = (req, res, next) => {
  const apiKey = req.headers['x-api-key'];
  if (API_KEYS.includes(apiKey)) {
    next();
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
  apis: ['./server.js'], // File dengan anotasi Swagger
};

const specs = swaggerJsdoc(options);

// Custom CSS untuk menyembunyikan elemen-elemen Swagger
const customCss = `
  .swagger-ui .topbar { 
    display: none !important; 
  }
`;

// Serve favicon
app.get('/api.ico', (req, res) => {
  res.sendFile(path.join(__dirname, 'api.ico'));
});

// Menggunakan Swagger UI dengan custom shortcut icon
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs, {
  customCss,
  customSiteTitle: 'HardiDev-APIs',
  customfavIcon: '/api.ico'
}));

// Sajikan file statis dari folder 'public'
app.use(express.static(path.join(__dirname, 'public')));

/**
 * @swagger
 * /protected:
 *   get:
 *     summary: Get protected data
 *     security:
 *       - apiKeyAuth: []
 *     responses:
 *       200:
 *         description: Successful response
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: This is protected data
 *       403:
 *         description: Forbidden - Invalid API Key
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Forbidden - Invalid API Key
 */
app.get('/protected', checkApiKey, (req, res) => {
  res.json({ message: 'This is protected data' });
});

// Menjalankan server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});