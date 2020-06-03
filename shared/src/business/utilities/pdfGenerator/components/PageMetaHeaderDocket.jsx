const React = require('react');

export const PageMetaHeaderDocket = ({ docketNumber }) => {
  return (
    <>
      <div style={{ float: 'left', fontSize: '12px' }}>
        Docket Number: {docketNumber}
      </div>
      <div style={{ float: 'right', fontSize: '12px' }}>
        Page <span className="pageNumber"></span> of{' '}
        <span className="totalPages"></span>
      </div>
    </>
  );
};
