const express = require("express");
const cors = require("cors");
const { StreamChat } = require("stream-chat");

const app = express();
app.use(cors());

// DEBUG LOGGING: Print your env vars (be careful with secrets in production!)
console.log("STREAM_API_KEY:", process.env.STREAM_API_KEY);
console.log("STREAM_API_SECRET (first 8 chars):", process.env.STREAM_API_SECRET?.slice(0, 8) + '...');

const api_key = process.env.STREAM_API_KEY;
const api_secret = process.env.STREAM_API_SECRET;

if (!api_key || !api_secret) {
  console.error("Missing STREAM_API_KEY or STREAM_API_SECRET environment variable!");
  process.exit(1);
}

app.get("/token", (req, res) => {
  const { user_id } = req.query;
  if (!user_id) return res.status(400).json({ error: "user_id required" });

  // create a Stream Chat server client
  const serverClient = StreamChat.getInstance(api_key, api_secret);

  // create user token
  try {
    const token = serverClient.createToken(user_id);
    res.json({ token });
  } catch (err) {
    console.error("Error creating token:", err);
    res.status(500).json({ error: "Failed to create token" });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Stream token server running on port ${PORT}`);
});
