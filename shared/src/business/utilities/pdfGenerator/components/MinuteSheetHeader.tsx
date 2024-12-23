import React from 'react';

export const MinuteSheetHeader = ({ trialSessionLocation, trialStartDate }) => {
  return (
    <div className="minute-sheet-header">
      <div className="us-tax-court-seal"></div>
      <h1>United States Tax Court</h1>
      {/* <div
        style={{
          float: 'right',
          fontFamily: "'Century Schoolbook Std', 'serif'",
          fontSize: '12px',
          transform: 'scale(0.75)',
        }}
      >
        Page <span className="pageNumber"></span> of{' '}
        <span className="totalPages"></span>
      </div> */}
      <div className="court-address">Washington, DC 20217</div>
      <div className="trial-session-location">{trialSessionLocation}</div>
      <div className="court-address">{trialStartDate}</div>
      <div className="clear"></div>
    </div>
  );
};
