const React = require('react');

export const PageMetaHeaderDocket = ({ docketNumber }) => {
  return (
    <div style={{ position: 'relative', top: '-20px' }}>
      <div
        style={{
          float: 'left',
          fontFamily: "'nimbus_roman', serif",
          fontSize: '12px',
          transform: 'scale(0.75)',
        }}
      >
        Docket No.: {docketNumber}
      </div>
      <div
        style={{
          float: 'right',
          fontFamily: "'nimbus_roman', serif",
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
