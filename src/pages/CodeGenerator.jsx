import React, { useState, useEffect } from 'react';
import PageLayout from '../components/layout/PageLayout';
import { useLocation, useNavigate } from 'react-router-dom';
import { callOllama } from '../services/OllamaService';

function CodeGenerator() {
  const [loading, setLoading] = useState(false);
  const [generatedCode, setGeneratedCode] = useState('');
  const [error, setError] = useState('');
  const location = useLocation();
  const navigate = useNavigate();

  const { openApiSpec, testCases, selectedLanguage, selectedDatabase } = location.state || {};

  useEffect(() => {
    if (openApiSpec && testCases && selectedLanguage && selectedDatabase) {
      generateCode();
    }
  }, [openApiSpec, testCases, selectedLanguage, selectedDatabase]);

  const generateCode = async () => {
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

        setGeneratedCode(formattedCode);
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
        {error && <div className="error-message">{error}</div>}
        
        <p className="description">
          Generating code for your API using {selectedDatabase} database...
        </p>

        {loading && (
          <div className="loading-message">
            Generating code...
          </div>
        )}

        {generatedCode && (
          <div className="code-output-section">
            <h3>Generated Code</h3>
            <div className="code-content">
              <pre className="code-block">{generatedCode}</pre>
            </div>
          </div>
        )}

        <div className="action-buttons">
          <button onClick={handleBack} disabled={loading}>
            Back
          </button>
          {generatedCode && (
            <button 
              onClick={() => {
                // Add download functionality
                const blob = new Blob([generatedCode], { type: 'text/plain' });
                const url = window.URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = `api_${selectedDatabase.toLowerCase()}_code.${selectedLanguage}`;
                document.body.appendChild(a);
                a.click();
                window.URL.revokeObjectURL(url);
                document.body.removeChild(a);
              }}
              disabled={loading}
            >
              Download Code
            </button>
          )}
        </div>
      </div>
    </PageLayout>
  );
}

export default CodeGenerator;
