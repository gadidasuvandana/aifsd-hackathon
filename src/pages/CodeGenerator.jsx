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
      <style jsx>{`
        .loading-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(255, 255, 255, 0.8);
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          gap: 20px;
          z-index: 1000;
        }

        .loading-spinner {
          width: 50px;
          height: 50px;
          border: 5px solid #f3f3f3;
          border-top: 5px solid #3498db;
          border-radius: 50%;
          animation: spin 1s linear infinite;
        }

        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }

        .loading-message {
          font-size: 1.2em;
          color: #333;
        }

        {{ ... existing styles ... }}
        .generate-btn {
          display: block;
          margin: 20px auto;
          padding: 15px 30px;
          background: #4CAF50;
          color: white;
          border: none;
          border-radius: 4px;
          cursor: pointer;
          font-size: 1.1em;
          text-align: center;
          transition: background-color 0.3s ease;
        }

        .generate-btn:hover {
          background: #45a049;
        }

        .generate-btn:disabled {
          background: #cccccc;
          cursor: not-allowed;
        }

        .success-message {
          background-color: #d4edda;
          color: #155724;
          padding: 15px;
          border-radius: 4px;
          margin-bottom: 20px;
          text-align: center;
          animation: fadeInOut 3s ease-in-out;
        }

        @keyframes fadeInOut {
          0% { opacity: 0; transform: translateY(-10px); }
          20% { opacity: 1; transform: translateY(0); }
          80% { opacity: 1; transform: translateY(0); }
          100% { opacity: 0; transform: translateY(-10px); }
        }

        .error-message {
          background-color: #ffebee;
          color: #c62828;
          padding: 15px;
          border-radius: 4px;
          margin-bottom: 20px;
          text-align: center;
        }

        .code-container {
          max-width: 800px;
          margin: 0 auto;
          padding: 20px;
        }

        .code-display {
          background: #f5f5f5;
          padding: 20px;
          border-radius: 8px;
          overflow-x: auto;
          font-family: 'Courier New', monospace;
          white-space: pre-wrap;
        }
      `}</style>

      {error && <div className="error-message">{error}</div>}
      {successMessage && <div className="success-message">{successMessage}</div>}

      <div className="code-container">
        <button
          className="generate-btn"
          onClick={handleGenerateAndDownload}
          disabled={loading}
        >
          {loading ? 'Generating...' : 'Generate and Download Code'}
        </button>

        {loading && (
          <div className="loading-overlay">
            <div className="loading-spinner"></div>
            <div className="loading-message">Generating and downloading code...</div>
          </div>
        )}

        {generatedCode && (
          <div className="code-display">
            {generatedCode}
          </div>
        )}
      </div>
    </PageLayout>
  );
}

export default CodeGenerator;
