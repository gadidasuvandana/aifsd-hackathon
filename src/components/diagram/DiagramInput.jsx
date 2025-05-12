import React from 'react';

const DiagramInput = ({ text, setText, loading, generateDiagram, error }) => {
  return (
    <div className="input-container">
      <style jsx>{`
        .input-container {
          width: 100%;
          max-width: 1200px;
          margin: 0 auto;
          padding: 2rem;
        }

        .input-group {
          display: flex;
          flex-direction: column;
          gap: 1rem;
          margin-bottom: 2rem;
        }

        .text-input {
          width: 100%;
          min-height: 600px;
          padding: 1.5rem;
          font-size: 1rem;
          line-height: 1.6;
          font-family: 'Courier New', monospace;
          background: #1e1e1e;
          color: #ffffff;
          border: 2px solid #333333;
          border-radius: 6px;
          resize: vertical;
          margin-bottom: 1.5rem;
          white-space: pre-wrap;
          overflow-y: auto;
          word-wrap: break-word;
          word-break: break-all;
        }

        .generate-btn {
          background-color: #4CAF50;
          color: white;
          border: none;
          padding: 12px 24px;
          border-radius: 4px;
          cursor: pointer;
          font-size: 16px;
          transition: background-color 0.3s;
          display: block;
          margin: 0 auto;
        }

        .generate-btn:hover {
          background-color: #45a049;
        }

        .generate-btn:disabled {
          background-color: #cccccc;
          cursor: not-allowed;
        }

        .error-message {
          color: #e74c3c;
          margin: 1rem 0;
          padding: 1rem;
          background: #ffebee;
          border-radius: 4px;
        }
      `}</style>
      <div className="input-group">
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
      </div>
      {error && <div className="error-message">{error}</div>}
    </div>
  );
};

export default DiagramInput; 