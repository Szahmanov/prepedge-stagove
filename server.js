const express = require('express');
const path = require('path');
const app = express();

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

const GROQ_API_KEY = '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';

app.post('/api/chat', async (req, res) => {
  try {
    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${GROQ_API_KEY}`
      },
      body: JSON.stringify({
        model: req.body.model || 'llama-3.3-70b-versatile',
        messages: req.body.messages,
        max_tokens: req.body.max_tokens || 1000,
        temperature: req.body.temperature || 0.7
      })
    });

    const data = await response.json();
    if (!response.ok) throw new Error(data.error?.message || 'Groq error');
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`PrepEdge running on port ${PORT}`));
