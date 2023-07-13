import { SubmittedCavCasesTable } from './SubmittedCavCasesTable';
import React from 'react';

export const SubmittedCavCases = () => {
  return (
    <div className="margin-top-6">
      <h1>Submitted/CAV Cases</h1>
      <SubmittedCavCasesTable />
    </div>
  );
};

SubmittedCavCases.displayName = 'SubmittedCavCases';
