import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import multer from 'multer';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:5173';

app.use(cors({
  origin: FRONTEND_URL,
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 }
});

const SYSTEM_PROMPT = `You are an expert lecturer and tutor. Teach clearly based on the student's level.

Explain the following question using this format:

1. SIMPLE EXPLANATION:
2. STEP-BY-STEP SOLUTION:
3. KEY CONCEPTS:
4. REAL-LIFE ANALOGY:
5. COMMON MISTAKES:
6. FINAL ANSWER:

Rules:
- Use simple and clear language
- Adjust difficulty based on level
- Be structured and readable
- Be thorough but concise`;

const SIMPLIFY_PROMPT = `Explain the following content again in the simplest way possible, like teaching a 10-year-old. Use short sentences and very basic language. Keep the same 6-section format (SIMPLE EXPLANATION, STEP-BY-STEP SOLUTION, KEY CONCEPTS, REAL-LIFE ANALOGY, COMMON MISTAKES, FINAL ANSWER).

Content:
`;

app.post('/api/explain', upload.single('image'), async (req, res) => {
  try {
    const { question, level, mode, previousResponse } = req.body;
    const image = req.file;

    if (!question && !previousResponse && !image) {
      return res.status(400).json({ error: 'Question, image, or previous response is required' });
    }

    let systemPrompt = SYSTEM_PROMPT;
    let userContent = [];

    if (mode === 'simple' && previousResponse) {
      userContent.push({
        type: 'text',
        text: SIMPLIFY_PROMPT + previousResponse
      });
      systemPrompt = 'You are a patient teacher who explains things in the simplest way possible.';
    } else {
      let textContent = `Student Level: ${level}\n\nQuestion:\n${question || '(See image below)'}`;
      userContent.push({ type: 'text', text: textContent });

      if (image) {
        const base64Image = image.buffer.toString('base64');
        const mimeType = image.mimetype || 'image/jpeg';
        userContent.push({
          type: 'image_url',
          image_url: {
            url: `data:${mimeType};base64,${base64Image}`
          }
        });
      }
    }

    const apiKey = process.env.OPENROUTER_API_KEY;
    const model = 'anthropic/claude-3-haiku-20241107';
    const url = 'https://openrouter.ai/api/v1/chat/completions';

    const requestBody = {
      model: model,
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userContent }
      ],
      max_tokens: 2000,
      temperature: 0.7
    };

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
        'HTTP-Referer': FRONTEND_URL,
        'X-Title': 'Smart Assignment Explainer'
      },
      body: JSON.stringify(requestBody)
    });

    const data = await response.json();

    if (!response.ok) {
      console.error('OpenRouter API Error:', response.status);
      return res.status(response.status).json({ error: data.error?.message || 'OpenRouter API error' });
    }

    const explanation = data.choices?.[0]?.message?.content;

    if (!explanation) {
      return res.status(500).json({ error: 'No explanation returned from OpenRouter' });
    }

    res.json({ explanation });

  } catch (error) {
    console.error('Error:', error.message);
    res.status(500).json({ error: error.message || 'Failed to generate explanation' });
  }
});

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Smart Assignment Explainer API is running with OpenRouter' });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
