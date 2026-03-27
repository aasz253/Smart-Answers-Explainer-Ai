import React, { useRef, useState } from 'react';

function InputForm({ question, setQuestion, level, setLevel, onExplain, onSimplify, loading, hasResponse, image, setImage, previewUrl, setPreviewUrl }) {
  const fileInputRef = useRef(null);
  const cameraInputRef = useRef(null);

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCameraCapture = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setImage(null);
    setPreviewUrl(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
    if (cameraInputRef.current) cameraInputRef.current.value = '';
  };

  return (
    <div className="input-form">
      <div className="form-group">
        <label htmlFor="question">Your Question</label>
        <textarea
          id="question"
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          placeholder="Paste your academic question here, or upload an image...&#10;&#10;Example: Find the derivative of x^2 + 3x + 2"
        />
      </div>

      <div className="image-upload-section">
        <label>Add Image (Optional)</label>
        <div className="image-buttons">
          <input
            type="file"
            ref={fileInputRef}
            accept="image/*"
            onChange={handleImageUpload}
            style={{ display: 'none' }}
          />
          <input
            type="file"
            ref={cameraInputRef}
            accept="image/*"
            capture="environment"
            onChange={handleCameraCapture}
            style={{ display: 'none' }}
          />
          <button
            type="button"
            className="image-btn"
            onClick={() => fileInputRef.current?.click()}
            disabled={loading}
          >
            Upload Image
          </button>
          <button
            type="button"
            className="image-btn"
            onClick={() => cameraInputRef.current?.click()}
            disabled={loading}
          >
            Take Photo
          </button>
        </div>
        {previewUrl && (
          <div className="image-preview">
            <img src={previewUrl} alt="Preview" />
            <button type="button" className="remove-image" onClick={removeImage}>×</button>
          </div>
        )}
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
          disabled={loading || (!question.trim() && !image)}
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
