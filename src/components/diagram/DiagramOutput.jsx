import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import mermaid from 'mermaid';
import './DiagramOutput.css';

const DiagramOutput = ({ puml, downloadPuml }) => {
  const navigate = useNavigate();
  const diagramRef = useRef(null);
  const [error, setError] = useState(null);

  // Initialize mermaid once
  useEffect(() => {
    mermaid.initialize({
      startOnLoad: false,
      theme: 'default',
      securityLevel: 'loose',
      sequence: {
        showSequenceNumbers: true,
        actorMargin: 50,
        messageMargin: 40,
        mirrorActors: false,
        bottomMarginAdj: 10,
        useMaxWidth: true,
        width: 150,
        height: 65
      }
    });
  }, []);

  // Render diagram when PUML changes
  useEffect(() => {
    const renderDiagram = async () => {
      if (!puml || !diagramRef.current) return;

      try {
        // Convert PUML to Mermaid syntax
        const mermaidSyntax = convertPumlToMermaid(puml);
        console.log('Mermaid Syntax:', mermaidSyntax);

        // Clear previous content
        diagramRef.current.innerHTML = '';

        // Create a temporary div for rendering
        const tempDiv = document.createElement('div');
        tempDiv.innerHTML = mermaidSyntax;
        tempDiv.className = 'mermaid';
        diagramRef.current.appendChild(tempDiv);

        // Wait for the DOM to be updated
        await new Promise(resolve => setTimeout(resolve, 0));

        // Render the diagram
        try {
          await mermaid.run({
            nodes: [tempDiv]
          });
          setError(null);
        } catch (renderError) {
          console.error('Mermaid render error:', renderError);
          // Try alternative rendering method
          const { svg } = await mermaid.render('diagram', mermaidSyntax);
          tempDiv.innerHTML = svg;
        }
      } catch (error) {
        console.error('Error rendering diagram:', error);
        setError('Error rendering diagram: ' + error.message);
        diagramRef.current.innerHTML = `<div class="error-message">${error.message}</div>`;
      }
    };

    renderDiagram();
  }, [puml]);

  const convertPumlToMermaid = (puml) => {
    if (!puml) return '';

    // Basic conversion from PUML to Mermaid syntax
    let mermaidSyntax = 'sequenceDiagram\n';
    
    // Split the PUML code into lines and process each line
    const lines = puml.split('\n');
    for (const line of lines) {
      const trimmedLine = line.trim();
      
      // Skip empty lines and comments
      if (!trimmedLine || trimmedLine.startsWith('@') || trimmedLine.startsWith('!')) {
        continue;
      }

      // Handle participant declarations
      if (trimmedLine.startsWith('participant')) {
        const participant = trimmedLine.split('participant')[1].trim();
        mermaidSyntax += `    participant ${participant}\n`;
        continue;
      }

      // Convert PUML syntax to Mermaid syntax
      if (trimmedLine.includes('->')) {
        const [participant1, rest] = trimmedLine.split('->');
        const [participant2, message] = rest.split(':');
        if (participant1 && participant2 && message) {
          mermaidSyntax += `    ${participant1.trim()}->>${participant2.trim()}: ${message.trim()}\n`;
        }
      } else if (trimmedLine.includes('-->')) {
        const [participant1, rest] = trimmedLine.split('-->');
        const [participant2, message] = rest.split(':');
        if (participant1 && participant2 && message) {
          mermaidSyntax += `    ${participant1.trim()}-->>${participant2.trim()}: ${message.trim()}\n`;
        }
      }
    }

    return mermaidSyntax;
  };

  const handleDownload = () => {
    // Create a blob with the PUML content
    const blob = new Blob([puml], { type: 'text/plain' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'sequence-diagram.puml';
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
  };

  return (
    <div className="output-section">
      <div className="diagram-container">
        {error && <div className="error-message">{error}</div>}
        <div ref={diagramRef} className="mermaid-container"></div>
      </div>

      <div className="output-buttons">
        <button onClick={handleDownload} className="download-btn">
          <span className="button-icon">💾</span>
          Download PUML
        </button>
        <button onClick={() => navigate('/openapi-spec-generator')} className="next-btn">
          <span className="button-icon">➡️</span>
          Next
        </button>
      </div>
    </div>
  );
};

export default DiagramOutput; 