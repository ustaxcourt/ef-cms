const React = require('react');

export const ReportsMetaHeader = ({ headerTitle }) => {
  return (
    <>
      <div style={{ float: 'left', fontSize: '12px' }}>{headerTitle}</div>
      <div style={{ float: 'right', fontSize: '12px' }}>
        Page <span className="pageNumber"></span> of{' '}
        <span className="totalPages"></span>
      </div>
    </>
  );
};
