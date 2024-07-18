import React from 'react';

export const PageMetaHeaderDocket = ({
  addedDocketNumbers = [],
  docketNumber,
  // do not set this to true unless the content of the PDF also is rendering the century schoolbook font; there is a puppeteer documented here https://github.com/puppeteer/puppeteer/issues/422#issuecomment-759424240
  useCenturySchoolbookFont = false,
}: {
  docketNumber: string;
  addedDocketNumbers?: string[];
  useCenturySchoolbookFont: boolean;
}) => {
  const etAlText = addedDocketNumbers.length > 1 ? ', et al.' : '';
  const docketNumberPageHeader = `Docket No.: ${docketNumber}${etAlText}`;

  const fontFamily = useCenturySchoolbookFont
    ? "'Century Schoolbook Std'"
    : "'nimbus_roman', serif";

  return (
    <div style={{ position: 'relative', top: '-20px' }}>
      <div
        style={{
          float: 'left',
          fontFamily,
          fontSize: '12px',
          transform: 'scale(0.75)',
        }}
      >
        {docketNumberPageHeader}
      </div>
      <div
        style={{
          float: 'right',
          fontFamily,
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
