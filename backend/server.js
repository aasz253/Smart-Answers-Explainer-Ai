import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

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

app.post('/api/explain', async (req, res) => {
  try {
    const { question, level, mode, previousResponse } = req.body;

    if (!question && !previousResponse) {
      return res.status(400).json({ error: 'Question or previous response is required' });
    }

    let userMessage;
    let systemPrompt = SYSTEM_PROMPT;

    if (mode === 'simple' && previousResponse) {
      userMessage = SIMPLIFY_PROMPT + previousResponse;
      systemPrompt = 'You are a patient teacher who explains things in the simplest way possible.';
    } else {
      userMessage = `Student Level: ${level}

Question:
${question}`;
    }

    const apiKey = process.env.GEMINI_API_KEY;
    const model = 'gemini-2.0-flash';
    const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;

    const requestBody = {
      contents: [{
        parts: [{
          text: `${systemPrompt}\n\n${userMessage}`
        }]
      }],
      generationConfig: {
        maxOutputTokens: 2000,
        temperature: 0.7,
      },
      safetySettings: [
        { category: "HARM_CATEGORY_HARASSMENT", threshold: "BLOCK_NONE" },
        { category: "HARM_CATEGORY_HATE_SPEECH", threshold: "BLOCK_NONE" },
        { category: "HARM_CATEGORY_SEXUALLY_EXPLICIT", threshold: "BLOCK_NONE" },
        { category: "HARM_CATEGORY_DANGEROUS_CONTENT", threshold: "BLOCK_NONE" }
      ]
    };

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody)
    });

    const data = await response.json();

    if (!response.ok) {
      console.error('Gemini API Error:', response.status, JSON.stringify(data));
      return res.status(response.status).json({ error: data.error?.message || 'Gemini API error', details: data });
    }

    const explanation = data.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!explanation) {
      console.error('No explanation in response:', JSON.stringify(data));
      
      if (data.candidates?.[0]?.finishReason === 'SAFETY') {
        return res.status(400).json({ error: 'Content blocked by safety filters. Please try a different question.' });
      }
      
      return res.status(500).json({ error: 'No explanation returned from Gemini', details: data });
    }

    res.json({ explanation });

  } catch (error) {
    console.error('Error:', error.message);
    res.status(500).json({ error: error.message || 'Failed to generate explanation' });
  }
});

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Smart Assignment Explainer API is running with Gemini' });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
