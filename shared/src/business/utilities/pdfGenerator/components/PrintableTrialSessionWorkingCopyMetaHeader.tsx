import React from 'react';

export const PrintableTrialSessionWorkingCopyMetaHeader = ({ headerTitle }) => {
  return (
    <div style={{ position: 'relative', top: '-20px' }}>
      <div
        className="header-title"
        style={{
          float: 'left',
          fontFamily: "'Century Schoolbook Std', 'serif'",
          fontSize: '12px',
          marginLeft: '-60px',
          transform: 'scale(0.75)',
        }}
      >
        {headerTitle}
      </div>
      <div
        style={{
          float: 'right',
          fontFamily: "'Century Schoolbook Std', 'serif'",
          fontSize: '12px',
          transform: 'scale(0.75)',
        }}
      >
        Page <span className="pageNumber"></span> of{' '}
        <span className="totalPages"></span>
      </div>
    </div>
  );
};
