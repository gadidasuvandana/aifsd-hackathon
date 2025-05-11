import React from 'react';
import { useNavigate } from 'react-router-dom';

const DiagramOutput = ({ puml, downloadPuml }) => {
  const navigate = useNavigate();

  return (
    <div className="output-container">
      <pre className="puml-output">{puml}</pre>
      <div className="button-container">
        <button onClick={downloadPuml} className="download-btn">
          Download PUML
        </button>
        <button onClick={() => navigate('/tdd')} className="next-btn">
          Next
        </button>
      </div>
    </div>
  );
};

export default DiagramOutput; 