import React from 'react';
import PageLayout from '../components/layout/PageLayout';
import { useLocation, useNavigate } from 'react-router-dom';

function DatabaseSelector() {
  const navigate = useNavigate();
  const location = useLocation();
  const { openApiSpec, testCases, selectedLanguage } = location.state || {};

  const databases = [
    { 
      name: 'MongoDB', 
      icon: <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
        <path fill="#47a248" d="M50 10C22.4 10 0 32.4 0 60c0 27.6 22.4 50 50 50 27.6 0 50-22.4 50-50C100 32.4 77.6 10 50 10z"/>
        <path fill="#fff" d="M50 20c11.1 0 20 8.9 20 20 0 11.1-8.9 20-20 20-11.1 0-20-8.9-20-20C30 28.9 38.9 20 50 20z"/>
      </svg>,
      color: '#47a248'
    },
    { 
      name: 'Oracle', 
      icon: <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
        <path fill="#f00" d="M50 10C22.4 10 0 32.4 0 60c0 27.6 22.4 50 50 50 27.6 0 50-22.4 50-50C100 32.4 77.6 10 50 10z"/>
        <path fill="#fff" d="M50 20c11.1 0 20 8.9 20 20 0 11.1-8.9 20-20 20-11.1 0-20-8.9-20-20C30 28.9 38.9 20 50 20z"/>
      </svg>,
      color: '#f00'
    },
    { 
      name: 'Neo4j', 
      icon: <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
        <path fill="#0084ff" d="M50 10C22.4 10 0 32.4 0 60c0 27.6 22.4 50 50 50 27.6 0 50-22.4 50-50C100 32.4 77.6 10 50 10z"/>
        <path fill="#fff" d="M50 20c11.1 0 20 8.9 20 20 0 11.1-8.9 20-20 20-11.1 0-20-8.9-20-20C30 28.9 38.9 20 50 20z"/>
      </svg>,
      color: '#0084ff'
    }
  ];

  const handleDatabaseSelect = (database) => {
    if (!openApiSpec || !testCases || !selectedLanguage) {
      alert('Missing required information. Please go back and complete all steps.');
      return;
    }

    navigate('/code-generator', {
      state: {
        openApiSpec,
        testCases,
        selectedLanguage,
        selectedDatabase: database
      }
    });
  };

  return (
    <PageLayout title="Database Selection">
      <div className="database-selector-container">
        <style jsx>{`
          .database-selector-container {
            max-width: 800px;
            margin: 0 auto;
            padding: 20px;
          }
          
          .description {
            margin-bottom: 30px;
            font-size: 1.2em;
            color: #555;
          }
          
          .database-buttons {
            display: flex;
            flex-wrap: wrap;
            gap: 20px;
            justify-content: center;
          }
          
          .database-btn {
            background: #f5f5f5;
            border: 2px solid #ddd;
            border-radius: 10px;
            padding: 20px;
            width: 250px;
            text-align: center;
            cursor: pointer;
            transition: all 0.3s ease;
            display: flex;
            flex-direction: column;
            align-items: center;
            gap: 10px;
          }
          
          .database-btn:hover {
            background: #e5e5e5;
            border-color: #ccc;
            transform: translateY(-2px);
          }
          
          .database-icon {
            width: 60px;
            height: 60px;
            display: flex;
            align-items: center;
            justify-content: center;
          }
          
          .database-icon.mongodb-icon {
            color: #47a248;
          }
          
          .database-icon.oracle-icon {
            color: #f00;
          }
          
          .database-icon.neo4j-icon {
            color: #0084ff;
          }
        `}</style>

        <p className="description">
          Select your preferred database for integration with your API.
        </p>
        
        <div className="database-buttons">
          {databases.map((db) => (
            <button 
              key={db.name}
              className="database-btn"
              onClick={() => handleDatabaseSelect(db.name)}
            >
              <div className="database-icon">
                {db.icon}
              </div>
              {db.name}
            </button>
          ))}
        </div>
      </div>
    </PageLayout>
  );
}

export default DatabaseSelector;
