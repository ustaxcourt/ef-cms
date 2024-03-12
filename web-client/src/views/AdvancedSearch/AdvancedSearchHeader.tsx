import React from 'react';

export const AdvancedSearchHeader = () => {
  return (
    <div className="big-blue-header">
      <div className="grid-container display-flex space-between flex-align-center">
        <h1 tabIndex={-1}>Search</h1>
      </div>
    </div>
  );
};

AdvancedSearchHeader.displayName = 'AdvancedSearchHeader';
