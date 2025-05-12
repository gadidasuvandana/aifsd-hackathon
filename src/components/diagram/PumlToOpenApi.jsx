import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const PumlToOpenApi = () => {
  const [pumlText, setPumlText] = useState('');
  const [openApiSpec, setOpenApiSpec] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const generateOpenApiSpec = async () => {
    if (!pumlText.trim()) return;

    setLoading(true);
    setError('');
    try {
      const prompt = `You are an expert API designer. Convert the following PlantUML sequence diagram into a complete OpenAPI 3.0 specification in YAML format. Follow these rules strictly:

1. Create a complete OpenAPI 3.0 specification with:
   - openapi: 3.0.0
   - info section with title, version, and description
   - servers section with appropriate URLs
   - paths section with all endpoints from the sequence diagram
   - components section with schemas and examples

2. For each endpoint:
   - Use appropriate HTTP methods (GET, POST, PUT, DELETE)
   - Define request/response schemas
   - Include proper response codes (200, 201, 400, 401, 403, 404, 500)
   - Add request/response examples
   - Include proper parameter definitions (path, query, header)
   - Add security requirements if authentication is needed

3. For schemas:
   - Create reusable components
   - Use proper data types
   - Include required fields
   - Add descriptions
   - Include examples

4. Format:
   - Use proper YAML indentation
   - Include comments for complex parts
   - Follow OpenAPI 3.0 best practices

5. Only return the YAML specification without any explanation or markdown formatting.

PlantUML Diagram:
${pumlText}`;

      console.log('Sending request to Ollama...');
      const response = await fetch('http://localhost:11434/api/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'gemma3',
          prompt: prompt,
          stream: false,
          options: {
            temperature: 0.7,
            top_p: 0.9,
            max_tokens: 2000
          }
        })
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`HTTP error! status: ${response.status}, message: ${errorText}`);
      }

      const data = await response.json();
      console.log('Received response from Ollama');
      
      if (data.error) {
        throw new Error(data.error);
      }

      // Clean up the response
      let generatedSpec = data.response.trim();
      
      // Ensure it starts with openapi: 3.0.0
      if (!generatedSpec.startsWith('openapi:')) {
        generatedSpec = 'openapi: 3.0.0\n' + generatedSpec;
      }

      // Basic validation
      if (!generatedSpec.includes('paths:') || !generatedSpec.includes('components:')) {
        throw new Error('Generated specification is missing required sections');
      }

      setOpenApiSpec(generatedSpec);
    } catch (error) {
      console.error('Error generating OpenAPI spec:', error);
      setError(`Error: ${error.message}. Please make sure Ollama is running (ollama serve) and the Gemma3 model is installed (ollama pull gemma3).`);
    } finally {
      setLoading(false);
    }
  };

  const downloadOpenApiSpec = () => {
    if (!openApiSpec) return;

    const blob = new Blob([openApiSpec], { type: 'text/yaml' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'openapi-spec.yaml';
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
  };

  return (
    <div className="tdd-container">
      <style jsx>{`
        .tdd-container {
          display: flex;
          gap: 1rem;
          padding: 1rem;
          width: 100%;
          max-width: 1200px;
          margin: 0 auto;
        }

        .tdd-input-section, .tdd-output-section {
          flex: 1;
          width: 100%;
          max-width: 550px;
        }

        .tdd-input-field, .tdd-output-field {
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
          margin-bottom: 2rem;
          white-space: pre-wrap;
          overflow-y: auto;
          overflow-x: auto;
        }

        .loading-spinner {
          width: 2rem;
          height: 2rem;
          border: 3px solid rgba(255, 255, 255, 0.1);
          border-top: 3px solid #ffffff;
          border-radius: 50%;
          animation: spin 1s linear infinite;
          margin-right: 0.5rem;
        }

        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }

        .button-group {
          display: flex;
          gap: 1rem;
          margin-top: 1rem;
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

        .output-buttons {
          display: flex;
          gap: 1rem;
          margin-top: 1rem;
          justify-content: flex-end;
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

        h2 {
          margin-bottom: 1rem;
          color: #ffffff;
        }

        @media (max-width: 768px) {
          .tdd-container {
            flex-direction: column;
          }
        }
      `}</style>

      <div className="tdd-input-section">
        <h2>PlantUML Diagram</h2>
        <textarea
          value={pumlText}
          onChange={(e) => setPumlText(e.target.value)}
          placeholder="Paste your PlantUML sequence diagram here... For example:
@startuml
actor User
participant System
User -> System: Login
System -> System: Validate credentials
System --> User: Success/Error
@enduml"
          className="tdd-input-field"
        />
        <div className="button-group">
          <button 
            onClick={generateOpenApiSpec} 
            disabled={loading || !pumlText.trim()}
            className="generate-btn"
          >
            {loading ? (
              <>
                <div className="loading-spinner"></div>
                Generating...
              </>
            ) : 'Generate OpenAPI Spec'}
          </button>
        </div>
      </div>
      <div className="tdd-output-section">
        <h2>Generated OpenAPI Specification</h2>
        <pre className="tdd-output-field">
          {openApiSpec}
        </pre>
        {error && <div className="error-message">{error}</div>}
        {openApiSpec && (
          <div className="output-buttons">
            <button onClick={downloadOpenApiSpec} className="download-btn">
              <>
              {loading ? (
                <div className="loading-spinner"></div>
              ) : (
                <span className="button-icon">💾</span>
              )}
              Download OpenAPI Spec
            </>
            </button>
            <button onClick={() => navigate('/test-generator', { state: { openApiSpec } })} className="next-btn">
              <span className="button-icon">➡️</span>
              Next: Generate Tests
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default PumlToOpenApi; 