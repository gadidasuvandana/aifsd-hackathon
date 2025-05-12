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
            margin-top: 20px;
            transition: background-color 0.3s;
          }
          
          .next-btn:hover {
            background-color: #45a049;
          }
          
          .next-btn:disabled {
            background-color: #cccccc;
            cursor: not-allowed;
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

        {showNextButton && (
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
        )}

        {loading && (
          <div className="loading-message">
            Generating test cases...
          </div>
        )}

        {selectedLanguage && !loading && (
          <div className="test-output-section">
            <h3>{selectedLanguage.charAt(0).toUpperCase() + selectedLanguage.slice(1)} Test Cases</h3>
            <div className="test-content">
              <pre className="test-cases">{testCases}</pre>
            </div>
            {showNextButton && (
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
            )}
          </div>
        )}
      </div>
    </PageLayout>
  );
}

export default TestGenerator;