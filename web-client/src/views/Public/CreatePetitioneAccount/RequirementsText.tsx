import React from 'react';

export const RequirementsText = ({ label, valid }) => {
  return (
    <>
      <div style={{ color: valid ? 'green' : 'red' }}>{label}</div>
    </>
  );
};
