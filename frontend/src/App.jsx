import React, { useState } from 'react';
import axios from 'axios';
import InputForm from './components/InputForm';
import OutputDisplay from './components/OutputDisplay';

const API_URL = 'http://localhost:5000/api';

function App() {
  const [question, setQuestion] = useState('');
  const [level, setLevel] = useState('Beginner');
  const [response, setResponse] = useState('');
  const [loading, setLoading] = useState(false);

  const handleExplain = async () => {
    if (!question.trim()) return;

    setLoading(true);
    try {
      const res = await axios.post(`${API_URL}/explain`, {
        question,
        level,
        mode: 'normal',
      });
      setResponse(res.data.explanation);
    } catch (error) {
      console.error('Error:', error);
      setResponse('Sorry, there was an error generating the explanation. Please try again.');
    }
    setLoading(false);
  };

  const handleSimplify = async () => {
    if (!response) return;

    setLoading(true);
    try {
      const res = await axios.post(`${API_URL}/explain`, {
        question: '',
        level,
        mode: 'simple',
        previousResponse: response,
      });
      setResponse(res.data.explanation);
    } catch (error) {
      console.error('Error:', error);
      setResponse('Sorry, there was an error simplifying the explanation. Please try again.');
    }
    setLoading(false);
  };

  return (
    <div className="app">
      <header className="header">
        <h1>Smart Assignment Explainer AI</h1>
        <p>Get step-by-step explanations for any academic question</p>
      </header>

      <InputForm
        question={question}
        setQuestion={setQuestion}
        level={level}
        setLevel={setLevel}
        onExplain={handleExplain}
        onSimplify={handleSimplify}
        loading={loading}
        hasResponse={!!response}
      />

      <OutputDisplay response={response} loading={loading} />
    </div>
  );
}

export default App;
