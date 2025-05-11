import { useState } from 'react';

export const useDiagramGenerator = () => {
  const [text, setText] = useState('');
  const [puml, setPuml] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const generateDiagram = async () => {
    if (!text.trim()) return;

    setLoading(true);
    setError('');
    try {
      const prompt = `Create a PlantUML sequence diagram using the latest syntax (PlantUML 1.2024.3) for the following business requirements. Follow these rules strictly:

1. Use ONLY @startuml and @enduml tags (DO NOT use @plantuml)
2. Use proper sequence diagram syntax:
   - Use 'participant' for main actors
   - Use 'actor' for external users
   - Use 'boundary' for UI elements
   - Use 'control' for controllers
   - Use 'entity' for data objects
3. Message syntax:
   - Use '->' for synchronous messages
   - Use '-->' for return messages
   - Use '-[#color]->' for colored messages
   - Use 'note left/right' for notes
4. Activation:
   - Use 'activate' and 'deactivate' for lifelines
   - Use '++' and '--' for automatic activation
5. Include proper spacing and alignment
6. Use proper indentation
7. Only return the PlantUML code without any explanation or markdown formatting
8. DO NOT use any deprecated syntax or @plantuml tag

Business Requirements:
${text}`;

      const response = await fetch('http://localhost:11434/api/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'gemma3',
          prompt: prompt,
          stream: false
        })
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`HTTP error! status: ${response.status}, message: ${errorText}`);
      }

      const data = await response.json();
      
      if (data.error) {
        throw new Error(data.error);
      }

      let generatedPuml = data.response.trim();
      generatedPuml = generatedPuml.replace(/@plantuml/g, '@startuml');
      
      if (!generatedPuml.startsWith('@startuml')) {
        generatedPuml = '@startuml\n' + generatedPuml;
      }
      if (!generatedPuml.endsWith('@enduml')) {
        generatedPuml = generatedPuml + '\n@enduml';
      }

      if (!generatedPuml.includes('->') && !generatedPuml.includes('-->')) {
        throw new Error('Generated diagram does not contain any message flows');
      }

      const styleAdditions = `
skinparam sequence {
    ArrowColor #666666
    ActorBorderColor #666666
    LifeLineBorderColor #666666
    ParticipantBorderColor #666666
    ParticipantBackgroundColor #FFFFFF
}
`;
      generatedPuml = generatedPuml.replace('@startuml', `@startuml\n${styleAdditions}`);

      setPuml(generatedPuml);
    } catch (error) {
      console.error('Error generating diagram:', error);
      setError(`Error: ${error.message}. Please make sure Ollama is running (ollama serve) and the Gemma3 model is installed (ollama pull gemma3).`);
    } finally {
      setLoading(false);
    }
  };

  const downloadPuml = () => {
    if (!puml) return;

    const blob = new Blob([puml], { type: 'text/plain' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'diagram.puml';
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
  };

  return {
    text,
    setText,
    puml,
    loading,
    error,
    generateDiagram,
    downloadPuml
  };
}; 