import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useDiagramGenerator } from './hooks/useDiagramGenerator';
import DiagramInput from './components/diagram/DiagramInput';
import DiagramOutput from './components/diagram/DiagramOutput';
import PageLayout from './components/layout/PageLayout';
import TDDWorld from './pages/TDDWorld';
import TestGenerator from './pages/TestGenerator';
import DatabaseSelector from './pages/DatabaseSelector';
import CodeGenerator from './pages/CodeGenerator';
import './styles/App.css';

function DiagramPage() {
  const {
    text,
    setText,
    puml,
    loading,
    error,
    generateDiagram,
    downloadPuml
  } = useDiagramGenerator();

  return (
    <PageLayout title="Business to Dev Assistant">
      <DiagramInput
        text={text}
        setText={setText}
        loading={loading}
        generateDiagram={generateDiagram}
        error={error}
      />
      {puml && <DiagramOutput puml={puml} downloadPuml={downloadPuml} />}
    </PageLayout>
  );
}

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<DiagramPage />} />
        <Route path="/tdd" element={<TDDWorld />} />
        <Route path="/test-generator" element={<TestGenerator />} />
        <Route path="/database-selector" element={<DatabaseSelector />} />
        <Route path="/code-generator" element={<CodeGenerator />} />
      </Routes>
    </Router>
  );
}

export default App;
