import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import { useDiagramGenerator } from './hooks/useDiagramGenerator';
import DiagramInput from './components/diagram/DiagramInput';
import DiagramOutput from './components/diagram/DiagramOutput';
import PageLayout from './components/layout/PageLayout';
import OpenApiSpecGenerator from './pages/OpenApiSpecGenerator';
import TestGenerator from './pages/TestGenerator';
import DatabaseSelector from './pages/DatabaseSelector';
import CodeGenerator from './pages/CodeGenerator';
import './styles/App.css';

const NavItem = ({ to, children }) => {
  const location = useLocation();
  const isActive = location.pathname === to;
  
  return (
    <Link 
      to={to}
      className={`nav-item ${isActive ? 'active' : ''}`}
      style={{
        textDecoration: 'none',
        color: isActive ? '#3498db' : '#333',
        transition: 'color 0.3s ease',
        padding: '12px 20px',
        borderRadius: '8px',
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        fontWeight: isActive ? 600 : 400
      }}
    >
      {children}
    </Link>
  );
};

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
    <PageLayout title="Generate Sequence Diagram from Requirements">
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
      <div className="app-container">
        <nav className="main-nav">
          <div className="nav-brand">
            <h1>ThoughtFlowAI</h1>
          </div>
          <div className="nav-links">
            <NavItem to="/">
              <span className="nav-icon">📊</span>
              Diagram Generator
            </NavItem>
            <NavItem to="/openapi-spec-generator">
              <span className="nav-icon">🧪</span>
 OpenAPI Spec Generator
            </NavItem>
            <NavItem to="/test-generator">
              <span className="nav-icon">🤖</span>
              Test Generator
            </NavItem>
            <NavItem to="/database-selector">
              <span className="nav-icon">💾</span>
              Database Selector
            </NavItem>
            <NavItem to="/code-generator">
              <span className="nav-icon">💻</span>
              Code Generator
            </NavItem>
          </div>
        </nav>
        <main className="main-content">
          <Routes>
            <Route path="/" element={<DiagramPage />} />
            <Route path="/openapi-spec-generator" element={<OpenApiSpecGenerator />} />
            <Route path="/test-generator" element={<TestGenerator />} />
            <Route path="/database-selector" element={<DatabaseSelector />} />
            <Route path="/code-generator" element={<CodeGenerator />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
