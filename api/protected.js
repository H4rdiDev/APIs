const API_KEYS = ['123456', 'abcdef'];

export default function handler(req, res) {
  const apiKey = req.headers['x-api-key'];
  if (!API_KEYS.includes(apiKey)) {
    return res.status(403).json({ error: 'Forbidden - Invalid API Key' });
  }

  res.status(200).json({ message: 'This is protected data' });
}