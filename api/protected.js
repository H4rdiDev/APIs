import express from 'express';

const app = express();

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

export default app;