const React = require('react');

export const PageMetaHeaderDocket = ({ docketNumber }) => {
  return (
    <>
      <div
        style={{ float: 'left', fontSize: '12px', transform: 'scale(0.75)' }}
      >
        Docket Number: {docketNumber}
      </div>
      <div
        style={{ float: 'right', fontSize: '12px', transform: 'scale(0.75)' }}
      >
        Page <span className="pageNumber"></span> of{' '}
        <span className="totalPages"></span>
      </div>
    </>
  );
};
