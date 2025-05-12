import React, { useState, useEffect } from 'react';
import PageLayout from '../components/layout/PageLayout';
import { useLocation, useNavigate } from 'react-router-dom';
import { callOllama } from '../services/OllamaService';

function CodeGenerator() {
  const [loading, setLoading] = useState(false);
  const [generatedCode, setGeneratedCode] = useState('');
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    if (successMessage) {
      const timer = setTimeout(() => {
        setSuccessMessage('');
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [successMessage]);
  const location = useLocation();
  const navigate = useNavigate();

  const { openApiSpec, testCases, selectedLanguage, selectedDatabase } = location.state || {};

  useEffect(() => {
    if (openApiSpec && testCases && selectedLanguage && selectedDatabase) {
      // Show the button immediately
      setLoading(false);
    }
  }, [openApiSpec, testCases, selectedLanguage, selectedDatabase]);

  const handleGenerateAndDownload = async () => {
    if (!openApiSpec || !testCases || !selectedLanguage || !selectedDatabase) {
      setError('Missing required information. Please go back and complete all steps.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const prompt = `You are gemma3, an expert code generator. Generate ${selectedLanguage} code that satisfies the following test cases and uses ${selectedDatabase} as the database:

OpenAPI Specification:
${openApiSpec}

Test Cases:
${testCases}

Architecture Requirements:
1. Implement a 3-tier architecture with clear separation of concerns:
   - Presentation Layer (Controllers/Endpoints)
   - Business Logic Layer (Services)
   - Data Access Layer (Repositories)

2. For ${selectedLanguage}:
   - Use appropriate design patterns (e.g., Repository, Service, DTO)
   - Implement proper dependency injection
   - Use modern ${selectedLanguage} features and libraries
   - Follow SOLID principles

3. For ${selectedDatabase}:
   - Use appropriate connection pooling
   - Implement proper transaction handling
   - Use parameterized queries to prevent SQL injection
   - Include proper indexing recommendations
   - Follow database best practices

4. Additional Requirements:
   - Implement proper error handling and validation
   - Use appropriate data models and DTOs
   - Include proper logging
   - Implement proper configuration management
   - Follow security best practices

5. Code Structure:
   - Presentation Layer: Controllers/Endpoints that handle HTTP requests
   - Business Logic Layer: Services that contain business logic
   - Data Access Layer: Repositories that handle database operations

6. For ${selectedDatabase}:
   - MongoDB: Use Mongoose with proper schema definitions
   - Oracle: Use appropriate JDBC/ODBC connections with proper connection pooling
   - Neo4j: Use Neo4j Driver with proper Cypher queries

Please generate the complete code with all necessary imports, dependencies, and configuration files. The code should be organized in a way that makes it easy to maintain and extend.`;

      const response = await callOllama(prompt);
      
      if (response && response.response) {
        // Clean up the response by removing any system messages or prompts
        const cleanedCode = response.response
          .replace(/You are gemma3, an expert code generator\./, '')
          .trim();
          
        // Organize the code by sections
        const codeSections = {
          'Presentation Layer': [],
          'Business Logic Layer': [],
          'Data Access Layer': [],
          'Configuration': [],
          'Models': [],
          'Dependencies': []
        };

        // Split the code into sections
        const lines = cleanedCode.split('\n');
        let currentSection = null;

        lines.forEach(line => {
          const trimmedLine = line.trim();
          if (trimmedLine.startsWith('## ')) {
            // New section
            currentSection = trimmedLine.substring(3);
          } else if (currentSection) {
            codeSections[currentSection].push(line);
          }
        });

        // Format the code by section
        let formattedCode = '';
        Object.entries(codeSections).forEach(([section, lines]) => {
          if (lines.length > 0) {
            formattedCode += `\n// ${section}\n${lines.join('\n')}`;
          }
        });

        // Create a blob and download the file
        const blob = new Blob([cleanedCode], { type: 'text/plain' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `api_code_${selectedLanguage}_${selectedDatabase.toLowerCase()}.txt`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);

        // Show success message
        setSuccessMessage('Code generated and downloaded successfully!');
        
        // Add a small delay before showing the generated code
        setTimeout(() => {
          setGeneratedCode(cleanedCode);
        }, 1000);
      } else {
        throw new Error('Invalid response format from code generator');
      }
    } catch (err) {
      setError(`Error generating code: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => {
    navigate('/database-selector');
  };

  return (
    <PageLayout title="Code Generator">
      <div className="code-generator-container">
        <style jsx>{`
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

        .code-container {
          width: 100%;
          margin-bottom: 2rem;
        }

        .code-textarea {
          width: 100%;
          max-width: 1200px;
          min-height: 800px;
          padding: 2rem;
          font-size: 1rem;
          line-height: 1.6;
          font-family: 'Fira Code', 'Courier New', monospace;
          background: #000000;
          color: #ffffff;
          border: 2px solid #000000;
          border-radius: 6px;
          resize: vertical;
          white-space: pre-wrap;
          overflow-y: auto;
          word-wrap: break-word;
          word-break: break-all;
          scrollbar-width: thin;
          scrollbar-color: #666666 #000000;
          
          &::-webkit-scrollbar {
            width: 8px;
          }
          
          &::-webkit-scrollbar-track {
            background: #000000;
            white-space: pre-wrap;
            overflow-y: auto;
            word-wrap: break-word;
            word-break: break-all;
            scrollbar-width: thin;
            scrollbar-color: #666666 #000000;
            
            &::-webkit-scrollbar {
              width: 8px;
            }
            
            &::-webkit-scrollbar-track {
              background: #000000;
            }
            
            &::-webkit-scrollbar-thumb {
              background: #666666;
              border-radius: 4px;
            }
            
            &::-webkit-scrollbar-thumb:hover {
              background: #888888;
            }
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

          .generate-btn {
            background-color: #4CAF50;
            color: white;
            border: none;
            padding: 12px 24px;
            border-radius: 4px;
            cursor: pointer;
            font-size: 16px;
            transition: background-color 0.3s;
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

          .success-message {
            color: #4CAF50;
            margin: 1rem 0;
            padding: 1rem;
            background: #e8f5e9;
            border-radius: 4px;
          }
        `}</style>

        {error && <div className="error-message">{error}</div>}
        {successMessage && <div className="success-message">{successMessage}</div>}

        {generatedCode ? (
          <div className="code-output-section">
            <h3>Generated Code</h3>
            <div className="code-container">
              <textarea
                className="code-textarea"
                value={generatedCode}
                readOnly
              />
            </div>
          </div>
        ) : (
          <button
            className="generate-btn"
            onClick={handleGenerateAndDownload}
            disabled={loading}
          >
            {loading ? 'Generating...' : 'Generate and DownloadCode'}
          </button>
        )}
        {loading && (
          <div className="loading-overlay">
            <div className="loading-spinner"></div>
            <div className="loading-message">Generating your code...</div>
          </div>
        )}
      </div>
    </PageLayout>
  );
}

export default CodeGenerator;
