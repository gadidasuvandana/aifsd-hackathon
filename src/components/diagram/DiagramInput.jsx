import React from 'react';

const DiagramInput = ({ text, setText, loading, generateDiagram, error }) => {
  return (
    <div className="input-container">
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Enter your business requirements here... For example: 'User clicks login button, System validates credentials, System creates session if valid, System returns success/error message'"
        rows={6}
        className="text-input"
      />
      <button 
        onClick={generateDiagram} 
        disabled={loading || !text.trim()}
        className="generate-btn"
      >
        {loading ? 'Generating...' : 'Generate Diagram'}
      </button>
      {error && <div className="error-message">{error}</div>}
    </div>
  );
};

export default DiagramInput; 