const express = require('express');
const cors = require('cors');
const { StreamChat } = require('stream-chat');

const app = express();
app.use(cors());
app.use(express.json());

const API_KEY = process.env.STREAM_API_KEY;
const API_SECRET = process.env.STREAM_API_SECRET;

const serverClient = StreamChat.getInstance(API_KEY, API_SECRET);

app.get('/token', (req, res) => {
  const userId = req.query.user_id;
  if (!userId) return res.status(400).json({ error: 'Missing user_id param' });
  const token = serverClient.createToken(userId);
  res.json({ token });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Stream token server running on port ${PORT}`);
});
