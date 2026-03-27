import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import InputForm from './components/InputForm';
import OutputDisplay from './components/OutputDisplay';

const API_URL = 'http://localhost:5000/api';

function App() {
  const [question, setQuestion] = useState('');
  const [level, setLevel] = useState('Beginner');
  const [response, setResponse] = useState('');
  const [loading, setLoading] = useState(false);
  const [history, setHistory] = useState([]);
  const [selectedHistory, setSelectedHistory] = useState(null);
  const [showHistory, setShowHistory] = useState(false);
  const [image, setImage] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);

  useEffect(() => {
    const saved = localStorage.getItem('explanationHistory');
    if (saved) {
      setHistory(JSON.parse(saved));
    }
  }, []);

  const saveToHistory = useCallback((q, lvl, exp) => {
    const newEntry = {
      id: Date.now(),
      question: q,
      level: lvl,
      explanation: exp,
      timestamp: new Date().toLocaleString(),
    };
    setHistory(prev => {
      const updated = [newEntry, ...prev].slice(0, 50);
      localStorage.setItem('explanationHistory', JSON.stringify(updated));
      return updated;
    });
  }, []);

  const handleExplain = useCallback(async () => {
    const currentQuestion = question.trim();
    console.log('DEBUG - question:', currentQuestion);
    console.log('DEBUG - image:', !!image, 'previewUrl:', !!previewUrl);
    
    if (!currentQuestion && !previewUrl) {
      alert('Please enter a question or upload an image');
      return;
    }

    setLoading(true);
    setResponse('Generating explanation...');
    
    try {
      const payload = {
        question: currentQuestion,
        level,
        mode: 'normal'
      };

      if (previewUrl && image) {
        payload.imageBase64 = previewUrl;
        payload.imageType = image.type || 'image/jpeg';
      }

      const res = await axios.post(`${API_URL}/explain`, payload, {
        headers: { 'Content-Type': 'application/json' }
      });
      
      setResponse(res.data.explanation);
      if (currentQuestion) {
        saveToHistory(currentQuestion, level, res.data.explanation);
      }
      
      setQuestion('');
      setImage(null);
      setPreviewUrl(null);
    } catch (error) {
      console.error('Error:', error.response?.data);
      const errorMsg = error.response?.data?.error || 'Sorry, there was an error generating the explanation. Please try again.';
      setResponse(`Error: ${errorMsg}`);
    }
    setLoading(false);
  }, [question, level, image, previewUrl, saveToHistory]);

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
      const errorMsg = error.response?.data?.error || 'Sorry, there was an error simplifying the explanation. Please try again.';
      setResponse(`Error: ${errorMsg}`);
    }
    setLoading(false);
  };

  const loadFromHistory = (entry) => {
    setQuestion(entry.question);
    setLevel(entry.level);
    setResponse(entry.explanation);
    setSelectedHistory(entry.id);
  };

  const deleteFromHistory = (id, e) => {
    e.stopPropagation();
    const updated = history.filter(h => h.id !== id);
    setHistory(updated);
    localStorage.setItem('explanationHistory', JSON.stringify(updated));
    if (selectedHistory === id) {
      setSelectedHistory(null);
    }
  };

  const clearHistory = () => {
    setHistory([]);
    localStorage.removeItem('explanationHistory');
  };

  return (
    <div className="app">
      <header className="header">
        <div className="header-content">
          <div>
            <h1>Smart Assignment Explainer AI</h1>
            <p>Get step-by-step explanations for any academic question</p>
          </div>
          <button
            className="history-toggle"
            onClick={() => setShowHistory(!showHistory)}
          >
            {showHistory ? '←' : '→'} History
          </button>
        </div>
      </header>

      <div className="main-content">
        <div className="left-panel">
          <InputForm
            question={question}
            setQuestion={setQuestion}
            level={level}
            setLevel={setLevel}
            onExplain={handleExplain}
            onSimplify={handleSimplify}
            loading={loading}
            hasResponse={!!response}
            image={image}
            setImage={setImage}
            previewUrl={previewUrl}
            setPreviewUrl={setPreviewUrl}
          />

          <OutputDisplay response={response} loading={loading} />
        </div>

        <div className={`history-panel ${showHistory ? 'open' : ''}`}>
          <div className="history-header">
            <h2>History</h2>
            {history.length > 0 && (
              <button className="clear-btn" onClick={clearHistory}>Clear All</button>
            )}
          </div>
          <div className="history-list">
            {history.length === 0 ? (
              <p className="no-history">No previous explanations yet</p>
            ) : (
              history.map((entry) => (
                <div
                  key={entry.id}
                  className={`history-item ${selectedHistory === entry.id ? 'selected' : ''}`}
                  onClick={() => loadFromHistory(entry)}
                >
                  <div className="history-item-header">
                    <span className="history-level">{entry.level}</span>
                    <button
                      className="delete-btn"
                      onClick={(e) => deleteFromHistory(entry.id, e)}
                    >
                      ×
                    </button>
                  </div>
                  <p className="history-question">{entry.question}</p>
                  <span className="history-time">{entry.timestamp}</span>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
