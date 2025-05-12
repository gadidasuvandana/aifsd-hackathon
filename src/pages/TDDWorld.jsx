import React from 'react';
import PageLayout from '../components/layout/PageLayout';
import PumlToOpenApi from '../components/diagram/PumlToOpenApi';

function TDDWorld() {
  return (
    <PageLayout title="Generate OpenAPI from PlantUML">
      <PumlToOpenApi />
    </PageLayout>
  );
}

export default TDDWorld; 