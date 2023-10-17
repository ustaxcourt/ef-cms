import React from 'react';

export const RequirementsText = ({ label, valid }) => {
  return (
    <>
      <div>
        {valid ? 'Y' : 'X'} {label}
      </div>
    </>
  );
};
