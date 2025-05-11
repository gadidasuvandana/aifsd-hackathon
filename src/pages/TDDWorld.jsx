import React from 'react';
import PageLayout from '../components/layout/PageLayout';
import PumlToOpenApi from '../components/diagram/PumlToOpenApi';

function TDDWorld() {
  return (
    <PageLayout title="Welcome to TDD World!">
      <p>This is where your Test-Driven Development journey begins.</p>
      <PumlToOpenApi />
    </PageLayout>
  );
}

export default TDDWorld; 