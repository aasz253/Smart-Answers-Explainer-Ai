import React, { useRef, useCallback } from 'react';

function InputForm({ question, setQuestion, level, setLevel, onExplain, onSimplify, loading, hasResponse, image, setImage, previewUrl, setPreviewUrl }) {
  const fileInputRef = useRef(null);
  const textareaRef = useRef(null);

  const processImage = useCallback((file) => {
    if (file && file.type.startsWith('image/')) {
      setImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result);
      };
      reader.readAsDataURL(file);
    }
  }, [setImage, setPreviewUrl]);

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      processImage(file);
    }
  };

  const handlePaste = useCallback((e) => {
    const items = e.clipboardData?.items;
    if (items) {
      for (const item of items) {
        if (item.type.startsWith('image/')) {
          const file = item.getAsFile();
          if (file) {
            e.preventDefault();
            processImage(file);
            return;
          }
        }
      }
    }
  }, [processImage]);

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    const file = e.dataTransfer?.files?.[0];
    if (file && file.type.startsWith('image/')) {
      processImage(file);
    }
  }, [processImage]);

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const removeImage = () => {
    setImage(null);
    setPreviewUrl(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const insertImageInText = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="input-form">
      <div 
        className="combined-input"
        onPaste={handlePaste}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
      >
        <textarea
          ref={textareaRef}
          id="question"
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          placeholder="Type your question here, or paste/drop an image...&#10;&#10;Example: Explain this math problem"
        />
        
        {previewUrl && (
          <div className="image-preview-inline">
            <img src={previewUrl} alt="Attached" />
            <button type="button" className="remove-image-inline" onClick={removeImage}>×</button>
          </div>
        )}
      </div>

      <input
        type="file"
        ref={fileInputRef}
        accept="image/*"
        onChange={handleImageUpload}
        style={{ display: 'none' }}
      />

      <div className="input-toolbar">
        <div className="image-tools">
          <button
            type="button"
            className="tool-btn"
            onClick={insertImageInText}
            disabled={loading}
            title="Upload Image"
          >
            📷 Add Image
          </button>
          <span className="tool-hint">or paste an image directly</span>
        </div>

        <div className="form-group level-select">
          <label htmlFor="level">Level:</label>
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
      </div>

      <div className="button-group">
        <button
          className="btn btn-primary"
          onClick={onExplain}
          disabled={loading || (!question.trim() && !previewUrl)}
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
