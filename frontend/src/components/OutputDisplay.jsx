import React, { useState } from 'react';

function OutputDisplay({ response, loading }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(response);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  if (loading) {
    return (
      <div className="output-display">
        <div className="loading">
          <div className="spinner"></div>
          <p>AI is thinking...</p>
        </div>
      </div>
    );
  }

  if (!response) {
    return (
      <div className="output-display">
        <div className="placeholder">
          <div className="placeholder-icon">🤖</div>
          <p>Enter a question and click "Explain Question" to get started</p>
        </div>
      </div>
    );
  }

  const sections = response.split(/(?=\d\. )/).filter(Boolean);

  return (
    <div className="output-display">
      <div className="output-header">
        <h2>Explanation</h2>
        <button className="copy-btn" onClick={handleCopy}>
          {copied ? 'Copied!' : 'Copy'}
        </button>
      </div>
      <div className="explanation-content">
        {sections.map((section, index) => (
          <React.Fragment key={index}>
            {section.includes(':') ? (
              <>
                <h3>{section.split(':')[0]}</h3>
                <p>{section.split(':').slice(1).join(':').trim()}</p>
              </>
            ) : (
              <p>{section.trim()}</p>
            )}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
}

export default OutputDisplay;
