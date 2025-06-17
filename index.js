const express = require('express');
const cors = require('cors');
const { StreamChat } = require('stream-chat');

const app = express();
app.use(cors());
app.use(express.json());

const API_KEY = process.env.STREAM_API_KEY;
const API_SECRET = process.env.STREAM_API_SECRET;

// Debug logging for deployment troubleshooting
console.log('API_KEY:', API_KEY);
console.log('API_SECRET is set:', !!API_SECRET);

if (!API_KEY || !API_SECRET) {
  console.error('Missing STREAM_API_KEY or STREAM_API_SECRET environment variable!');
  process.exit(1); // Stop server if not configured
}

const serverClient = StreamChat.getInstance(API_KEY, API_SECRET);

app.get('/token', (req, res) => {
  const userId = req.query.user_id;
  if (!userId) return res.status(400).json({ error: 'Missing user_id param' });

  try {
    const token = serverClient.createToken(userId);
    res.json({ token });
  } catch (err) {
    console.error('Token generation error:', err);
    res.status(500).json({ error: 'Token generation failed', details: err.message });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Stream token server running on port ${PORT}`);
});
