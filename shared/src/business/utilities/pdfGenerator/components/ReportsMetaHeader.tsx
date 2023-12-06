import React from 'react';

export const ReportsMetaHeader = ({ headerTitle }: { headerTitle: string }) => {
  return (
    <div style={{ position: 'relative', top: '-20px' }}>
      <div
        className="header-title"
        style={{ float: 'left', fontSize: '12px', transform: 'scale(0.75)' }}
      >
        {headerTitle}
      </div>
      <div
        style={{ float: 'right', fontSize: '12px', transform: 'scale(0.75)' }}
      >
        Page <span className="pageNumber"></span> of{' '}
        <span className="totalPages"></span>
      </div>
    </div>
  );
};
