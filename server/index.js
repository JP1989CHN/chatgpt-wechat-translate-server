const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const axios = require('axios');
const app = express();

app.use(cors());
app.use(bodyParser.json());

const API_KEY = process.env.OPENAI_API_KEY || '你的_OPENAI_API_KEY';

app.post('/translate', async (req, res) => {
  const { text } = req.body;
  const messages = [
    { role: 'system', content: '你是一个翻译助手，中文翻译成英文，英文翻译成中文。' },
    { role: 'user', content: text }
  ];
  try {
    const response = await axios.post(
      'https://api.openai.com/v1/chat/completions',
      { model: 'gpt-3.5-turbo', messages },
      { headers: {
        Authorization: `Bearer ${API_KEY}`,
        'Content-Type': 'application/json'
      }}
    );
    const result = response.data.choices[0].message.content.trim();
    res.json({ result });
  } catch (err) {
    console.error(err.response?.data || err);
    res.status(500).json({ error: '翻译失败' });
  }
});

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Server listening on port ${port}`));