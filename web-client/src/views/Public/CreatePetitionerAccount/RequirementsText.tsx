import React from 'react';

export const RequirementsText = ({ label, valid }) => {
  const className = valid ? 'valid-requirement' : 'invalid-requirement';
  return (
    <>
      <div className={className}>{label}</div>
    </>
  );
};
