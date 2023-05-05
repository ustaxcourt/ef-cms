import React from 'react';

export const PageMetaHeaderDocket = ({
  docketNumber,
  // do not set this to true unless the content of the PDF also is rendering the century schoolbook font; there is a puppeteer documented here https://github.com/puppeteer/puppeteer/issues/422#issuecomment-759424240
  useCenturySchoolbookFont = false,
}) => {
  return (
    <div style={{ position: 'relative', top: '-20px' }}>
      <div
        style={{
          float: 'left',
          fontFamily: useCenturySchoolbookFont
            ? "'Century Schoolbook Std'"
            : "'nimbus_roman', serif",
          fontSize: '12px',
          transform: 'scale(0.75)',
        }}
      >
        Docket No.: {docketNumber}
      </div>
      <div
        style={{
          float: 'right',
          fontFamily: useCenturySchoolbookFont
            ? "'Century Schoolbook Std'"
            : "'nimbus_roman', serif",
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
