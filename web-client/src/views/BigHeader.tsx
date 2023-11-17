import React from 'react';

export const BigHeader = function BigHeader({ text }: { text: string }) {
  return (
    <div className="big-blue-header">
      <div className="grid-container">
        <h1 tabIndex={-1}>{text}</h1>
      </div>
    </div>
  );
};

BigHeader.displayName = 'BigHeader';
