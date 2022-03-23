const React = require('react');

export const PageMetaHeaderDocket = ({ docketNumber }) => {
  return (
    <div style={{ position: 'relative', top: '-20px' }}>
      <div
        style={{
          float: 'left',
          fontFamily: "'Century Schoolbook Std', serif",
          fontSize: '12px',
        }}
      >
        Docket No.: {docketNumber}&nbsp;
      </div>
      <div
        style={{
          float: 'right',
          fontFamily: "'Century Schoolbook Std', serif",
          fontSize: '12px',
        }}
      >
        Page <span className="pageNumber"></span> of{' '}
        <span className="totalPages"></span>
      </div>
    </div>
  );
};
