import React from 'react';

function InputForm({ question, setQuestion, level, setLevel, onExplain, onSimplify, loading, hasResponse }) {
  return (
    <div className="input-form">
      <div className="form-group">
        <label htmlFor="question">Your Question</label>
        <textarea
          id="question"
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          placeholder="Paste your academic question here...&#10;&#10;Example: Find the derivative of x^2 + 3x + 2"
        />
      </div>

      <div className="form-group">
        <label htmlFor="level">Difficulty Level</label>
        <select
          id="level"
          value={level}
          onChange={(e) => setLevel(e.target.value)}
        >
          <option value="Beginner">Beginner</option>
          <option value="Intermediate">Intermediate</option>
          <option value="Advanced">Advanced</option>
        </select>
      </div>

      <div className="button-group">
        <button
          className="btn btn-primary"
          onClick={onExplain}
          disabled={loading || !question.trim()}
        >
          {loading ? 'Explaining...' : 'Explain Question'}
        </button>
        <button
          className="btn btn-secondary"
          onClick={onSimplify}
          disabled={loading || !hasResponse}
        >
          Explain Simpler
        </button>
      </div>
    </div>
  );
}

export default InputForm;
