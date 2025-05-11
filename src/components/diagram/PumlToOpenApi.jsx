import React, { useState } from 'react';

const PumlToOpenApi = () => {
  const [pumlText, setPumlText] = useState('');
  const [openApiSpec, setOpenApiSpec] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

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
    <div className="puml-to-openapi-container">
      <div className="input-section">
        <h2>Convert PlantUML to OpenAPI Specification</h2>
        <p className="description">
          Paste your PlantUML sequence diagram below to generate a complete OpenAPI 3.0 specification.
          The generated specification will include paths, schemas, examples, and proper documentation.
        </p>
        <textarea
          value={pumlText}
          onChange={(e) => setPumlText(e.target.value)}
          placeholder="Paste your PlantUML sequence diagram here... For example:
@startuml
actor User
participant System
User -> System: Login Request
System --> User: Login Response
@enduml"
          rows={10}
          className="text-input"
        />
        <button 
          onClick={generateOpenApiSpec} 
          disabled={loading || !pumlText.trim()}
          className="generate-btn"
        >
          {loading ? 'Generating OpenAPI Spec...' : 'Generate OpenAPI Spec'}
        </button>
        {error && <div className="error-message">{error}</div>}
      </div>

      {openApiSpec && (
        <div className="output-section">
          <h3>Generated OpenAPI Specification</h3>
          <pre className="openapi-output">{openApiSpec}</pre>
          <button onClick={downloadOpenApiSpec} className="download-btn">
            Download OpenAPI Spec
          </button>
        </div>
      )}
    </div>
  );
};

export default PumlToOpenApi; 