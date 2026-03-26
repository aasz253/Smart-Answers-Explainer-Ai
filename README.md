# Smart Assignment Explainer AI

A full-stack web application that helps university students understand academic questions step-by-step using AI.

## Features

- **Question Input**: Paste any academic question
- **Level Selection**: Beginner, Intermediate, or Advanced
- **AI Explanations**: Structured output with:
  - Simple Explanation
  - Step-by-Step Solution
  - Key Concepts
  - Real-Life Analogy
  - Common Mistakes
  - Final Answer
- **Explain Simpler**: Simplify any explanation for easier understanding
- **Copy to Clipboard**: Easy copy functionality

## Tech Stack

- **Frontend**: React + Vite
- **Backend**: Node.js + Express
- **AI**: Google Gemini API (gemini-2.0-flash)

## Quick Start

### Prerequisites

- Node.js 18+ installed
- Gemini API key

### 1. Backend Setup

```bash
cd backend

# Install dependencies
npm install

# The .env file is already configured with your API key
# Start server
npm run dev
```

### 2. Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Start development server
npm run dev
```

### 3. Open in Browser

Navigate to: http://localhost:3000

## Usage

1. Paste your academic question in the textarea
2. Select your difficulty level (Beginner, Intermediate, or Advanced)
3. Click "Explain Question" to get a structured explanation
4. Click "Explain Simpler" if you need an even simpler version

## Sample Test Question

Try this for testing:
> Find the derivative of x^2 + 3x + 2

## Environment Variables

### Backend (.env)

```
GEMINI_API_KEY=your-gemini-api-key
PORT=5000
```

Get your API key at: https://aistudio.google.com/app/apikey

## API Endpoints

### POST /api/explain

Request:
```json
{
  "question": "string",
  "level": "Beginner | Intermediate | Advanced",
  "mode": "normal | simple",
  "previousResponse": "string (for simple mode)"
}
```

Response:
```json
{
  "explanation": "string"
}
```

### GET /api/health

Health check endpoint.
