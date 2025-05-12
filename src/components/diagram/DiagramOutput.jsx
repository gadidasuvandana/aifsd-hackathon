import React from 'react';
import { useNavigate } from 'react-router-dom';

const DiagramOutput = ({ puml, downloadPuml }) => {
  const navigate = useNavigate();

  return (
    <div className="output-section">
      <style jsx>{`
        .output-section {
          width: 100%;
          max-width: 1200px;
          margin: 0 auto;
          padding: 2rem;
        }

        .code-output {
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

        .output-buttons {
          display: flex;
          gap: 1rem;
          justify-content: flex-end;
          margin-top: 1rem;
        }

        .download-btn, .next-btn {
          background-color: #2196F3;
          color: white;
          border: none;
          padding: 12px 24px;
          border-radius: 4px;
          cursor: pointer;
          font-size: 16px;
          transition: background-color 0.3s;
        }

        .download-btn:hover, .next-btn:hover {
          background-color: #1976D2;
        }

        .button-icon {
          margin-right: 0.5rem;
        }
      `}</style>
      <div className="code-output">
        {puml}
      </div>
      <div className="output-buttons">
        <button onClick={downloadPuml} className="download-btn">
          <span className="button-icon">💾</span>
          Download PUML
        </button>
        <button onClick={() => navigate('/tdd')} className="next-btn">
          <span className="button-icon">➡️</span>
          Next
        </button>
      </div>
    </div>
  );
};

export default DiagramOutput; 