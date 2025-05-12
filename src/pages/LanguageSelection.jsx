import React from 'react';
import PageLayout from '../components/layout/PageLayout';

function LanguageSelection() {
  return (
    <PageLayout title="Choose Your Programming Language">
      <div className="language-selection-container">
        <p className="description">
          Select the programming language you want to use for your test cases.
        </p>
        <div className="language-grid">
          <button className="language-btn">JavaScript</button>
          <button className="language-btn">Python</button>
          <button className="language-btn">Java</button>
          <button className="language-btn">TypeScript</button>
          <button className="language-btn">Go</button>
          <button className="language-btn">Ruby</button>
        </div>
      </div>
    </PageLayout>
  );
}

export default LanguageSelection; 