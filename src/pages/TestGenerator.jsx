import React, { useState, useEffect } from 'react';
import PageLayout from '../components/layout/PageLayout';
import { useLocation, useNavigate } from 'react-router-dom';
import { callOllama } from '../services/OllamaService';

function TestGenerator() {
  const [selectedLanguage, setSelectedLanguage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [testCases, setTestCases] = useState('');
  const [error, setError] = useState('');
  const [showNextButton, setShowNextButton] = useState(false);
  const [navigateToNextPage, setNavigateToNextPage] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const openApiSpec = location.state?.openApiSpec || '';

  useEffect(() => {
    if (!openApiSpec) {
      setError('No OpenAPI specification found. Please generate one first.');
    }
  }, [openApiSpec]);

  const handleLanguageSelect = async (language) => {
    setSelectedLanguage(language);
    setLoading(true);
    setError('');

    try {
      const prompt = `Generate ${language} unit tests for this OpenAPI spec. Focus on:
1. HTTP status codes
2. Request/response validation
3. Basic error cases
Use appropriate testing framework (pytest for Python, Jest for JavaScript, JUnit for Java).
Keep it simple and focused.

Spec:
${openApiSpec}`;

      const response = await callOllama(prompt);
      setTestCases(response.response);
      setShowNextButton(true);
    } catch (err) {
      setError(`Error generating test cases: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <PageLayout title="Test Case Generator">
      <div className="test-generator-container">
        <style jsx>{`
          .next-btn {
            background-color: #4CAF50;
            color: white;
            border: none;
            padding: 12px 24px;
            border-radius: 4px;
            cursor: pointer;
            font-size: 16px;
            transition: background-color 0.3s;
          }
          
          .next-btn:hover {
            background-color: #45a049;
          }
          
          .next-btn:disabled {
            background-color: #cccccc;
            cursor: not-allowed;
          }

          .button-group {
            display: flex;
            gap: 1rem;
            margin-top: 1.5rem;
            justify-content: flex-end;
            align-items: center;
            width: 100%;
            padding: 0 1rem;
          }

          .download-btn, .next-btn {
            background-color: #2196F3;
            color: white;
            border: none;
            height: 40px;
            line-height: 1;
            padding: 0 24px;
            border-radius: 4px;
            cursor: pointer;
            font-size: 16px;
            font-weight: 500;
            text-align: center;
            transition: background-color 0.2s;
            display: flex;
            align-items: center;
            justify-content: center;
            box-sizing: border-box;
            min-width: 150px;
          }

          .test-input-section {
            background: #1a1a1a;
            border-radius: 8px;
            padding: 1.5rem;
            margin-top: 2rem;
            width: 100%;
            max-width: 1200px;
            margin-left: auto;
            margin-right: auto;
            display: flex;
            flex-direction: column;
            gap: 1.5rem;
            position: relative;
          }

          .loading-overlay {
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: rgba(0, 0, 0, 0.8);
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            z-index: 1000;
            color: white;
            backdrop-filter: blur(5px);
          }

          .loading-spinner {
            width: 2rem;
            height: 2rem;
            border: 3px solid rgba(255, 255, 255, 0.1);
            border-top: 3px solid #ffffff;
            border-radius: 50%;
            animation: spin 1s linear infinite;
            margin-bottom: 1rem;
          }

          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }

          .loading-message {
            font-size: 1.5rem;
            font-weight: 500;
            text-align: center;
            margin-top: 1rem;
            padding: 1rem;
            background: rgba(255, 255, 255, 0.1);
            border-radius: 8px;
            backdrop-filter: blur(3px);
          }

          .test-cases-container {
            width: 100%;
          }

          .button-group {
            display: flex;
            gap: 1rem;
            justify-content: flex-end;
            align-items: center;
            width: 100%;
            padding: 0 1rem;
            margin-top: auto;
          }

          .test-cases-textarea {
            width: 100%;
            min-height: 400px;
            padding: 1.5rem;
            font-size: 1rem;
            line-height: 1.6;
            font-family: 'Courier New', monospace;
            background: #1e1e1e;
            color: #ffffff;
            border: 2px solid #333333;
            border-radius: 6px;
            resize: vertical;
            white-space: pre-wrap;
            overflow-y: auto;
            word-wrap: break-word;
            word-break: break-all;
          }

          h3 {
            color: #ffffff;
            margin-bottom: 1rem;
          }

          .download-btn {
            background-color: #2196F3;
            min-width: 150px;
          }

          .next-btn {
            background-color: #4CAF50;
            min-width: 100px;
          }

          .download-btn:hover, .next-btn:hover {
            opacity: 0.9;
          }

          .download-btn:disabled, .next-btn:disabled {
            background-color: #cccccc;
            cursor: not-allowed;
          }

          .next-btn {
            background-color: #4CAF50;
          }

          .download-btn:hover, .next-btn:hover {
            opacity: 0.9;
          }

          .download-btn:disabled, .next-btn:disabled {
            background-color: #cccccc;
            cursor: not-allowed;
          }

          .language-btn {
            background-color: #f0f0f0;
            color: #333;
            border: none;
            padding: 12px 24px;
            border-radius: 4px;
            cursor: pointer;
            font-size: 16px;
            margin: 10px;
          }

          .language-btn.selected {
            background-color: #4CAF50;
            color: white;
          }

          .language-btn:hover {
            background-color: #e0e0e0;
          }

          .language-btn:disabled {
            background-color: #cccccc;
            cursor: not-allowed;
          }

          .language-icon {
            font-size: 24px;
            margin-right: 10px;
          }
        `}</style>
        {error && <div className="error-message">{error}</div>}
        
        <p className="description">
          Select your preferred programming language to generate test cases for your API.
        </p>
        
        <div className="language-buttons">
          <button 
            className={`language-btn ${selectedLanguage === 'python' ? 'selected' : ''}`}
            onClick={() => handleLanguageSelect('python')}
            disabled={loading}
          >
            <span className="language-icon">🐍</span>
            Python
          </button>
          <button 
            className={`language-btn ${selectedLanguage === 'javascript' ? 'selected' : ''}`}
            onClick={() => handleLanguageSelect('javascript')}
            disabled={loading}
          >
            <span className="language-icon">🟨</span>
            JavaScript
          </button>
          <button 
            className={`language-btn ${selectedLanguage === 'java' ? 'selected' : ''}`}
            onClick={() => handleLanguageSelect('java')}
            disabled={loading}
          >
            <span className="language-icon">☕</span>
            Java
          </button>
        </div>

        {loading && (
          <div className="loading-overlay">
            <div className="loading-spinner"></div>
            <div className="loading-message">Generating test cases...</div>
          </div>
        )}

        {selectedLanguage && !loading && (
          <div className="test-input-section">
            <h3>{selectedLanguage.charAt(0).toUpperCase() + selectedLanguage.slice(1)} Test Cases</h3>
            <div className="test-cases-container">
              <textarea
                className="test-cases-textarea"
                value={testCases}
                readOnly
              />
            </div>
            {testCases && (
              <div className="button-group">
                <button 
                  className="download-btn"
                  onClick={() => {
                    const blob = new Blob([testCases], { type: 'text/plain' });
                    const url = window.URL.createObjectURL(blob);
                    const a = document.createElement('a');
                    a.href = url;
                    a.download = `api_tests_${selectedLanguage}.txt`;
                    document.body.appendChild(a);
                    a.click();
                    window.URL.revokeObjectURL(url);
                    document.body.removeChild(a);
                  }}
                >
                  Download Test Cases
                </button>
                <button 
                  className="next-btn"
                  onClick={() => {
                    navigate('/database-selector', {
                      state: {
                        openApiSpec: openApiSpec,
                        testCases: testCases,
                        selectedLanguage: selectedLanguage
                      }
                    });
                  }}
                  disabled={loading}
                >
                  Next
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </PageLayout>
  );
}

export default TestGenerator;