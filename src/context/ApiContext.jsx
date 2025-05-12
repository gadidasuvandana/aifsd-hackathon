import React, { createContext, useContext, useState } from 'react';

const ApiContext = createContext();

export function ApiProvider({ children }) {
  const [openApiSpec, setOpenApiSpec] = useState('');

  return (
    <ApiContext.Provider value={{ openApiSpec, setOpenApiSpec }}>
      {children}
    </ApiContext.Provider>
  );
}

export function useApi() {
  const context = useContext(ApiContext);
  if (!context) {
    throw new Error('useApi must be used within an ApiProvider');
  }
  return context;
} 