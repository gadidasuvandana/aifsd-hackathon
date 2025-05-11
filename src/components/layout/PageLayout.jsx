import React from 'react';

const PageLayout = ({ children, title }) => {
  return (
    <div className="app-container">
      {title && <h1>{title}</h1>}
      {children}
    </div>
  );
};

export default PageLayout; 